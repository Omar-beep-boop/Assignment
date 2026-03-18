import { useEffect, useState } from 'react';

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

interface UseWeb3Return {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  provider: EthereumProvider | null;
}

/**
 * Custom hook for MetaMask wallet connection and Web3 interactions
 */
export function useWeb3(): UseWeb3Return {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<EthereumProvider | null>(null);

  // Check if MetaMask is available and connect on mount
  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const eth = (window as any).ethereum as EthereumProvider;
        setProvider(eth);

        try {
          // Check if already connected
          const accounts = await eth.request({
            method: 'eth_accounts',
          }) as string[];

          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.error('Error checking MetaMask:', err);
        }

        // Listen for account changes
        eth.on('accountsChanged', (accounts: unknown) => {
          const accountList = accounts as string[];
          if (accountList.length > 0) {
            setAccount(accountList[0]);
            setIsConnected(true);
          } else {
            setAccount(null);
            setIsConnected(false);
          }
        });

        // Listen for chain changes
        eth.on('chainChanged', () => {
          window.location.reload();
        });
      }
    };

    checkMetaMask();

    return () => {
      if (provider) {
        provider.removeListener('accountsChanged', () => {});
        provider.removeListener('chainChanged', () => {});
      }
    };
  }, [provider]);

  const connectWallet = async () => {
    if (!provider) {
      setError('MetaMask is not installed');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      const error = err as any;
      if (error.code === 4001) {
        setError('User rejected the connection request');
      } else {
        setError('Failed to connect wallet');
      }
      console.error('Error connecting wallet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setError(null);
  };

  return {
    account,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    provider,
  };
}
