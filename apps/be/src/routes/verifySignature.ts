import { Router, Request, Response } from 'express';
import { verifyMessage } from 'ethers';

const router = Router();

interface VerifySignatureRequest {
  message: string;
  signature: string;
}

interface VerifySignatureResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}

router.post('/verify-signature', async (req: Request, res: Response) => {
  try {
    const { message, signature }: VerifySignatureRequest = req.body;

    // Validate request body
    if (!message || !signature) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both "message" and "signature" are required',
      });
    }

    if (typeof message !== 'string' || typeof signature !== 'string') {
      return res.status(400).json({
        error: 'Invalid field types',
        message: 'Both "message" and "signature" must be strings',
      });
    }

    try {
      // Recover the signer address from the signature
      const signerAddress = verifyMessage(message, signature);

      // If we get here, the signature is valid
      const response: VerifySignatureResponse = {
        isValid: true,
        signer: signerAddress,
        originalMessage: message,
      };

      return res.json(response);
    } catch (error) {
      // Signature verification failed
      const response: VerifySignatureResponse = {
        isValid: false,
        signer: '',
        originalMessage: message,
      };

      return res.json(response);
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while verifying the signature',
    });
  }
});

export default router;
