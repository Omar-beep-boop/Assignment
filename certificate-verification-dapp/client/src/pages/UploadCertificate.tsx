import { getContract } from "../lib/contract";
import { hashFile } from "../utils/hash";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/hooks/useWeb3';
import { generateFileHash, toBytes32, generateCertificateId, formatFileSize } from '@/lib/certificateUtils';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadCertificate() {

const handleUpload = async (file: File) => {
  const hash = await hashFile(file);

  const contract = await getContract();
  const tx = await contract.addCertificate("0x" + hash);

  await tx.wait();

  alert("Certificate stored on blockchain!");
};
  <input
  type="file"
  onChange={(e) => {
    if (e.target.files) {
      handleUpload(e.target.files[0]);
    }
  }}
/>
  
  const { isConnected, account } = useWeb3();
  const [file, setFile] = useState<File | null>(null);
  const [studentAddress, setStudentAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [issuedCertificateId, setIssuedCertificateId] = useState<string | null>(null);
  const [certificateHash, setCertificateHash] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIssuedCertificateId(null);

    try {
      const hash = await generateFileHash(selectedFile);
      setCertificateHash(hash);
    } catch (error) {
      toast.error('Failed to generate file hash');
      console.error('Error generating hash:', error);
    }
  };

  const handleStudentAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentAddress(e.target.value);
  };

  const handleIssueCertificate = async () => {
    if (!file) {
      toast.error('Please upload a certificate document');
      return;
    }

    if (!studentAddress) {
      toast.error('Please enter the student address');
      return;
    }

    if (!studentAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid Ethereum address format');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate smart contract issuance
      // In a real implementation, this would call the actual smart contract
      const certificateId = generateCertificateId();
      const bytes32Hash = toBytes32(certificateHash);

      // Mock IPFS upload (in real implementation, would upload to IPFS)
      const mockIpfsHash = 'QmXxxx' + Math.random().toString(36).substring(7);

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIssuedCertificateId(certificateId);
      toast.success('Certificate issued successfully!');

      // Reset form
      setFile(null);
      setStudentAddress('');
      setCertificateHash('');
    } catch (error) {
      toast.error('Failed to issue certificate');
      console.error('Error issuing certificate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-3">
              Issue Certificate
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload an academic certificate and register it on the blockchain for secure, transparent verification.
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8">
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Please connect your MetaMask wallet to issue certificates.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your institution must be registered and approved as an issuer.
                </p>
              </div>
            ) : issuedCertificateId ? (
              // Success State
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  Certificate Issued Successfully
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your certificate has been registered on the blockchain.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border border-border mb-6">
                  <p className="text-xs text-muted-foreground mb-2">Certificate ID:</p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {issuedCertificateId}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIssuedCertificateId(null);
                  }}
                  className="w-full"
                >
                  Issue Another Certificate
                </Button>
              </div>
            ) : (
              // Form State
              <div className="space-y-6">
                {/* File Upload Section */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Upload Certificate Document</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {file ? (
                        <>
                          <span className="font-semibold text-foreground">{file.name}</span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                          <br />
                          <span className="text-sm">Click to change</span>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-foreground">Click to upload</span>
                          <br />
                          <span className="text-sm">or drag and drop</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Hash Display */}
                {certificateHash && (
                  <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Certificate Hash (SHA-256):</p>
                    <p className="font-mono text-xs text-foreground break-all">
                      {certificateHash}
                    </p>
                  </div>
                )}

                {/* Student Address Input */}
                <div>
                  <Label htmlFor="student-address" className="text-base font-semibold mb-3 block">
                    Student Ethereum Address
                  </Label>
                  <Input
                    id="student-address"
                    placeholder="0x..."
                    value={studentAddress}
                    onChange={handleStudentAddressChange}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    The Ethereum address of the student receiving this certificate
                  </p>
                </div>

                {/* Issue Button */}
                <Button
                  onClick={handleIssueCertificate}
                  disabled={!file || !studentAddress || isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Issuing Certificate...
                    </>
                  ) : (
                    'Issue Certificate on Blockchain'
                  )}
                </Button>

                {/* Info */}
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Note:</span> You must be registered as an approved issuer to issue certificates. Contact the administrator if you need approval.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Info Section */}
          <Card className="mt-8 p-6 bg-muted/30 border-muted">
            <h3 className="font-display font-semibold text-foreground mb-3">What Happens Next</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Your certificate document is hashed using SHA-256</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>The document is uploaded to IPFS for decentralized storage</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>The hash is registered on the Ethereum blockchain via smart contract</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>The certificate becomes immutable and verifiable by anyone</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
