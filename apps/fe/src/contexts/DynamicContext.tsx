import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import type { ReactNode } from 'react';
import { ENV } from '../config/env';

interface DynamicContextProps {
  children: ReactNode;
}

export const DynamicContext = ({ children }: DynamicContextProps) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: ENV.dynamicEnvironmentId,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};
