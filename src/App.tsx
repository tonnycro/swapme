// import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from './component/footer/Footer'
import Header from './component/header/Header'
import { WagmiProvider } from 'wagmi'
import { useContext, useEffect, useState } from 'react'
import { BContext } from './utils/Context'
import { WalletOptions } from './component/header/WalletOptions'
import { config } from './utils/configigurations'
import Preloader from './component/loaders/Preloader'
import Notify from './component/loaders/Notify'
import { Route, Routes } from 'react-router-dom'
import Staking from './Pages/Staking'
import Nft from './Pages/Nft'
import Home from './Pages/Home'
import { ConnectKitProvider } from "connectkit";





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
    <div className='relative min-h-screen'
    style={{ 
      background: "linear-gradient(135deg, #000000 20%, #331109 50%, #662211 70%, #000000 100%)",
    }}
    >
       <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
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
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/staking" element={<Staking />} />
                    <Route path="/nft" element={<Nft />} />
                  </Routes>
                <Footer />
              </ConnectKitProvider>
          </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

export default App


