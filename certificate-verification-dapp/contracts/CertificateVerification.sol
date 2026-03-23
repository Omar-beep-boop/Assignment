// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    mapping(bytes32 => bool) public certificates;

    event CertificateAdded(bytes32 hash);

    function addCertificate(bytes32 hash) public {
        require(!certificates[hash], "Certificate already exists");
        certificates[hash] = true;
        emit CertificateAdded(hash);
    }

    function verifyCertificate(bytes32 hash) public view returns (bool) {
        return certificates[hash];
    }
}
