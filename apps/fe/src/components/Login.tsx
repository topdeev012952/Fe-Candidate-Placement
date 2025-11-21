import { useState } from 'react';
import { useConnectWithOtp, useDynamicContext, useEmbeddedWallet } from '@dynamic-labs/sdk-react-core';

export const Login = () => {
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();
  const { primaryWallet } = useDynamicContext();
  const { createEmbeddedWallet, userHasEmbeddedWallet } = useEmbeddedWallet();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await connectWithEmail(email);
      setIsOtpSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code';
      setError(errorMessage);
      console.error('Email login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await verifyOneTimePassword(otp);

      if (!userHasEmbeddedWallet) {
        try {
          await createEmbeddedWallet();
        } catch (walletError) {
          console.log('Wallet creation:', walletError);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify code';
      setError(errorMessage);
      console.error('OTP verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Web3 Message Signer</h1>
          <p className="text-gray-600">Sign and verify messages with your Web3 wallet</p>
        </div>

        {primaryWallet ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">✓ Wallet Connected</p>
              <p className="text-xs text-green-700 font-mono break-all">
                {primaryWallet.address}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <>
            {!isOtpSent ? (
              <>
                <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {isLoading ? 'Sending...' : 'Continue with Email'}
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    We sent a verification code to{' '}
                    <span className="font-semibold text-gray-900">{email}</span>
                  </p>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    disabled={isLoading}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-center text-2xl tracking-widest font-mono"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp('');
                    setError(null);
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 py-2 transition-colors"
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </>
        )}

        <p className="text-xs text-gray-500 text-center mt-8">
          Powered by Dynamic.xyz
        </p>
      </div>
    </div>
  );
};
