import { useDynamicContext, useEmbeddedWallet } from '@dynamic-labs/sdk-react-core';
import { useState } from 'react';

export const useWallet = () => {
  const { primaryWallet, user } = useDynamicContext();
  const { createEmbeddedWallet, userHasEmbeddedWallet } = useEmbeddedWallet();
  const [isSigning, setIsSigning] = useState(false);

  const address = primaryWallet?.address || undefined;
  const isConnected = !!primaryWallet && !!user;

  const signMessage = async (message: string): Promise<string> => {
    
    if (!primaryWallet) {
      
      throw new Error('Wallet not connected');
    }

    setIsSigning(true);
    try {
      const signature = await primaryWallet.signMessage(message);
      if (!signature) {
        throw new Error('Failed to get signature from wallet');
      }
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    } finally {
      setIsSigning(false);
    }
  };

  return {
    address,
    isConnected,
    user,
    primaryWallet,
    signMessage,
    isSigning,
    createEmbeddedWallet,
    userHasEmbeddedWallet,
  };
};
