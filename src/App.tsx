// import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from './component/footer/Footer'
import Header from './component/header/Header'
import Stats from './component/stats_chart/Stats'
import Swap from './component/swap/Swap'
import { WagmiProvider } from 'wagmi'

import { useContext, useEffect, useState } from 'react'
import { BContext } from './utils/Context'
import { WalletOptions } from './component/header/WalletOptions'
import { config } from './utils/configigurations'
import Preloader from './component/loaders/Preloader'
import Notify from './component/loaders/Notify'


// const { chains, publicClient } = configureChains(
//   [mainnet, bsc],
//   [publicProvider()]
// )


const queryClient = new QueryClient()


function App() {
    const { notify, setNotify, showConnectors, setShowConnectors } = useContext(BContext);
    const [preloader, setPreloader] = useState<boolean>(true);


    useEffect(() => {
      setTimeout(() => {
        setPreloader(false)
      }, 5000);
    }, [preloader])

      // Auto-close after 5 seconds
    useEffect(() => {
    if (notify.active) {
      const timer = setTimeout(() => {
        setNotify({
          active: false,
          type: '',
          title: '',
          message: ''
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notify.active]);
    

  return (
    <div className='relative'>
     <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
       {
        preloader && <Preloader />
       }

       {
        notify && <Notify />
       }
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
