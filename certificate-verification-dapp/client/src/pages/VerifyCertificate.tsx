import { getContract } from "../lib/contract";
import { hashFile } from "../utils/hash";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/hooks/useWeb3';
import { generateFileHash, toBytes32, formatAddress, truncateHash, isValidBytes32 } from '@/lib/certificateUtils';
import { Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const handleVerify = async (file: File) => {
  const hash = await hashFile(file);

  const contract = await getContract();
  const exists = await contract.verifyCertificate("0x" + hash);

  if (exists) {
    alert("✅ Certificate is VALID");
  } else {
    alert("❌ Certificate NOT found");
  }
};

<input
  type="file"
  onChange={(e) => {
    if (e.target.files) {
      handleVerify(e.target.files[0]);
    }
  }}
/>

interface VerificationResult {
  isValid: boolean;
  issuerAddress?: string;
  studentAddress?: string;
  issueDate?: number;
  certificateId?: string;
  ipfsHash?: string;
}

export default function VerifyCertificate() {
  const { isConnected, account } = useWeb3();
  const [file, setFile] = useState<File | null>(null);
  const [certificateHash, setCertificateHash] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setShowResult(false);
    setVerificationResult(null);

    try {
      const hash = await generateFileHash(selectedFile);
      setCertificateHash(hash);
    } catch (error) {
      toast.error('Failed to generate file hash');
      console.error('Error generating hash:', error);
    }
  };

  const handleHashInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertificateHash(e.target.value);
    setFile(null);
    setShowResult(false);
    setVerificationResult(null);
  };

  const handleVerify = async () => {
    if (!certificateHash) {
      toast.error('Please provide a certificate hash or upload a file');
      return;
    }

    if (!isValidBytes32(toBytes32(certificateHash))) {
      toast.error('Invalid certificate hash format');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate smart contract verification
      // In a real implementation, this would call the actual smart contract
      const bytes32Hash = toBytes32(certificateHash);
      
      // Mock verification result for demonstration
      const mockResult: VerificationResult = {
        isValid: Math.random() > 0.3, // 70% valid for demo
        issuerAddress: '0x' + Math.random().toString(16).slice(2, 42),
        studentAddress: '0x' + Math.random().toString(16).slice(2, 42),
        issueDate: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 31536000),
        certificateId: 'cert-' + Math.random().toString(36).substring(7),
        ipfsHash: 'QmXxxx' + Math.random().toString(36).substring(7),
      };

      setVerificationResult(mockResult);
      setShowResult(true);

      if (mockResult.isValid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Certificate verification failed - Invalid or revoked certificate');
      }
    } catch (error) {
      toast.error('Verification failed');
      console.error('Error verifying certificate:', error);
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
              Verify Certificate
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a certificate document or enter its hash to verify authenticity on the blockchain.
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8">
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Please connect your MetaMask wallet to verify certificates.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Upload Section */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">Upload Certificate</Label>
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

                {/* Or Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Hash Input Section */}
                <div>
                  <Label htmlFor="hash" className="text-base font-semibold mb-3 block">
                    Enter Certificate Hash
                  </Label>
                  <Input
                    id="hash"
                    placeholder="0x..."
                    value={certificateHash}
                    onChange={handleHashInput}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter a 64-character hex hash (with or without 0x prefix)
                  </p>
                </div>

                {/* Hash Display */}
                {certificateHash && (
                  <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Generated/Entered Hash:</p>
                    <p className="font-mono text-sm text-foreground break-all">
                      {truncateHash(certificateHash, 20)}
                    </p>
                  </div>
                )}

                {/* Verify Button */}
                <Button
                  onClick={handleVerify}
                  disabled={!certificateHash || isLoading}
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Certificate'
                  )}
                </Button>

                {/* Verification Result */}
                {showResult && verificationResult && (
                  <div className={`p-6 rounded-lg border-2 ${
                    verificationResult.isValid
                      ? 'bg-accent/5 border-accent'
                      : 'bg-destructive/5 border-destructive'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {verificationResult.isValid ? (
                          <CheckCircle2 className="w-6 h-6 text-accent" />
                        ) : (
                          <XCircle className="w-6 h-6 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                          {verificationResult.isValid ? 'Certificate Valid' : 'Certificate Invalid'}
                        </h3>
                        <div className="space-y-2 text-sm">
                          {verificationResult.issuerAddress && (
                            <div>
                              <p className="text-muted-foreground">Issuer Address:</p>
                              <p className="font-mono text-foreground">
                                {formatAddress(verificationResult.issuerAddress)}
                              </p>
                            </div>
                          )}
                          {verificationResult.studentAddress && (
                            <div>
                              <p className="text-muted-foreground">Student Address:</p>
                              <p className="font-mono text-foreground">
                                {formatAddress(verificationResult.studentAddress)}
                              </p>
                            </div>
                          )}
                          {verificationResult.issueDate && (
                            <div>
                              <p className="text-muted-foreground">Issue Date:</p>
                              <p className="text-foreground">
                                {new Date(verificationResult.issueDate * 1000).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {verificationResult.certificateId && (
                            <div>
                              <p className="text-muted-foreground">Certificate ID:</p>
                              <p className="font-mono text-foreground text-xs break-all">
                                {verificationResult.certificateId}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Info Section */}
          <Card className="mt-8 p-6 bg-muted/30 border-muted">
            <h3 className="font-display font-semibold text-foreground mb-3">How Verification Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Upload your certificate document or provide its hash</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>The system generates a cryptographic hash of the document</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>The hash is checked against the blockchain smart contract</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>Verification result shows authenticity and issuer details</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
