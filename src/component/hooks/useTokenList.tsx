import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { aggregatorABI, AggregatorAddress, handleChainId } from '../../utils/Constants';
import { Token } from '../../utils/typesInterface';
import { config, supportedChainIds } from '../../utils/configigurations';
import { getAccount } from '@wagmi/core'



// Define the shape of the raw token data from the contract
interface RawToken {
  symbol: string;
  name: string;
  tokenAddress: string;
  decimals: number;
  chainId: bigint;
  price: bigint;
  active: boolean;
  logouri: string;
}

export const useTokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, chainId: watchingChain  } = useAccount();
  const account = getAccount(config);

//   const chainId = useChainId();
const chainId = account.chainId;
// console.log(chainId,"veryyyyyyyyyyyyyyyyyyyyyyy", watchingChain);

  const chainToUse = !isConnected  ? 146 : isConnected && !supportedChainIds.includes(chainId as number) ? 146 : chainId;
// console.log(chainToUse, "lihhhhhhhhhhhhhhhhhhhhhhhhhhff jdkdkdk");


  const { data: contractTokens, isError, isSuccess } = useReadContract({
    address: AggregatorAddress,
    abi: aggregatorABI,
    functionName: 'getAllTokens',
    args: [chainToUse],
    // Add query options to prevent unnecessary refetching
    query: {
      staleTime: 300000, // Consider data fresh for 5 minutes
      notifyOnChangeProps: ['data', 'isRefetchError'] //dont know what to put here
    },
  });

      //   cacheTime: 3600000, // Keep data in cache for 1 hour
    //   enabled: Boolean(chainId), // Only run query when chainId is available



  useEffect(() => {
    if (isSuccess && Array.isArray(contractTokens)) {
      const formattedTokens: Token[] = contractTokens.map((token: RawToken) => ({
        symbol: token.symbol,
        name: token.name,
        icon:  token?.logouri != "" ? token.logouri : token.symbol, // Default to symbol if no icon
        address: token.tokenAddress,
        decimals: Number(token.decimals),
        chain: handleChainId(Number(token.chainId)) || "Unknown",
        chainId: Number(token.chainId)
        // price:  useTokenPrice(token.tokenAddress, Number(token.decimals)) || 0,
        // balance: 0 // Default balance
      }));
      
      setTokens(formattedTokens);
      setIsLoading(false);
    }

    if (isError) {
      setError('Failed to fetch tokens');
      setTokens([]);
      setIsLoading(false);
    }
  }, [contractTokens, isError, isSuccess, watchingChain]);

  return { tokens, isLoading, error, chainId };
};