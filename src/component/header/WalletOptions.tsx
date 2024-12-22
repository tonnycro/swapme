import * as React from 'react'
import { Connector, useConnect } from 'wagmi'


interface WalletOptionsProps {
    onClose: () => void;
  }

export function WalletOptions({ onClose }: WalletOptionsProps) {
    const { connectors, connect } = useConnect()

    // Group connectors into main wallets and others
    const mainWallets = connectors.slice(0, 5)
    const otherWallets = connectors.slice(5)
    
    const handleConnect = (connector: any) => {
      connect({ connector })
      onClose()
    }

  return (
    <div className="fixed w-full h-full bg-[#000000] bg-opacity-[75%] flex justify-center items-center z-[99999999999]">
    <div className="bg-[#1A1A1A] rounded-2xl w-[420px] p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="text-gray-500 cursor-help">?</div>
          <h2 className="text-white text-lg font-medium">Connect Wallet</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          close
        </button>
      </div>

      {/* Wallet Options */}
      <div className="space-y-2">
        {/* Main wallets */}
        {mainWallets.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors rounded-lg p-4 flex items-center justify-between group"
          >
            <span className="text-white font-medium">{connector.name}</span>
            <div className="w-6 h-6">
              {connector.name === 'MetaMask' && (
                <div className="w-6 h-6 text-orange-500">🦊</div>
              )}
              {connector.name === 'Coinbase Wallet' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full" />
              )}
            </div>
          </button>
        ))}

        {/* Other Wallets button if there are more connectors */}
        {otherWallets.length > 0 && (
          <button
            className="w-full bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors rounded-lg p-4 flex items-center justify-between group"
          >
            <span className="text-white font-medium">Other Wallets</span>
            <div className="flex -space-x-1">
              <div className="w-4 h-4 bg-blue-400 rounded-sm" />
              <div className="w-4 h-4 bg-purple-400 rounded-sm" />
            </div>
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          I don't have a wallet
        </button>
      </div>
    </div>
  </div>
  )
}