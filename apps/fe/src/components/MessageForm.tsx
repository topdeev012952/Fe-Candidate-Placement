import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../hooks/useWallet';
import { verifySignature } from '../services/api';

export const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signMessage, isSigning } = useWallet();
  const { addToHistory, updateVerificationResult } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSubmitting(true);

    try {
      const signature = await signMessage(message);

      const historyItem = addToHistory({
        message,
        signature,
      });

      try {
        const result = await verifySignature({ message, signature });
        updateVerificationResult(historyItem.id, result);
      } catch (verifyError) {
        console.error('Verification error:', verifyError);
        updateVerificationResult(historyItem.id, {
          isValid: false,
          signer: '',
          originalMessage: message,
        });
        setError('Message signed but verification failed. Check console for details.');
      }

      setMessage('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      setError(errorMessage);
      console.error('Signing error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign a Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={4}
            disabled={isSubmitting || isSigning}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isSigning || !message.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          {isSigning ? 'Signing...' : isSubmitting ? 'Verifying...' : 'Sign & Verify Message'}
        </button>
      </form>
    </div>
  );
};
