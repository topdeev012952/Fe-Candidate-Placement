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
    throw new Error(
      error instanceof AxiosError ?
        error.response?.data?.message :
        error instanceof Error ?
          error.message :
          'An unexpected error occurred'
    );
  }
};
