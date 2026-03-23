import { connectWallet } from "../lib/metamask";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { CheckCircle2, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Secure Academic Certificate Verification
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Leverage blockchain technology for transparent, immutable, and trustless verification of academic credentials. Eliminate fraud and streamline the verification process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/verify">
                <Button size="lg" className="w-full sm:w-auto">
                  Verify Certificate
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Issue Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-foreground">
            Why Blockchain Verification?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                Immutable Records
              </h3>
              <p className="text-muted-foreground">
                Once recorded on the blockchain, certificates cannot be altered or forged. Cryptographic hashes ensure authenticity.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                Instant Verification
              </h3>
              <p className="text-muted-foreground">
                Verify certificates in seconds without contacting the issuing institution. Transparent and auditable verification process.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                Decentralized Trust
              </h3>
              <p className="text-muted-foreground">
                No single point of failure. The distributed nature of blockchain ensures availability and resilience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-display font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Upload Certificate
                  </h3>
                  <p className="text-muted-foreground">
                    Submit your certificate document (PDF, image, etc.) to the platform. The system generates a cryptographic hash of the document.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-display font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Register on Blockchain
                  </h3>
                  <p className="text-muted-foreground">
                    The issuing institution registers the certificate hash on the Ethereum blockchain via a smart contract. The document is stored on IPFS.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-display font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Verify Instantly
                  </h3>
                  <p className="text-muted-foreground">
                    Verifiers upload the certificate, and the system checks if its hash matches the blockchain record. Instant confirmation of authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect your MetaMask wallet to begin issuing or verifying academic certificates on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/verify">
              <Button size="lg" className="w-full sm:w-auto">
                Start Verifying
              </Button>
            </Link>
            <Link href="/register-issuer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Register as Issuer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
