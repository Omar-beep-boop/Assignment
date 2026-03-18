import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWeb3 } from '@/hooks/useWeb3';
import { formatAddress, formatDate } from '@/lib/certificateUtils';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Certificate {
  id: string;
  hash: string;
  issuerAddress: string;
  studentAddress: string;
  issueDate: number;
  status: 'verified' | 'pending' | 'revoked';
}

export default function Dashboard() {
  const { isConnected, account } = useWeb3();
  const [issuedCertificates, setIssuedCertificates] = useState<Certificate[]>([]);
  const [receivedCertificates, setReceivedCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && account) {
      loadCertificates();
    }
  }, [isConnected, account]);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockIssued: Certificate[] = [
        {
          id: 'cert-001',
          hash: '0x' + 'a'.repeat(64),
          issuerAddress: account || '',
          studentAddress: '0x' + 'b'.repeat(40),
          issueDate: Math.floor(Date.now() / 1000) - 86400 * 30,
          status: 'verified',
        },
        {
          id: 'cert-002',
          hash: '0x' + 'c'.repeat(64),
          issuerAddress: account || '',
          studentAddress: '0x' + 'd'.repeat(40),
          issueDate: Math.floor(Date.now() / 1000) - 86400 * 7,
          status: 'verified',
        },
      ];

      const mockReceived: Certificate[] = [
        {
          id: 'cert-003',
          hash: '0x' + 'e'.repeat(64),
          issuerAddress: '0x' + 'f'.repeat(40),
          studentAddress: account || '',
          issueDate: Math.floor(Date.now() / 1000) - 86400 * 60,
          status: 'verified',
        },
      ];

      setIssuedCertificates(mockIssued);
      setReceivedCertificates(mockReceived);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-accent" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-primary" />;
      case 'revoked':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold';
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'pending':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'revoked':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-3">
            Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your issued and received certificates.
          </p>
        </div>

        {!isConnected ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Please connect your MetaMask wallet to view your dashboard.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Issued Certificates</p>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {issuedCertificates.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Received Certificates</p>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {receivedCertificates.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                    <p className="text-lg font-mono font-semibold text-foreground">
                      {formatAddress(account || '')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Card>
              <Tabs defaultValue="issued" className="w-full">
                <TabsList className="w-full border-b border-border rounded-none bg-transparent p-4">
                  <TabsTrigger value="issued" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Issued Certificates
                  </TabsTrigger>
                  <TabsTrigger value="received" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Received Certificates
                  </TabsTrigger>
                </TabsList>

                {/* Issued Certificates Tab */}
                <TabsContent value="issued" className="p-6">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading certificates...</p>
                    </div>
                  ) : issuedCertificates.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No issued certificates yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {issuedCertificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                {getStatusIcon(cert.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-display font-semibold text-foreground truncate">
                                    {cert.id}
                                  </h4>
                                  <span className={getStatusBadge(cert.status)}>
                                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Student: <span className="font-mono">{formatAddress(cert.studentAddress)}</span>
                                </p>
                                <p className="text-xs text-muted-foreground font-mono break-all">
                                  Hash: {cert.hash.substring(0, 20)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-sm text-muted-foreground">
                                {formatDate(cert.issueDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Received Certificates Tab */}
                <TabsContent value="received" className="p-6">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading certificates...</p>
                    </div>
                  ) : receivedCertificates.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No received certificates yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receivedCertificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                {getStatusIcon(cert.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-display font-semibold text-foreground truncate">
                                    {cert.id}
                                  </h4>
                                  <span className={getStatusBadge(cert.status)}>
                                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Issuer: <span className="font-mono">{formatAddress(cert.issuerAddress)}</span>
                                </p>
                                <p className="text-xs text-muted-foreground font-mono break-all">
                                  Hash: {cert.hash.substring(0, 20)}...
                                </p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-sm text-muted-foreground">
                                {formatDate(cert.issueDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
