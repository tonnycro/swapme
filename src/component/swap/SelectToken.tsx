import { useState } from "react";

const SelectToken = ({ isOpen, onClose, onSelect }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const tokens = [
      {
        symbol: '2CRV',
        name: 'Curve.fi USDC/USDT',
        icon: '🌈'
      },
      {
        symbol: 'aArbAAVE',
        name: 'Aave Arbitrum AAVE',
        icon: 'A'
      },
      {
        symbol: 'aArbARB',
        name: 'Aave Arbitrum ARB',
        icon: 'A'
      },
      {
        symbol: 'aArbDAI',
        name: 'Aave Arbitrum DAI',
        icon: 'D'
      },
      {
        symbol: 'aArbEURS',
        name: 'Aave Arbitrum EURS',
        icon: 'E'
      },
      {
        symbol: 'aArbGHO',
        name: 'Aave Arbitrum GHO',
        icon: 'G'
      },
      {
        symbol: 'aArbLINK',
        name: 'Aave Arbitrum LINK',
        icon: 'L'
      },
      {
        symbol: 'aArbLUSD',
        name: 'Aave Arbitrum LUSD',
        icon: 'L'
      }
    ];
  
    const filteredTokens = tokens.filter(token => 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-black w-full max-w-md rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white font-semibold">Select Input Token</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
  
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search By Name or Symbol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white rounded-lg p-3 pl-10 outline-none border border-gray-700 focus:border-purple-500"
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
  
          <div className="max-h-96 overflow-y-auto">
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  {token.icon}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">{token.symbol}</span>
                  <span className="text-gray-400 text-sm">{token.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default SelectToken;