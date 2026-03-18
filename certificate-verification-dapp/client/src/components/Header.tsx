import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import { formatAddress } from '@/lib/certificateUtils';
import { Loader2, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const { account, isConnected, isLoading, connectWallet, disconnectWallet } = useWeb3();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">C</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="font-display font-bold text-lg text-foreground">Certificate Verify</h1>
              <p className="text-xs text-muted-foreground">Blockchain Verification</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/verify" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Verify
            </Link>
            <Link href="/upload" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Issue
            </Link>
            <Link href="/dashboard" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {isConnected && account ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono text-foreground">{formatAddress(account)}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                size="sm"
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Connecting...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Connect</span>
                    <span className="sm:hidden">Connect Wallet</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
