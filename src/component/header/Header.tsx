import { useContext } from 'react'
import {  useAccount,  useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { BContext } from '../../utils/Context'
import { formatAddress } from '../../utils/Constants';


const Header = () => {
    const { showConnectors, setShowConnectors } = useContext(BContext);
    const { address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })




  return (
    <div className="flex items-center justify-between px-6 py-4 bg-black text-white border-b border-gray-800">
      <div className="flex items-center space-x-4">
        {/* Logo and brand */}
        <div className="flex items-center space-x-2">
          <img 
            src="/logo.jpg" 
            alt="pegasus" 
            className="w-10 h-8"
          />
          <span className="text-[#8B8B8B] text-sm">Pegasus</span>
        </div>
        
        {/* Vertical separator */}
        <div className="h-6 w-px bg-gray-700"></div>
        
        {/* Swap text */}
        <h1 className="text-xl font-medium">Swap</h1>
      </div>

      {/* Wallet connection */}
      <div className="flex items-center">
        {address  ? (
          <button
            onClick={() => disconnect()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
            <span className="text-sm">Connected: { ensName  ? `${ensName} ${formatAddress(address || '')}` : formatAddress(address || '') }</span>
          </button>
        ) : (
          <button
            onClick={() => setShowConnectors(!showConnectors)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-sm">Connect Wallet</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Header