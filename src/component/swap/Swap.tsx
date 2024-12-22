import { useContext, useState } from "react";
import { useAccount } from "wagmi";
import { BContext } from "../../utils/Context";
import { formatAddress } from "../../utils/Constants";
import SelectToken from "./SelectToken";

const Swap = () => {
  const { notify, setNotify } = useContext(BContext);
  const { address } = useAccount();

  const [fromToken, setFromToken] = useState({
    symbol: 'Cake',
    chain: 'BSC',
    amount: '100.00',
    value: 1839.20
  });
  const [toToken, setToToken] = useState({
    symbol: 'Aave',
    chain: 'BSC',
    amount: '6.11',
    value: 1728.42
  });
  const [recipient, setRecipient] = useState('');
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [isSelectTokenOpen, setIsSelectTokenOpen] = useState(false);
  const [selectingTokenType, setSelectingTokenType] = useState<null | 'from' | 'to'>(null); // 'from' or 'to'

  const handleTokenSelect = (token: any) => {
    if (selectingTokenType === 'from') {
      setFromToken(prev => ({ ...prev, symbol: token.symbol }));
    } else if (selectingTokenType === 'to') {
      setToToken(prev => ({ ...prev, symbol: token.symbol }));
    }
  };

  const changeSwapPosition = () => {
    const tempToken = { ...fromToken };
    setFromToken({ ...toToken });
    setToToken(tempToken);
  };

  const handleSwap = () => {
    if (!recipient || !isAddressConfirmed) {
      setNotify({
        active: true,
        type: 'error',
        title: 'Error',
        message: 'Please confirm recipient address'
      });
      return;
    }
    // Swap logic here
  };

  return (
    <div className="min-h-screen bg-transparent p-2 md:p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-black rounded-2xl p-2 md:p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              {/* Image placeholder */}
              <div className="w-8 h-8 rounded-full bg-gray-600" title="image (transferto logo)" />
            </div>
            <h1 className="text-xl font-semibold">Swap</h1>
          </div>
          <div className="text-sm text-gray-400">
            {address ? `Connected: ${formatAddress(address)}` : 'Connect Wallet'}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-400">I'd like to swap</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-900 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-500" title="image (token icon)" />
                    <button
                      className="bg-transparent outline-none"
                      onClick={() => {
                        setSelectingTokenType('from');
                        setIsSelectTokenOpen(true);
                      }}
                    >
                      {fromToken.symbol}
                    </button>
                  </div>
                  <span>on</span>
                  <div className="bg-transparent outline-none">
                    <option>{fromToken.chain}</option>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <input
                type="text"
                value={fromToken.amount}
                onChange={(e) => setFromToken(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-transparent w-full outline-none"
                placeholder="0.00"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Max (4,956)</span>
                <span>Bal ≈ ${fromToken.value.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors" 
              onClick={changeSwapPosition}
            >
              ↑↓
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400">And receive to</p>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500" title="image (token icon)" />
                  <button
                    className="bg-transparent outline-none"
                    onClick={() => {
                      setSelectingTokenType('to');
                      setIsSelectTokenOpen(true);
                    }}
                  >
                    {toToken.symbol}
                  </button>
                </div>
                <span>on</span>
                <div className="bg-transparent outline-none">
                  <option>{toToken.chain}</option>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <input
                type="text"
                value={toToken.amount}
                onChange={(e) => setToToken(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-transparent w-full outline-none"
                placeholder="0.00"
              />
              <div className="text-right text-sm text-gray-400">
                Bal ≈ ${toToken.value.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1">
                Send to recipient
                <span className="text-gray-500 cursor-help">?</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={recipient !== ''}
                  onChange={() => setRecipient(recipient ? '' : '0x')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
            {recipient !== '' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Recipient's ETH address"
                  className="w-full bg-gray-900 rounded-lg p-3 outline-none"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAddressConfirmed}
                    onChange={(e) => setIsAddressConfirmed(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-700 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm">I confirm that the address above is correct</span>
                </label>
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Route:</span>
              <div className="flex items-center gap-2">
                <span>{fromToken.symbol} on {fromToken.chain}</span>
                <span className="text-green-500">Anyswap bridge</span>
                <span className="text-green-500">Solana bridge</span>
                <span>{toToken.symbol} on {toToken.chain}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Gas:</span>
              <span>≈ $20.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Waiting time:</span>
              <span>23 min</span>
            </div>
            <button
              onClick={handleSwap}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-3 transition-colors"
            >
              Swap
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-400">
                Route priority:
                <span className="text-gray-500 cursor-help">?</span>
              </div>
              <select className="bg-transparent outline-none">
                <option>Recommended</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-400">
                Settings
                <span className="text-gray-500 cursor-help">?</span>
              </div>
              <button className="text-gray-400">⚙️</button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-right text-sm text-gray-400">
          Powered by Li.Fi
        </div>

        <SelectToken
          isOpen={isSelectTokenOpen}
          onClose={() => setIsSelectTokenOpen(false)}
          onSelect={handleTokenSelect}
        />
      </div>
    </div>
  );
};

export default Swap;