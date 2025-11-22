import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../api';
import { verifySignature } from '../api';

// Mock the api module
vi.mock('../../api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('verifySignature', () => {
    it('should return verification result on success', async () => {
      const mockResponse = {
        data: {
          isValid: true,
          signer: '0x1234567890123456789012345678901234567890',
          originalMessage: 'test message',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await verifySignature({
        message: 'test message',
        signature: '0xsignature',
      });

      expect(api.post).toHaveBeenCalledWith('/verify-signature', {
        message: 'test message',
        signature: '0xsignature',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error with message from AxiosError response', async () => {
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        data: { message: 'Custom error message' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      vi.mocked(api.post).mockRejectedValue(axiosError);

      await expect(
        verifySignature({
          message: 'test',
          signature: '0x123',
        })
      ).rejects.toThrow('Custom error message');
    });

    it('should throw error with AxiosError message if no response data', async () => {
      const axiosError = new AxiosError('Network error');
      axiosError.message = 'Network error';
      vi.mocked(api.post).mockRejectedValue(axiosError);

      await expect(
        verifySignature({
          message: 'test',
          signature: '0x123',
        })
      ).rejects.toThrow('Network error');
    });

    it('should throw generic error for non-Axios errors', async () => {
      const genericError = new Error('Generic error');
      vi.mocked(api.post).mockRejectedValue(genericError);

      await expect(
        verifySignature({
          message: 'test',
          signature: '0x123',
        })
      ).rejects.toThrow('Generic error');
    });

    it('should throw default message for unknown error types', async () => {
      vi.mocked(api.post).mockRejectedValue('String error');

      await expect(
        verifySignature({
          message: 'test',
          signature: '0x123',
        })
      ).rejects.toThrow('An unexpected error occurred');
    });
  });
});
