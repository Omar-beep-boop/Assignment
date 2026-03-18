/**
 * Utility functions for certificate handling and cryptographic operations
 */

/**
 * Generates a SHA-256 hash of a file using the Web Crypto API
 * @param file The file to hash
 * @returns Promise resolving to the hex string of the hash
 */
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Converts a hex string to a bytes32 format (prepends 0x)
 * @param hexString The hex string to convert
 * @returns The bytes32 formatted string
 */
export function toBytes32(hexString: string): string {
  if (hexString.startsWith('0x')) {
    return hexString;
  }
  return '0x' + hexString.padStart(64, '0');
}

/**
 * Truncates a hex string for display purposes
 * @param hexString The hex string to truncate
 * @param length The number of characters to show (default 10)
 * @returns Truncated hex string with ellipsis
 */
export function truncateHash(hexString: string, length: number = 10): string {
  if (hexString.length <= length) {
    return hexString;
  }
  const start = hexString.substring(0, length / 2);
  const end = hexString.substring(hexString.length - length / 2);
  return `${start}...${end}`;
}

/**
 * Formats an Ethereum address for display
 * @param address The address to format
 * @returns Formatted address (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Validates an Ethereum address format
 * @param address The address to validate
 * @returns True if valid, false otherwise
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates a bytes32 hash format
 * @param hash The hash to validate
 * @returns True if valid, false otherwise
 */
export function isValidBytes32(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Formats a timestamp to a readable date string
 * @param timestamp The Unix timestamp
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generates a unique certificate ID
 * @returns A unique certificate ID (UUID v4 format)
 */
export function generateCertificateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates a certificate ID format
 * @param id The ID to validate
 * @returns True if valid UUID format, false otherwise
 */
export function isValidCertificateId(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Converts a file to base64 string
 * @param file The file to convert
 * @returns Promise resolving to the base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:application/pdf;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Checks if a file is a valid certificate document (PDF, DOC, DOCX, etc.)
 * @param file The file to check
 * @returns True if valid, false otherwise
 */
export function isValidCertificateFile(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];
  return validTypes.includes(file.type);
}

/**
 * Gets a human-readable file size
 * @param bytes The file size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
