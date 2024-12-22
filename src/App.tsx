// import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from './component/footer/Footer'
import Header from './component/header/Header'
import Stats from './component/stats_chart/Stats'
import Swap from './component/swap/Swap'
import { injected, WagmiProvider } from 'wagmi'
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, bsc } from 'wagmi/chains'
import { metaMask, safe, walletConnect } from 'wagmi/connectors'
import { useContext } from 'react'
import { BContext } from './utils/Context'
import { WalletOptions } from './component/header/WalletOptions'


// const { chains, publicClient } = configureChains(
//   [mainnet, bsc],
//   [publicProvider()]
// )
const projectId = '<WALLETCONNECT_PROJECT_ID>'

const config = createConfig({
  chains: [mainnet, sepolia, bsc],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http()
  },
})

const queryClient = new QueryClient()


function App() {
    const { showConnectors, setShowConnectors } = useContext(BContext);

  return (
    <div className='relative'>
     <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      {showConnectors && (
          <WalletOptions onClose={() => setShowConnectors(false)} />
        )}
          <Header />
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Section with Swap */}
            <Swap />

            {/* Right section with charts */}
            <Stats />
          </div>
          <Footer />
        </QueryClientProvider>
     </WagmiProvider>
    </div>
  )
}

export default App
