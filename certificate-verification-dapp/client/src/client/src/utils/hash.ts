import SHA256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";

export const hashFile = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  return SHA256(wordArray).toString();
};
