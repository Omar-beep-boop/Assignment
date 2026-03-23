import { ethers } from "ethers";
import { getProvider } from "./metamask";

const contractAddress = "PASTE_YOUR_CONTRACT_ADDRESS_HERE";

const abi = [
  "function addCertificate(bytes32 hash)",
  "function verifyCertificate(bytes32 hash) view returns (bool)"
];

export const getContract = async () => {
  const ethereum = getProvider();

  if (!ethereum) {
    throw new Error("Wallet not connected");
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, abi, signer);
};
