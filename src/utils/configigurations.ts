import { http, createConfig, injected } from 'wagmi'
// import { bsc, bscTestnet, sonic } from 'wagmi/chains'
import { sonic } from 'wagmi/chains'
import { metaMask, safe, walletConnect } from 'wagmi/connectors'
// import { sonicBlazeTestnet } from './Newchain'


const projectId = '0f4bd2cd3c482312c0316388804f130a'

export const config = createConfig({
    chains: [sonic],
    connectors: [
      injected(),
      walletConnect({ projectId }),
      metaMask(),
      safe(),
    ],
    transports: {
      // [sonicBlazeTestnet.id]: http(),
      [sonic.id]: http(),
      // [bsc.id]: http(),
      // [bscTestnet.id]: http()
    },
  })

//  export const supportedChainIds : number[] = [bsc.id, bscTestnet.id, sonic.id, sonicBlazeTestnet.id];
 export const supportedChainIds : number[] = [ sonic.id ];
