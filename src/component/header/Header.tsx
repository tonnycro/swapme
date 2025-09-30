import { useEffect, useState } from 'react'
import {  useAccount,  useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
// import { BContext } from '../../utils/Context'
import { formatAddress } from '../../utils/Constants';
import SupportedAndSelectedChain from './SupportedAndSelectedChain';
import { useNavigate } from 'react-router-dom';
import { ConnectKitButton } from 'connectkit';


const Header = () => {
    // const { showConnectors, setShowConnectors } = useContext(BContext);
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
    const navigate = useNavigate();

    const [active, setActive] = useState<string>("trade");
    const [isMobile, setIsMobile] = useState(false);
    const [navOpen, setNavOpen] = useState(false);


  const handleNavigation = (path: string, tab: string) => {
    setActive(tab); // Set the active tab
    navigate(path); // Navigate to the specified route
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint is 768px
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [navOpen]);



  useEffect(() => {
    // Find all elements with the target class
    const elements = document.getElementsByClassName('sc-fThUAz gjTzSN primary');
    
    // Convert HTMLCollection to Array and set background to transparent
    Array.from(elements).forEach(element => {
      (element as HTMLElement).style.backgroundColor = 'transparent';
    });
  }, []);


  return (
    <div className="flex items-center justify-between px-6 py-4 bg-black text-white border-b border-gray-800 relative">
      <div className="flex items-center space-x-4">
        {/* Logo and brand */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation("/", "trade")}
        >
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
      <div className="flex items-center gap-1 md:gap-4">

      <div className="hidden md:flex items-center gap-7 mr-0 md:mr-12">
        <div className={`text-md font-semibold cursor-pointer ${active === "trade" && "bg-gray-900 py-1 px-4 rounded-md"}`} onClick={() => handleNavigation("/", "trade")} >Trade</div>
        <div className={`text-md font-semibold cursor-pointer ${active === "stake" && "bg-gray-900 py-1 px-4 rounded-md"}`} onClick={() => handleNavigation("/staking", "stake")}>Stake</div>
        <div className={`text-md font-semibold cursor-pointer ${active === "nft" && "bg-gray-900 py-1 px-4 rounded-md"}`} onClick={() => handleNavigation("/nft", "nft")}>NFT</div>
      </div>


        <div className="">
          <SupportedAndSelectedChain />
        </div>
        <>
              <ConnectKitButton.Custom>
                  {({
                    show,
                    address,
                    ensName,
                  }) => {
                    return (
                     <>
                        {(isConnected && address) ? (
                        <button
                          onClick={() => disconnect()}
                          className="hidden md:flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-7 md:mr-0"
                        >
                          {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
                          <span className="text-sm">Connected: { ensName  ? `${ensName} ${formatAddress(address || '')}` : formatAddress(address || '') }</span>
                        </button>
                        )  : 
                        <button className="hidden md:flex items-center space-x-2 text-gray-400 hover:text-white transition-colors" onClick={show}>
                            Connect wallet
                        </button>
                        }
                      </>
                    );
                  }}
              </ConnectKitButton.Custom>
        </>
        { isMobile && 
          <label className="hamburger" >
          <input type="checkbox" 
           checked={navOpen}   
           onChange={(e) => setNavOpen(e.target.checked)} />
          <svg viewBox="0 0 32 32">
            <path
              className="line line-top-bottom"
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            />
            <path className="line" d="M7 16 27 16" />
          </svg>
        </label>
        }
      </div>

      {/* For mobile menu */}
      { navOpen && 
         <div className="bg-gray-900 flex flex-col items-center justify-center gap-4 w-full absolute left-[50%] top-16 translate-x-[-50%] translate-y-[-50%] p-5 z-40">
         <div className="w-full flex justify-between mt-16">
           <div className="flex items-center space-x-2 rounded-full" onClick={() => handleNavigation("/", "trade")}>
             <img 
               src="/logo.jpg" 
               alt="pegasus" 
               className="w-10 h-8 rounded-full "
             />
             <span className="text-[#8B8B8B] text-lg font-semibold">Pegasus</span>
           </div>

           {/* Then close */}
           <button 
             onClick={() => setNavOpen(!navOpen)}
             className="text-gray-400 hover:text-white text-xl"
           >
             ×
           </button>
         </div>
           <div className={`text-sm font-semibold cursor-pointer ${active === "trade" && "bg-gray-900 py-1 px-4 rounded-md"}`} onClick={() => handleNavigation("/", "trade")}>Trade</div>
           <div className={`text-sm font-semibold cursor-pointer ${active === "stake" && "bg-gray-900 py-1 px-4 rounded-md"}`} onClick={() => handleNavigation("/staking", "stake")}>Stake</div>
           <div className={`text-sm font-semibold cursor-pointer ${active === "nft" && "bg-gray-900 py-1 px-4 rounded-md"}`} onClick={() => handleNavigation("/nft", "nft")}>NFT</div>
           <div className='mt-5'>
              <ConnectKitButton.Custom>
                  {({
                    isConnected,
                    show,
                    address,
                    ensName,
                  }) => {
                    return (
                       <>
                        {isConnected ? (
                        <button
                          onClick={() => disconnect()}
                          className="hidden md:flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-7 md:mr-0"
                        >
                          {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
                          <span className="text-sm">Connected: { ensName  ? `${ensName} ${formatAddress(address || '')}` : formatAddress(address || '') }</span>
                        </button>
                        )  : 
                        <button className="hidden md:flex items-center space-x-2 text-gray-400 hover:text-white transition-colors" onClick={show}>
                            Connect wallet
                        </button>
                        }
                      </>
                    );
                  }}
              </ConnectKitButton.Custom>
           </div>
        </div>
      }
      
    </div>
  )
}

export default Header