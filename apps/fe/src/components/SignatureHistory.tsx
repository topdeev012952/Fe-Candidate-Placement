import { useApp } from '../contexts/AppContext';
import type { MessageHistoryItem } from '../types/message';

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

const formatAddress = (addr: string) => {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
};

const HistoryItem = ({ item }: { item: MessageHistoryItem }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">Message:</p>
          <p className="text-gray-900 font-medium break-words">{item.message}</p>
        </div>
        {item.verificationResult && (
          <div
            className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
              item.verificationResult.isValid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {item.verificationResult.isValid ? 'Valid' : 'Invalid'}
          </div>
        )}
      </div>

      {item.verificationResult && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Signer:</span>
              <span className="ml-2 font-mono text-gray-900">
                {formatAddress(item.verificationResult.signer)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <span className="ml-2 text-gray-900">{formatDate(item.timestamp)}</span>
            </div>
          </div>
        </div>
      )}

      {!item.verificationResult && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Verification pending...</p>
        </div>
      )}

      <div className="mt-2">
        <p className="text-xs text-gray-400 font-mono break-all">
          Signature: {item.signature.slice(0, 20)}...
        </p>
      </div>
    </div>
  );
};

export const SignatureHistory = () => {
  const { history, clearHistory } = useApp();

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Message History</h2>
        <p className="text-gray-500 text-center py-8">No messages signed yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Message History</h2>
        <button
          onClick={clearHistory}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-4">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
