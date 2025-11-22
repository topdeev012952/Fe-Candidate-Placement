import { Wallet } from 'ethers';
import request from 'supertest';
import express, { Express } from 'express';
import verifySignatureRouter from '../verifySignature';

/**
 * Integration tests for signature verification with real ethers.js signatures
 */
describe('POST /verify-signature - Integration Tests', () => {
  let app: Express;
  let testWallet: ReturnType<typeof Wallet.createRandom>;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', verifySignatureRouter);
    
    // Create a test wallet for generating real signatures
    testWallet = Wallet.createRandom();
  });

  it('should verify a valid signature generated with ethers.js', async () => {
    const message = 'Hello, Web3! This is a test message.';
    
    // Generate a real signature
    const signature = await testWallet.signMessage(message);

    const response = await request(app)
      .post('/verify-signature')
      .send({
        message,
        signature,
      });

    expect(response.status).toBe(200);
    expect(response.body.isValid).toBe(true);
    expect(response.body.signer.toLowerCase()).toBe(testWallet.address.toLowerCase());
    expect(response.body.originalMessage).toBe(message);
  });

  it('should reject a signature from a different wallet', async () => {
    const message = 'Test message';
    const otherWallet = Wallet.createRandom();
    
    // Sign with one wallet
    const signature = await testWallet.signMessage(message);

    // The signature should verify for the correct wallet
    const correctResponse = await request(app)
      .post('/verify-signature')
      .send({ message, signature });

    expect(correctResponse.body.isValid).toBe(true);
    expect(correctResponse.body.signer.toLowerCase()).toBe(testWallet.address.toLowerCase());

    // Sign with a different wallet
    const otherSignature = await otherWallet.signMessage(message);
    
    // The other signature should verify for the other wallet
    const otherResponse = await request(app)
      .post('/verify-signature')
      .send({ message, signature: otherSignature });

    expect(otherResponse.body.isValid).toBe(true);
    expect(otherResponse.body.signer.toLowerCase()).toBe(otherWallet.address.toLowerCase());
    expect(otherResponse.body.signer).not.toBe(testWallet.address);
  });

  it('should handle empty string message', async () => {
    const message = '';
    const signature = await testWallet.signMessage(message);

    const response = await request(app)
      .post('/verify-signature')
      .send({ message, signature });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields');
  });

  it('should handle message with newlines and special characters', async () => {
    const message = 'Multi-line\nmessage\nwith\tspecial\tchars\n🚀';
    const signature = await testWallet.signMessage(message);

    const response = await request(app)
      .post('/verify-signature')
      .send({ message, signature });

    expect(response.status).toBe(200);
    expect(response.body.isValid).toBe(true);
    expect(response.body.originalMessage).toBe(message);
  });
});
