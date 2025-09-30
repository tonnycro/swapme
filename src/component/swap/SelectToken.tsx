import { useMemo, useState } from "react";
import { useTokenList } from "../hooks/useTokenList";

const SelectToken = ({ 
  isOpenFrom, 
  isOpenTo, 
  onClose, 
  onSelect, 
  fromTokenAddress = null, 
  toTokenAddress = null 
}: any) => {
  
    const [searchQuery, setSearchQuery] = useState('');

      const { tokens, isLoading, error } = useTokenList();
    
      // const filteredTokens = tokens.filter(token => 
      //   token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //   token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //   token.address.includes(searchQuery)
      // );

      const filteredTokens = useMemo(() => {
        let result = tokens;
    
        // If selecting "from" token, exclude the current "to" token
        if (isOpenFrom && toTokenAddress) {
          result = result.filter(token => token.address !== toTokenAddress);
        }
    
        // If selecting "to" token, exclude the current "from" token
        if (isOpenTo && fromTokenAddress) {
          result = result.filter(token => token.address !== fromTokenAddress);
        }
    
        // Apply search query filtering
        return result.filter(token => 
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.address.includes(searchQuery)
        );
      }, [tokens, searchQuery, isOpenFrom, isOpenTo, fromTokenAddress, toTokenAddress]);
  
    if (!isOpenTo && !isOpenFrom) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className=" bg-gray-900 w-full max-w-md rounded-xl  p-4">
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
              className="w-full bg-gray-900 text-white rounded-lg p-3 pl-10 outline-none border border-gray-700 focus:border-[#ee7244]"
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

          {isLoading ? (
            <div className="text-center text-gray-400 py-4">Loading tokens...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No tokens found</div>
          ) : (
            filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  {token.icon.startsWith("http") ? (
                    <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  ) : (
                    token.icon
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">{token.symbol}</span>
                  <span className="text-gray-400 text-sm">{token.name}</span>
                </div>
                {/* {token.balance && (
                  <div className="ml-auto text-right">
                    <div className="text-white">{token.balance}</div>
                    <div className="text-sm text-gray-400">
                      ${token.balance * token.price}
                    </div>
                  </div>
                )} */}
              </button>
            ))
          )}
          
          </div>
        </div>
      </div>
    );
  };

export default SelectToken;