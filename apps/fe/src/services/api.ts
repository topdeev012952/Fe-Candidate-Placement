import { AxiosError } from 'axios';
import { api } from '../api';

export interface VerifySignatureRequest {
  message: string;
  signature: string;
}

export interface VerifySignatureResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}

export const verifySignature = async (
  request: VerifySignatureRequest
): Promise<VerifySignatureResponse> => {
  try {
    const response = await api.post<VerifySignatureResponse>(
      '/verify-signature',
      request
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
};
