import request from 'supertest';
import express, { Express } from 'express';
import verifySignatureRouter from '../verifySignature';

describe('POST /verify-signature', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', verifySignatureRouter);
  });

  describe('Request validation', () => {
    it('should return 400 if message is missing', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({ signature: '0x123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 if signature is missing', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({ message: 'test message' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 if message is not a string', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({ message: 123, signature: '0x123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid field types');
    });

    it('should return 400 if signature is not a string', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({ message: 'test message', signature: 123 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid field types');
    });
  });

  describe('Signature verification', () => {
    it('should return isValid: false for invalid signature', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'test message',
          signature: '0xinvalid_signature',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isValid');
      expect(response.body.isValid).toBe(false);
      expect(response.body).toHaveProperty('signer');
      expect(response.body.signer).toBe('');
      expect(response.body).toHaveProperty('originalMessage');
      expect(response.body.originalMessage).toBe('test message');
    });

    it('should return isValid: false for empty signature', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'test message',
          signature: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should have correct response structure for invalid signature', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'test message',
          signature: '0xinvalid',
        });

      expect(response.body).toHaveProperty('isValid');
      expect(response.body).toHaveProperty('signer');
      expect(response.body).toHaveProperty('originalMessage');
      expect(typeof response.body.isValid).toBe('boolean');
      expect(typeof response.body.signer).toBe('string');
      expect(typeof response.body.originalMessage).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty message', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: '',
          signature: '0x123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should handle very long message', async () => {
      const longMessage = 'a'.repeat(10000);
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: longMessage,
          signature: '0xinvalid',
        });

      expect(response.status).toBe(200);
      expect(response.body.originalMessage).toBe(longMessage);
    });
  });
});
