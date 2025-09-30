import { useAccount, useReadContract } from 'wagmi';
import { aggregatorABI, AggregatorAddress } from '../../utils/Constants';
import { config, supportedChainIds } from '../../utils/configigurations';
import { getAccount } from 'wagmi/actions';
import { DEX, WrappedInfo } from '../../utils/typesInterface';



export function getDexesandWrapped() : {
    dexes: DEX[] | undefined;
    wrappedInfo: WrappedInfo | undefined;
  } {
      const { isConnected  } = useAccount();
      const account = getAccount(config);
      
      const chainId = account.chainId;
      const chainToUse = !isConnected  ? 146 : isConnected && !supportedChainIds.includes(chainId as number) ? 146 : chainId;
    // console.log("One two three four");

    const { data: wrappedInfo  } = useReadContract({
        address: AggregatorAddress[chainToUse as number] as `0x${string}`,
        abi: aggregatorABI,
        functionName: 'wrappedBy',
        query: {
          staleTime: 300000,
          enabled: Boolean(chainToUse),
        }
      }) as { data: WrappedInfo | undefined };;


      const { data: dexes  } = useReadContract({
        address: AggregatorAddress[chainToUse as number] as `0x${string}`,
        abi: aggregatorABI,
        functionName: 'getDexes',
        query: {
          staleTime: 300000,
          enabled: Boolean(chainToUse),
        }
      }) as { data: DEX[] | undefined }
    
    //   console.log(dexes, wrappedInfo, "checking the results first offf")
  return {dexes, wrappedInfo};
}
