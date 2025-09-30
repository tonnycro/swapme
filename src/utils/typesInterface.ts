
// types/token.ts
export interface Token {
    symbol: string;
    name: string;
    icon: string;
    address: string;
    decimals: number;
    chain: string;
    chainId: number;
  }


  export interface SelectTokenProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (token: Token) => void;
  }


  export interface AggregatorContract {
    estimateGas: {
      executeSwap(
        tokenIn: string,
        tokenOut: string,
        amountIn: string,
        amountOutMin: string,
        router: string,
        recipient: string,
        deadline: string
      ): Promise<any>;
    };
    executeSwap(
      tokenIn: string,
      tokenOut: string,
      amountIn: string,
      amountOutMin: string,
      router: string,
      recipient: string,
      deadline: string
    ): Promise<any>;
  }

  export interface IChain {
    id: number;
    name: string;
    img?: string;
    active?: boolean;
  }


  export interface DEX {
    name: string;
    routerAddress: string;
    factory: string;
    active: boolean;
    isV3: boolean;
    quoter: string;
    feeTiers: number[];
  }
  
  export type WrappedInfo = [string, `0x${string}`, `0x${string}`];
