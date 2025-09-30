import { getDefaultConfig } from 'connectkit'
import { http, createConfig, } from 'wagmi'
// import { bsc, bscTestnet, sonic } from 'wagmi/chains'
import { sonic } from 'wagmi/chains'
// import { sonicBlazeTestnet } from './Newchain'


const projectId = import.meta.env.VITE_WALLET_CONNECT as string;

export const config = createConfig(
  getDefaultConfig({
    chains: [sonic],
    transports: {
      // [sonicBlazeTestnet.id]: http(),
      [sonic.id]: http(),
      // [bsc.id]: http(),
      // [bscTestnet.id]: http()
    },
    walletConnectProjectId: projectId,
    // Required App Info
    appName: "Pegasus",
    // Optional App Info
    appDescription: "Aggregator",
    appUrl: "https://app.pegasus.xyz", // your app's url
    appIcon: "__",
  })
)

//  export const supportedChainIds : number[] = [bsc.id, bscTestnet.id, sonic.id, sonicBlazeTestnet.id];
 export const supportedChainIds : number[] = [ sonic.id ];
