import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useWallet } from '../hooks/useWallet';
import { showSuccessToast, showErrorToast } from '../utils/toast';

export const WalletDisplay = () => {
  const { address, user } = useWallet();
  const { handleLogOut } = useDynamicContext();

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        showSuccessToast('Wallet address copied!');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        showErrorToast('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Connected Wallet</h2>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Address:</span>
              <button
                onClick={handleCopyAddress}
                className="text-left font-mono text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors"
                title="Click to copy"
              >
                {formatAddress(address)}
              </button>
            </div>
            {user?.email && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">{user.email}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogOut}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};
