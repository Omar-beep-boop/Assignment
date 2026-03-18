// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CertificateVerification
 * @dev A decentralized smart contract for issuing and verifying academic certificates
 * @notice This contract stores certificate hashes on-chain for immutable verification
 */

contract CertificateVerification {
    // ============ Data Structures ============

    /**
     * @dev Structure to store certificate metadata
     */
    struct Certificate {
        bytes32 certificateHash;      // Cryptographic hash of the certificate document
        address issuerAddress;        // Address of the issuing institution
        address studentAddress;       // Address of the student
        uint256 issueDate;           // Timestamp of certificate issuance
        string ipfsHash;             // IPFS Content Identifier (CID) of the document
        string certificateId;        // Unique identifier for the certificate
        bool isRevoked;              // Flag indicating if the certificate has been revoked
    }

    /**
     * @dev Structure to store issuer information
     */
    struct Issuer {
        string institutionName;
        string institutionEmail;
        bool isApproved;
    }

    // ============ State Variables ============

    // Mapping from certificate hash to certificate details
    mapping(bytes32 => Certificate) public certificates;

    // Mapping from issuer address to issuer information
    mapping(address => Issuer) public issuers;

    // Mapping from student address to array of certificate hashes they own
    mapping(address => bytes32[]) public studentCertificates;

    // Mapping from issuer address to array of certificate hashes they issued
    mapping(address => bytes32[]) public issuerCertificates;

    // Admin address (contract deployer)
    address public admin;

    // Counter for total certificates issued
    uint256 public totalCertificates;

    // ============ Events ============

    /**
     * @dev Emitted when a new certificate is issued
     */
    event CertificateIssued(
        bytes32 indexed certificateHash,
        address indexed issuerAddress,
        address indexed studentAddress,
        uint256 issueDate,
        string ipfsHash,
        string certificateId
    );

    /**
     * @dev Emitted when a certificate is verified
     */
    event CertificateVerified(
        bytes32 indexed certificateHash,
        address indexed verifierAddress,
        uint256 verificationTime,
        bool isValid
    );

    /**
     * @dev Emitted when a certificate is revoked
     */
    event CertificateRevoked(
        bytes32 indexed certificateHash,
        address indexed revokerAddress,
        uint256 revocationTime
    );

    /**
     * @dev Emitted when an issuer is registered
     */
    event IssuerRegistered(
        address indexed issuerAddress,
        string institutionName,
        string institutionEmail
    );

    /**
     * @dev Emitted when an issuer is approved
     */
    event IssuerApproved(
        address indexed issuerAddress,
        uint256 approvalTime
    );

    // ============ Modifiers ============

    /**
     * @dev Ensures that only the admin can call the function
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    /**
     * @dev Ensures that only an approved issuer can call the function
     */
    modifier onlyApprovedIssuer() {
        require(issuers[msg.sender].isApproved, "Issuer not approved");
        _;
    }

    /**
     * @dev Ensures that a certificate exists
     */
    modifier certificateExists(bytes32 _certificateHash) {
        require(
            certificates[_certificateHash].issuerAddress != address(0),
            "Certificate does not exist"
        );
        _;
    }

    // ============ Constructor ============

    /**
     * @dev Initializes the contract with the deployer as admin
     */
    constructor() {
        admin = msg.sender;
        totalCertificates = 0;
    }

    // ============ Issuer Management Functions ============

    /**
     * @dev Allows an institution to register as an issuer
     * @param _institutionName Name of the educational institution
     * @param _institutionEmail Email of the institution
     */
    function registerIssuer(
        string memory _institutionName,
        string memory _institutionEmail
    ) external {
        require(
            issuers[msg.sender].isApproved == false,
            "Issuer already registered"
        );
        require(bytes(_institutionName).length > 0, "Institution name required");
        require(bytes(_institutionEmail).length > 0, "Institution email required");

        issuers[msg.sender] = Issuer({
            institutionName: _institutionName,
            institutionEmail: _institutionEmail,
            isApproved: false
        });

        emit IssuerRegistered(msg.sender, _institutionName, _institutionEmail);
    }

    /**
     * @dev Allows admin to approve an issuer
     * @param _issuerAddress Address of the issuer to approve
     */
    function approveIssuer(address _issuerAddress) external onlyAdmin {
        require(
            issuers[_issuerAddress].isApproved == false,
            "Issuer already approved"
        );
        require(
            bytes(issuers[_issuerAddress].institutionName).length > 0,
            "Issuer not registered"
        );

        issuers[_issuerAddress].isApproved = true;
        emit IssuerApproved(_issuerAddress, block.timestamp);
    }

    /**
     * @dev Retrieves issuer information
     * @param _issuerAddress Address of the issuer
     * @return Issuer structure containing institution details
     */
    function getIssuer(address _issuerAddress)
        external
        view
        returns (Issuer memory)
    {
        return issuers[_issuerAddress];
    }

    // ============ Certificate Management Functions ============

    /**
     * @dev Issues a new certificate (only approved issuers can call)
     * @param _certificateHash Cryptographic hash of the certificate document
     * @param _studentAddress Ethereum address of the student
     * @param _ipfsHash IPFS Content Identifier of the certificate document
     * @param _certificateId Unique identifier for the certificate
     */
    function issueCertificate(
        bytes32 _certificateHash,
        address _studentAddress,
        string memory _ipfsHash,
        string memory _certificateId
    ) external onlyApprovedIssuer {
        require(
            _certificateHash != bytes32(0),
            "Certificate hash cannot be zero"
        );
        require(_studentAddress != address(0), "Invalid student address");
        require(
            certificates[_certificateHash].issuerAddress == address(0),
            "Certificate already exists"
        );
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(bytes(_certificateId).length > 0, "Certificate ID required");

        // Create and store the certificate
        Certificate memory newCertificate = Certificate({
            certificateHash: _certificateHash,
            issuerAddress: msg.sender,
            studentAddress: _studentAddress,
            issueDate: block.timestamp,
            ipfsHash: _ipfsHash,
            certificateId: _certificateId,
            isRevoked: false
        });

        certificates[_certificateHash] = newCertificate;

        // Add certificate to student and issuer mappings
        studentCertificates[_studentAddress].push(_certificateHash);
        issuerCertificates[msg.sender].push(_certificateHash);

        totalCertificates++;

        emit CertificateIssued(
            _certificateHash,
            msg.sender,
            _studentAddress,
            block.timestamp,
            _ipfsHash,
            _certificateId
        );
    }

    /**
     * @dev Verifies a certificate by its hash
     * @param _certificateHash Cryptographic hash of the certificate to verify
     * @return isValid Boolean indicating if the certificate is valid
     * @return certificate Certificate structure if valid
     */
    function verifyCertificate(bytes32 _certificateHash)
        external
        returns (bool isValid, Certificate memory certificate)
    {
        Certificate memory cert = certificates[_certificateHash];

        bool valid = cert.issuerAddress != address(0) && !cert.isRevoked;

        emit CertificateVerified(
            _certificateHash,
            msg.sender,
            block.timestamp,
            valid
        );

        return (valid, cert);
    }

    /**
     * @dev Retrieves certificate details
     * @param _certificateHash Cryptographic hash of the certificate
     * @return Certificate structure containing all details
     */
    function getCertificate(bytes32 _certificateHash)
        external
        view
        certificateExists(_certificateHash)
        returns (Certificate memory)
    {
        return certificates[_certificateHash];
    }

    /**
     * @dev Checks if a certificate is valid (exists and not revoked)
     * @param _certificateHash Cryptographic hash of the certificate
     * @return Boolean indicating if the certificate is valid
     */
    function isCertificateValid(bytes32 _certificateHash)
        external
        view
        returns (bool)
    {
        Certificate memory cert = certificates[_certificateHash];
        return cert.issuerAddress != address(0) && !cert.isRevoked;
    }

    /**
     * @dev Revokes a certificate (only the issuer can revoke their own certificates)
     * @param _certificateHash Cryptographic hash of the certificate to revoke
     */
    function revokeCertificate(bytes32 _certificateHash)
        external
        certificateExists(_certificateHash)
    {
        Certificate storage cert = certificates[_certificateHash];
        require(
            msg.sender == cert.issuerAddress || msg.sender == admin,
            "Only issuer or admin can revoke"
        );
        require(!cert.isRevoked, "Certificate already revoked");

        cert.isRevoked = true;

        emit CertificateRevoked(_certificateHash, msg.sender, block.timestamp);
    }

    // ============ Query Functions ============

    /**
     * @dev Retrieves all certificates for a student
     * @param _studentAddress Address of the student
     * @return Array of certificate hashes
     */
    function getStudentCertificates(address _studentAddress)
        external
        view
        returns (bytes32[] memory)
    {
        return studentCertificates[_studentAddress];
    }

    /**
     * @dev Retrieves all certificates issued by an institution
     * @param _issuerAddress Address of the issuer
     * @return Array of certificate hashes
     */
    function getIssuerCertificates(address _issuerAddress)
        external
        view
        returns (bytes32[] memory)
    {
        return issuerCertificates[_issuerAddress];
    }

    /**
     * @dev Retrieves the total number of certificates issued
     * @return Total certificate count
     */
    function getTotalCertificates() external view returns (uint256) {
        return totalCertificates;
    }

    /**
     * @dev Verifies a certificate by comparing hashes (gas-efficient read)
     * @param _certificateHash Hash to verify
     * @return Boolean indicating if certificate exists and is valid
     */
    function quickVerify(bytes32 _certificateHash)
        external
        view
        returns (bool)
    {
        Certificate memory cert = certificates[_certificateHash];
        return cert.issuerAddress != address(0) && !cert.isRevoked;
    }
}
