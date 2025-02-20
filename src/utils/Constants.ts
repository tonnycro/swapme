
import aggregatorABIJson from "./AggregatorAbi.json";
import ERCAbi from "./Erc20Abi.json";
import { getPublicClient } from "@wagmi/core";
import { ethers } from 'ethers';
import { config } from './configigurations'
import { useSwitchChain } from 'wagmi'
import { getGasPrice } from '@wagmi/core'



  //aggregator
  export const aggregatorABI = aggregatorABIJson;
  export const AggregatorAddress = "0xb604be578BAd39DFeaDEBCe738F324208e57C221";
  // erc20 
  export const ERCABI = ERCAbi;
  // main one 0x170EB0A66204FEb483F9Dd8c2C57f6fd8FC4daDC
  // dummy 0x8e1C05680bD88297485f2EB8a9894599A26117aD
  export const StakingTokenAddress = "0x170EB0A66204FEb483F9Dd8c2C57f6fd8FC4daDC";
  // Format address to show only first 8 and last 7 characters
  export const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 8)}...${addr.slice(-7)}`
  }

  // Utility function for USD value calculation
export const calculateUSDValue = (amount: string, price: number): number => {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || !price) return 0;
  return numericAmount * price;
};


// utils/formatAmount.ts
export const formatAmount = (amount: string | number, decimals: number = 6): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0.00';
  
  // Handle different scales of numbers
  if (num < 0.000001) return '<0.000001';
  if (num > 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num > 1000) return `${(num / 1000).toFixed(2)}K`;
  
  return num.toFixed(decimals);
};

export const formatBigNumber = (value: bigint | number, decimals: number = 18): number => {
  if (value === 0 || value === 0n) return 0;

  if (typeof value !== 'bigint' && typeof value !== 'number') {
    throw new Error('Value must be a bigint or number');
  }


  if (typeof value === 'number') {
    // Handle number input
    return value;
  }  

  // Convert to string first to avoid precision loss
  const stringValue = value.toString();
  const divisor = BigInt(10 ** decimals);
  
  // Perform the division maintaining precision
  const beforeDecimal = BigInt(stringValue) / divisor;
  const afterDecimal = BigInt(stringValue) % divisor;  

  // Scale the value down by the decimals
  // const scaledValue = Number(value) / Number(10n ** BigInt(decimals));

    // Combine the parts and convert to number
    const fullNumber = Number(beforeDecimal.toString() + '.' + afterDecimal.toString().padStart(decimals, '0'));

  return fullNumber;
};


// Utility function to format scientific notation to regular decimal
export const normalizeScientificNotation = (value: number): number => {
  // Check if the value is in scientific notation
  if (isScientificNotation(value)) {
    // Define a scaling factor (e.g., 1e12 for values like 5.13699e-13)
    const scalingFactor = 1e12;
    // Scale the value and round it to 4 decimal places (or as needed)
    return Number((value * scalingFactor).toFixed(4));
  }
  // For non-scientific notation values, return as is
  return value;
};


export const formatTokenPrice = (price : number) => {
  // Format price to maximum 6 decimal places
  if (!price || isNaN(price)) return '$0.00';

  let normalizedPrice;
  if(isScientificNotation(price)) {
    normalizedPrice = normalizeScientificNotation(price);
  } else {
   normalizedPrice = price
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(normalizedPrice);
};

export const formatTokenBalance = (balance : number) => {
  if (balance >= 1e6) {
    return (balance / 1e6).toFixed(2) + 'M';
  }
  if (balance >= 1e3) {
    return (balance / 1e3).toFixed(2) + 'K';
  }
  return parseFloat(balance.toFixed(4));
};


export const handleChainId = (id: number): string | null => {
  switch (id) {
    case 97:
      return "BNB";
    case 56:
      return "BNB";
    case 300:
      return "Sepolia";
    case 1:
      return "ETH";
    case 146:
      return "Sonic";
    default:
      return null;
  }
};



//for small numbers
const isScientificNotation = (num: number) => {
  return num.toString().includes('e') || num.toString().includes('E');
};


export const convertToArrayOrdered = (obj: { [key: number]: string }) => {
  return Object.entries(obj)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([_, value]) => value);
};


//get token price
export async function getTokenPrice(
  tokenAddress: string | `0x${string}`,
  chainId: number
) {
    try {
      const publicClient = getPublicClient( config );
      // Convert viem public client to ethers provider
      const provider = new ethers.BrowserProvider(publicClient.transport);

        const contract = new ethers.Contract(
            AggregatorAddress,
            aggregatorABI,
            provider
        );
        
        const tokenPrice = await contract.getTokenPrice(tokenAddress, chainId);
        return tokenPrice ? formatBigNumber(tokenPrice) : 0;
    } catch (error) {
        console.error('Error fetching token price:', error);
        return 0;
    }
}


//get quote
export async function getBestQuote(
  fromAddress: string | `0x${string}`,
  toAddress: string | `0x${string}`,
  amount: number,
  exact: boolean,
  chain: number,
) {
    try {

      if(amount === 0) {
        return {
          quotes: [],
          bestQuote: null
        };
      }
      const publicClient = getPublicClient( config );
      // Convert viem public client to ethers provider
      const provider = new ethers.BrowserProvider(publicClient.transport);

        const contract = new ethers.Contract(
            AggregatorAddress,
            aggregatorABI,
            provider
        );

        const amountInWei = ethers.parseUnits(amount.toString(), 18); // Assuming 18 decimals
        // console.log(chain, "Nothing spoil", amountInWei);
        const quotes = await contract.getBestQuote(
          fromAddress,
          toAddress,
          amountInWei,
          exact,
          chain
        );

    
        // Find best quote
        const bestQuote = quotes.reduce((prev: any, current: any) => {
          if (exact) {
            return current.amountOut > prev.amountOut ? current : prev;
          }
          return current.amountIn < prev.amountIn ? current : prev;
        });
    
        return {quotes, bestQuote};
    } catch (error) {
        console.error('Error fetching quote:', error);
        return {
          quotes: [],
          bestQuote: null
        };
    }
}

//get token balance
export async function getTokenBalance(
  tokenAddress: string | `0x${string}`,
  userAddress: string | `0x${string}`
) {
    try {
      const publicClient = getPublicClient( config );
      // Convert viem public client to ethers provider
      const provider = new ethers.BrowserProvider(publicClient.transport);

        const contract = new ethers.Contract(
            tokenAddress,
            ERCABI,
            provider
        );
        
        const tokenBalance = await contract.balanceOf(userAddress);
        return tokenBalance ? formatBigNumber(tokenBalance) : 0;
    } catch (error) {
        console.error('Error fetching token price:', error);
        return 0;
    }
}


export async function getTokenApproval(
  tokenAddress: string | `0x${string}`,
  spenderAddress: string | `0x${string}`,
  ownerAddress: string | `0x${string}`
) {
    try {
      const publicClient = getPublicClient( config );
      // Convert viem public client to ethers provider
      const provider = new ethers.BrowserProvider(publicClient.transport);

        const contract = new ethers.Contract(
            tokenAddress,
            ERCABI,
            provider
        );
        
        const tokenAllowance = await contract.allowance(ownerAddress, spenderAddress);
        return tokenAllowance ? formatBigNumber(tokenAllowance) : 0;
    } catch (error) {
        console.error('Error fetching token allowance:', error);
        return 0;
    }
}


export const getGasDetails = async (tokenIn: string, tokenOut: string, amountIn: number, amountOutMin: number, router: string, recipient: string, deadline: string) => {
  try {
    // const publicClient = getPublicClient(config);


   console.log(
        tokenIn,
        tokenOut,
        amountIn,
        amountOutMin,
        router,
        recipient,
        deadline
       );
   

    // const gasLimit = await publicClient.estimateContractGas({
    //   address: AggregatorAddress, // Contract address
    //   abi: aggregatorABI, // Contract ABI
    //   functionName: 'executeSwap', // Function to call
    //   args: [
    //     tokenIn,
    //     tokenOut,
    //     amountIn,
    //     amountOutMin,
    //     router,
    //     recipient,
    //     deadline
    //   ], // Arguments (if needed)
    //   account: recipient as `0x${string}` // Use recipient as the sender/caller
    // })

    // console.log(gasLimit, "gasLimit");
    

    // const gasPrice = (await provider.getFeeData()).gasPrice;
    const gasPrice = await getGasPrice(config);
    

    return {
      gasLimit: 0,
      gasPrice: gasPrice,
    };
  } catch (error) {
    console.error('Error fetching gas amount', error);
    return { gasLimit: '0', gasPrice: '0' };
  }
};


export const changeChain = async (): Promise<void> => {
  try {
    await useSwitchChain({config});
  } catch (error) {
    console.error("Error in chainging chain", error);
  }
};


export const getTradePath = async (tokenAddresses: string[], amount: number) : Promise<string[]> => {
  try {

      if(amount === 0) {
        return [];
      }
      const publicClient = getPublicClient(config);
      const provider = new ethers.BrowserProvider(publicClient.transport);

      const tokenNames = await Promise.all(
          tokenAddresses.map(async (address) => {
              try {
                  const contract = new ethers.Contract(address, ERCABI, provider);
                  return await contract.name();
              } catch {
                  return address.slice(0, 6) + '...' + address.slice(-4);
              }
          })
      );

      return tokenNames;
  } catch (error) {
      console.error('Error fetching token names:', error);
      return tokenAddresses;
  }
}