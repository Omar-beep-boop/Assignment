import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/hooks/useWeb3';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type RegistrationStatus = 'idle' | 'registering' | 'success' | 'error';

export default function RegisterIssuer() {
  const { isConnected, account } = useWeb3();
  const [institutionName, setInstitutionName] = useState('');
  const [institutionEmail, setInstitutionEmail] = useState('');
  const [status, setStatus] = useState<RegistrationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!institutionName.trim()) {
      toast.error('Please enter institution name');
      return;
    }

    if (!institutionEmail.trim()) {
      toast.error('Please enter institution email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(institutionEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setStatus('registering');
    setErrorMessage('');

    try {
      // Simulate smart contract registration
      // In a real implementation, this would call the actual smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatus('success');
      toast.success('Institution registered successfully! Awaiting admin approval.');
      setInstitutionName('');
      setInstitutionEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to register institution. Please try again.');
      toast.error('Registration failed');
      console.error('Error registering issuer:', error);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-3">
              Register as Issuer
            </h1>
            <p className="text-lg text-muted-foreground">
              Register your educational institution to issue certificates on the blockchain.
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8">
            {!isConnected ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Please connect your MetaMask wallet to register as an issuer.
                </p>
              </div>
            ) : status === 'success' ? (
              // Success State
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  Registration Submitted
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your institution has been registered. An administrator will review your application and send approval notification to your email.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mb-6">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Institution:</span> {institutionName}
                    <br />
                    <span className="font-semibold">Email:</span> {institutionEmail}
                    <br />
                    <span className="font-semibold">Wallet:</span> {account?.substring(0, 10)}...
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setStatus('idle');
                  }}
                  className="w-full"
                >
                  Register Another Institution
                </Button>
              </div>
            ) : (
              // Form State
              <div className="space-y-6">
                {/* Institution Name */}
                <div>
                  <Label htmlFor="institution-name" className="text-base font-semibold mb-3 block">
                    Institution Name
                  </Label>
                  <Input
                    id="institution-name"
                    placeholder="e.g., Harvard University"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    disabled={status === 'registering'}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    The official name of your educational institution
                  </p>
                </div>

                {/* Institution Email */}
                <div>
                  <Label htmlFor="institution-email" className="text-base font-semibold mb-3 block">
                    Institution Email
                  </Label>
                  <Input
                    id="institution-email"
                    type="email"
                    placeholder="registrar@university.edu"
                    value={institutionEmail}
                    onChange={(e) => setInstitutionEmail(e.target.value)}
                    disabled={status === 'registering'}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Contact email for certificate verification inquiries
                  </p>
                </div>

                {/* Wallet Info */}
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Connected Wallet Address:</p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {account}
                  </p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
                    <p className="text-sm text-destructive">{errorMessage}</p>
                  </div>
                )}

                {/* Register Button */}
                <Button
                  onClick={handleRegister}
                  disabled={status === 'registering' || !institutionName || !institutionEmail}
                  size="lg"
                  className="w-full"
                >
                  {status === 'registering' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    'Register Institution'
                  )}
                </Button>

                {/* Info */}
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground mb-3 font-semibold">What happens next?</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>Your registration is submitted to the blockchain</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>An administrator reviews your application</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>Upon approval, you can issue certificates</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">4.</span>
                      <span>Confirmation is sent to your registered email</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Card>

          {/* Requirements Section */}
          <Card className="mt-8 p-6 bg-muted/30 border-muted">
            <h3 className="font-display font-semibold text-foreground mb-4">Requirements for Issuers</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Must be a recognized educational institution</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Must have a valid institutional email address</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Must be approved by the platform administrator</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Must maintain accurate institutional information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Must comply with certificate issuance standards</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
