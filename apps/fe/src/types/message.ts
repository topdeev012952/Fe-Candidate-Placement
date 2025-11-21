export type MessageHistoryItem = {
  id: string;
  message: string;
  signature: string;
  timestamp: number;
  verificationResult?: {
    isValid: boolean;
    signer: string;
    originalMessage: string;
  };
};
