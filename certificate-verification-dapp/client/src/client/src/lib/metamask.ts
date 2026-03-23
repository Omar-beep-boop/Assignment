import { MetaMaskSDK } from "@metamask/sdk";

let MMSDK: MetaMaskSDK | null = null;

export const connectWallet = async () => {
  if (!MMSDK) {
    MMSDK = new MetaMaskSDK({
      dappMetadata: {
        name: "Certificate DApp",
        url: window.location.href,
      },
      infuraAPIKey: "0888024ee12042239c1b1462882e0f3a",
    });
  }

  try {
    const accounts = await MMSDK.connect();
    return accounts[0];
  } catch (err) {
    console.error("Connection failed", err);
    return null;
  }
};

export const getProvider = () => {
  if (!MMSDK) return null;
  return MMSDK.getProvider();
};
