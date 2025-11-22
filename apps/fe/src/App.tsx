import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Login } from './components/Login';
import { WalletDisplay } from './components/WalletDisplay';
import { MessageForm } from './components/MessageForm';
import { SignatureHistory } from './components/SignatureHistory';

function App() {
  const { user } = useDynamicContext();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Web3 Message Signer</h1>
          <p className="text-gray-600">Sign and verify messages with your Web3 wallet</p>
        </div>

        <WalletDisplay />
        <MessageForm />
        <SignatureHistory />
      </div>
    </div>
  );
}

export default App;
