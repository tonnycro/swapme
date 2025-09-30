import { useReadContract } from 'wagmi';
import { aggregatorABI, AggregatorAddress, formatBigNumber } from '../../utils/Constants';

export function getTokenPrice(
  tokenAddress: string | `0x${string}`,
  chainId: number
) {

    const { data: tokenPrice } = useReadContract({
        address: AggregatorAddress[chainId] as `0x${string}`,
        abi: aggregatorABI,
        functionName: 'getTokenPrice',
        args: [tokenAddress, chainId],
        query: {
          staleTime: 300000,
          enabled: Boolean(chainId),
        }
      });
    
   const tokenToReturn = tokenPrice ? formatBigNumber(tokenPrice as bigint) : 0 ;
  return {tokenToReturn };
}
