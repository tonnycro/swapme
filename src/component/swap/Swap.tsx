import {  useContext, useEffect, useRef, useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BContext } from "../../utils/Context";
import {  aggregatorABI, AggregatorAddress, ERCABI, formatAddress, formatAmount, formatBigNumber, formatTokenBalance, formatTokenPrice, getBestQuote, getGasDetails, getTokenApproval, getTokenBalance, getTokenPrice, getTradePath } from "../../utils/Constants";
import SelectToken from "./SelectToken";
import { useTokenList } from "../hooks/useTokenList";
import { Token } from "../../utils/typesInterface";
import { config, supportedChainIds } from "../../utils/configigurations";
import { getAccount } from "wagmi/actions";
import { ethers } from "ethers";
import StatusReport from "../modals/StatusReport";
import ChangeChain from "../modals/ChangeChain";

const Swap = () => {
  const { showConnectors, setShowConnectors, setNotify, setTradePath, setMadeAchoice, madeAchoice } = useContext(BContext);
  const { address, isConnected, chainId: watchingChain  } = useAccount();
  const { tokens } = useTokenList();
  const account = getAccount(config);
  const chainId = account.chainId;
  const { data: hash,  isPending: pendExecute,  writeContract:executeSwap } = useWriteContract();
  const { data: hashApprove, isPending: pendApprove,  writeContract: approveSwap } = useWriteContract();

  const { isLoading: isConfirmingSwap, isSuccess: isConfirmedSwap } = useWaitForTransactionReceipt({hash});
  const { isSuccess: isConfirmedApproved } = useWaitForTransactionReceipt({hash: hashApprove})




  // Initialize with null and set first token after loading
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const [swapFromAmount, setSwapFromAmount] = useState<number>(0);
  const [swapToAmount, setSwapToAmount] = useState<number>(0);


  // Set initial tokens once the token list is loaded
  useEffect(() => {
    if (tokens && tokens.length >= 2 && !fromToken && !toToken) {
      // Initialize fromToken with the first token from the list
      setFromToken(tokens[0]);
      
      // Initialize toToken with the second token from the list
      setToToken(tokens[1]);
    }
  }, [tokens, fromToken, toToken]);



  const [recipient, setRecipient] = useState<string | `0x${string}` | undefined>('');
  const [selectedRouter, setSelectedRouter] = useState<string | `0x${string}` | undefined>('');
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [isSelectFromTokenOpen, setIsSelectFromTokenOpen] = useState(false);
  const [isSelectToTokenOpen, setIsSelectToTokenOpen] = useState(false);
  const [selectingTokenType, setSelectingTokenType] = useState<null | 'from' | 'to'>(null); // 'from' or 'to'
  const [v3FeeTier, setV3FeeTier] = useState(0);
  const [minFee, setMinFee] = useState<number>(0);
  const [flowPath, setFlowPath] = useState<`0x${string}` []>();

  const [swapPosition, setSwapPosition] = useState<boolean>(false);

  //change chain modal
  const [changeChainModal, setChangeChainModal] = useState<boolean>(false);
  //open status modal
  const [statusMo, setStatusMo] = useState<boolean>(false);
  //for prices
  const [fromTokenPrice, setFromTokenPrice] = useState<number>(0);
  const [toTokenPrice, setToTokenPrice] = useState<number>(0);
  //for balances
  const [fromTokenBalance, setFromTokenBalance] = useState<number>(0);
  const [toTokenBalance, setToTokenBalance] = useState<number>(0);
  //for swap price in dollar
  const [swapPrice, setSwapPrice] = useState<number>(0);
  //for quotes
  const [quotes, setQuotes] = useState<any[]>([]);
  const [, setBestQuote] = useState<any>(null);
  //gasPrice
  const [gasPrice, setGasprice] = useState<any>(0);
  //approval amount
  const [allowanceAmount, setAllowanceAmount] = useState<number>(0);
  //watch chain
  const [chainAccountChanged] = useState<boolean>(false);
  


  const handleTokenSelect = (token: any) => {
    if (selectingTokenType === 'from') {
      setFromToken(token);
    } else if (selectingTokenType === 'to') {
      setToToken(token);
    }
  };

  const changeSwapPosition = () => {
    if (fromToken && toToken) {
      const tempToken = { ...fromToken };
      setFromToken({ ...toToken });
      setToToken(tempToken);
      setSwapPosition(!swapPosition);
    }
  };




  const handleApprove = async () => {
    try {

      if(allowanceAmount === 0 || allowanceAmount < swapFromAmount) {
         await approveSwap({
           address: fromToken?.address as `0x${string}`,
           abi: ERCABI,
           functionName: 'approve',
           args: [
             AggregatorAddress,
             ethers.parseUnits(swapFromAmount.toString(), fromToken?.decimals || 18)
           ],
         })    
 
      }
 
    } catch (error) {
      console.log("now I am thinking", error);
      
    }
  }

  //lets swap
  const handleSwap = async () => {
   
    let receiver : string | `0x${string}` | undefined = address;
    const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minute deadline

    if(!address) {
      setNotify({
        active: true,
        type: 'error',
        title: 'Error',
        message: 'Please connect wallet to continue'
      });
      return;
    }


    if(recipient && isAddressConfirmed) {
      receiver = recipient;
    }
    // Swap logic here

    try {
      
      const amountSwapFrom = ethers.parseUnits(swapFromAmount.toString(), fromToken?.decimals || 18);
      const amountSwapTo = ethers.parseUnits(swapToAmount.toString(), toToken?.decimals || 18);
      const minFeeConverted = ethers.parseUnits(Math.abs(minFee).toString(), 18);
      const feeTierConverted = ethers.parseUnits(v3FeeTier.toString(), 18);


      console.log('Starting swap execution...'); 
      console.log('Missing required parameters:', {
        fromToken: fromToken?.address,
        toToken: toToken?.address,
        amountSwapFrom,
        amountSwapTo,
        selectedRouter,
        receiver,
        deadline,
        feeTierConverted,
        minFeeConverted,
        flowPath,

      });     
      
      await executeSwap({
        address: AggregatorAddress as `0x${string}`,
        abi: aggregatorABI,
        functionName: 'executeSwap',
        args: [
          fromToken?.address as string,
          toToken?.address as string,
          amountSwapFrom,
          amountSwapTo,
          selectedRouter,
          receiver as string,
          deadline,
          feeTierConverted,
          minFeeConverted,
          flowPath
        ],
      })

      console.log('Swap execution result:');

        setStatusMo(true);
      
      
    } catch (error) {
      console.error("Error from swapping", error);
    }
  };




  //close token modal
  const closeTokenModal = () => {
    if(isSelectFromTokenOpen) {
      setIsSelectFromTokenOpen(false);
    } else {
      setIsSelectToTokenOpen(false)
    }
  }




  useEffect(() => {
    // console.log("Sernergyyyyyyyyy", watchingChain, account.chainId);

        if(isConnected && fromToken?.address !== undefined && watchingChain !== undefined && supportedChainIds.includes(watchingChain as number)) {
          const fetchAllowance = async () => {
            const allowance = await getTokenApproval(fromToken?.address as string, AggregatorAddress, address as string);
            
            setAllowanceAmount(allowance);
          }
          

          fetchAllowance();
        }

  }, [allowanceAmount, isConnected, quotes, isConfirmedApproved, chainAccountChanged, watchingChain]);


  //handle account chanes and others
  // useEffect(() => {
  //   if (connector) {
  //     const handleAccountsChanged = (accounts: string[]) => {
  //       // Handle account change logic
  //       console.log('Accounts changed:', accounts);
  //       setChainAccountChanged(!chainAccountChanged);
  //     };
  
  //     const handleChainChanged = (chainId: string) => {
  //       // Handle chain change logic
  //       const numChainId = parseInt(chainId, 16);
  //       console.log('Chain changed:', numChainId);
  //       setChainAccountChanged(!chainAccountChanged);
  //     };
  
  //     connector.onAccountsChanged = handleAccountsChanged;
  //     connector.onChainChanged = (chainId) => {
  //        console.log("chain changed omomomom", chainId);
         
  //     };
  
  //     return () => {
  //       // Optional: Remove event listeners if needed
  //       connector.onAccountsChanged = handleAccountsChanged;
  //       connector.onChainChanged = handleChainChanged;
  //     };
  //   }
  // }, [connector, chainAccountChanged]);
  

  // Add this useEffect to fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      if (fromToken?.address && fromToken?.chainId) {
        const price = await getTokenPrice(fromToken.address, fromToken.chainId);
        // const formatable = formatTokenPrice(price);
        const regularNumber = Number(price);
        
        setFromTokenPrice(regularNumber);
      }
    };

    fetchPrices();
  }, [fromToken?.address, fromToken?.chainId, swapPosition, watchingChain]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (toToken?.address && toToken?.chainId) {
        const price = await getTokenPrice(toToken.address, toToken.chainId);
        // const formatable = formatTokenPrice(price);
        const regularNumber = Number(price);
        setToTokenPrice(regularNumber);
      }
    };

    fetchPrices();
  }, [toToken?.address, toToken?.chainId, swapPosition, watchingChain]);

  //Now fetch token user balance
  useEffect(() => {
    if(isConnected && address && supportedChainIds.includes(watchingChain as number)) {
      
      const fetchTokenBalance = async () => {
        if (fromToken?.address && fromToken?.chainId) {
          const balance = await getTokenBalance(fromToken.address, address);
          const formatable = formatTokenBalance(balance);
          setFromTokenBalance(formatable as number);
        }
      };
  
        fetchTokenBalance();
    }
  }, [address, quotes, swapPosition, fromToken, isConfirmedSwap, chainAccountChanged, watchingChain]);

  useEffect(() => {
    
    if(isConnected && address && supportedChainIds.includes(watchingChain as number)) {
      
      const fetchTokenBalance = async () => {
        
        if (toToken?.address && toToken?.chainId) {
          
          const balance = await getTokenBalance(toToken.address, address);
          const formatable = formatTokenBalance(balance);
          setToTokenBalance(formatable as number);
        }
      };
  

        fetchTokenBalance();
    }
  }, [address, quotes, swapPosition, toToken, isConfirmedSwap, chainAccountChanged, watchingChain]);


  const inputRef = useRef<HTMLInputElement>(null);


  const getQuoteOut = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!isConnected && !address && !supportedChainIds.includes(watchingChain as number)) {
      return;
    }



    const inputValue = e.target.value;
    let amount: number;
      
    // if(!inputValue) {
    //   return;
    // }

    // Handle initial state and single zero input
    if (inputValue === "" || inputValue === "0" && inputValue.length < 1) {
      console.log("This oneeeeeeeeeeeeeeee, hereeeeeeeeee")
      setSwapFromAmount(0);
      amount = 0;
    }

    // Handle decimal point input
    if (inputValue === ".") {
      setSwapFromAmount(0.);
      amount = 0;
    }


    // Handle decimal numbers starting with "0."
    if (inputValue.startsWith("0.")) {
      const value = parseFloat(inputValue);
      setSwapFromAmount(value);
      amount = value;
    }
    // Handle numbers that start with 0 but aren't decimals
    else if (inputValue.startsWith("0") && inputValue.length > 1 && !inputValue.includes(".")) {
      console.log("insidous warehousing iiiiiiiggggggggggggg")
      const cleanedValue = inputValue.slice(1);
          // Clear and update the input value directly
      if (inputRef.current) {
          inputRef.current.value = cleanedValue?.toString();
      }
      // console.log(cleanedValue, "checking cleaned value, ajehhhhhhhhh");
      const value = parseFloat(cleanedValue);
      setSwapFromAmount(value);
      amount = value;
    }
    // Handle all other numbers
    else {
      amount = parseFloat(inputValue);
      setSwapFromAmount(amount);
    }
     
     console.log(amount, "checking what amount was at this junction");
    if(amount === undefined || Number.isNaN(amount)) {
      return;
    }


      const {quotes} = await getBestQuote(fromToken?.address as string, toToken?.address as string, amount, true, chainId as number);

      // console.log(quotes, "checking the data structure of the quote");


      // Transform the quote data into the expected format
      const formattedQuote = {
            dexName: quotes[0],
            routerAddress: quotes[1],
            amountIn: Number(quotes[2]),
            amountOut: Number(quotes[3]) | 0,
            path: quotes[4],
            v3Path: quotes[5],
            isV3: quotes[6],
            feeTier: quotes[7]
        };
      console.log(formattedQuote, "checking things out out out", formattedQuote.path);

      
      setQuotes(quotes.length === 0 ? [] : [formattedQuote]);
      setBestQuote(formattedQuote);
      setSwapToAmount(formatBigNumber(quotes[3]));
      setSelectedRouter(formattedQuote.routerAddress);
      const gottenPrice = formattedQuote.amountOut * toTokenPrice;
      setSwapPrice(gottenPrice);
      const min =  1 / formattedQuote.amountOut *  formattedQuote.amountIn
      setMinFee(min);
      if(formattedQuote.isV3) {
        setV3FeeTier(formattedQuote.feeTier);
        setFlowPath(Object.values(formattedQuote?.v3Path));
      } else {
        setFlowPath(Object.values(formattedQuote?.path));
      }

      // Fetch the necessary parameters for the swap
      const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minute deadline
      //
      // fromToken?.address as string,
      // toToken?.address as string,
      // swapFromAmount,
      // swapToAmount,
      // selectedRouter,
      // receiver as string,
      // deadline,

      const { gasPrice } = await getGasDetails( fromToken?.address as string, toToken?.address as string, swapFromAmount, swapToAmount, formattedQuote.routerAddress, address as string, deadline.toString());
      // const allowance = await getTokenApproval(fromToken?.address as string, AggregatorAddress, address as string);
      // console.log(allowance, "setting allowance");
      
      // setAllowanceAmount(allowance);
      setGasprice(Number(gasPrice));


      //get swap route or trade route
      const routesGotten = await getTradePath(formattedQuote.path, swapFromAmount);
      if(routesGotten?.length > 0) {
        setTradePath(routesGotten);
        setMadeAchoice("path found");
      } else {
        setMadeAchoice("path not found");
      }
  }


  return (
    <div className="min-h-screen bg-transparent p-2 md:p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-black rounded-2xl p-2 md:p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              {/* Image placeholder */}
              <div className="w-8 h-8 rounded-full bg-gray-600" title="image (transferto logo)" />
            </div>
            <h1 className="text-xl font-semibold">Swap</h1>
          </div>
          <div className="text-sm text-gray-400">
            {address ? `Connected: ${formatAddress(address)}` : 'Connect Wallet'}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-400">I'd like to swap</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-900 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {fromToken?.icon.startsWith("http") ? (
                      <img src={fromToken.icon} alt={fromToken.symbol} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-teal-500" title="image (token icon)" />
                    )}
                    <button
                      className="bg-transparent outline-none flex justify-start items-center gap-1"
                      onClick={() => {
                        setSelectingTokenType('from');
                        setIsSelectFromTokenOpen(true);
                      }}
                    >
                      <div className="">{fromToken?.symbol}</div> 

                      <div className="">
                        {!isSelectFromTokenOpen ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <path fill="#1B7339" d="m7 10l5 5l5-5z"></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="#1B7339"
                                  d="M8.2 14q-.225 0-.362-.15T7.7 13.5q0-.05.15-.35l3.625-3.625q.125-.125.25-.175T12 9.3t.275.05t.25.175l3.625 3.625q.075.075.113.163t.037.187q0 .2-.137.35T15.8 14z"
                                ></path>
                              </svg>
                            )}
                        </div>
                    </button>

                  </div>
                  <span>on</span>
                  <div className="bg-transparent outline-none">
                    <option>{fromToken?.chain}</option>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <input
                type="number"
                ref={inputRef}
                value={swapFromAmount} // Use empty string when value is 0
                // onChange={(e) => {
                //   const value = parseFloat(e.target.value) === 0 ? 0. : parseFloat(e.target.value);
                //   setSwapFromAmount(value);
                //   getQuoteOut(e);
                // }}
                onChange={(e) => getQuoteOut(e) }
                className="bg-transparent w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTokenPrice(fromTokenPrice)}</span>
                <span>Bal ≈ {fromTokenBalance}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors" 
              onClick={changeSwapPosition}
            >
              ↑↓
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400">And receive to</p>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {toToken?.icon.startsWith("http") ? (
                      <img src={toToken.icon} alt={toToken.symbol} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-500" title="image (token icon)" />
                    )}
                  <button
                    className="bg-transparent outline-none flex justify-start items-center gap-1"
                    onClick={() => {
                      setSelectingTokenType('to');
                      setIsSelectToTokenOpen(true);
                    }}
                  >
                    <div className="">{toToken?.symbol}</div>

                    <div className="">
                      {!isSelectToTokenOpen ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <path fill="#1B7339" d="m7 10l5 5l5-5z"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#1B7339"
                                d="M8.2 14q-.225 0-.362-.15T7.7 13.5q0-.05.15-.35l3.625-3.625q.125-.125.25-.175T12 9.3t.275.05t.25.175l3.625 3.625q.075.075.113.163t.037.187q0 .2-.137.35T15.8 14z"
                              ></path>
                            </svg>
                          )}
                      </div>
                  </button>
                </div>
                <span>on</span>
                <div className="bg-transparent outline-none">
                  <option>{toToken?.chain}</option>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="text-[10px] text-grey-400">
                {formatTokenPrice(swapPrice)}
              </div>
              <input
                type="text"
                value={swapToAmount}
                onChange={(e) => {console.log(e)}}
                className="bg-transparent w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"  
              />
              <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTokenPrice(toTokenPrice)}</span>
                <span>Bal ≈ {toTokenBalance}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1">
                Send to recipient
                <span className="text-gray-500 cursor-help">?</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={recipient !== ''}
                  onChange={() => setRecipient(recipient ? '' : '0x')}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
            {recipient !== '' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Recipient's ETH address"
                  className="w-full bg-gray-900 rounded-lg p-3 outline-none"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAddressConfirmed}
                    onChange={(e) => setIsAddressConfirmed(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-700 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm">I confirm that the address above is correct</span>
                </label>
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            {/* Add the quotes section here */}
            {quotes && quotes.length > 0 && (
              <div className="space-y-2">
                <p className="text-gray-400">Available Routes:</p>
                {quotes.map((quote, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{quote.dexName}</span>
                    <span>{formatAmount(quote.amountOut)} {toToken?.symbol}</span>
                  </div>
                ))}
              </div>
            )}

           {/* <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Route:</span>
              <div className="flex items-center gap-2">
                <span>{fromToken?.symbol} on {fromToken?.chain}</span>
                {bestQuote?.path?.map((step: string, index: number) => (
                  <span key={index} className="text-green-500">{step}</span>
                ))}
                <span>{toToken?.symbol} on {toToken?.chain}</span>
              </div>
          </div> */}
            {isConnected && 
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Gas:</span>
                  <span>≈${gasPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Waiting time:</span>
                  <span>1 min</span>
                </div>
              </>
            }
            <button
              onClick={ 
                 !isConnected ? 
                   () => setShowConnectors(!showConnectors) 
                   : isConnected && (!chainId || !supportedChainIds.includes(chainId)) ? 
                    () => setChangeChainModal(true)
                   : allowanceAmount === 0 || (allowanceAmount < swapFromAmount ) ?
                    handleApprove
                   : handleSwap 
                  }
              disabled={pendExecute || ( fromTokenBalance < swapFromAmount ) || madeAchoice === "path not found"} 
              className={`w-full text-white rounded-lg p-3 transition-colors ${fromTokenBalance < swapFromAmount ? 'bg-gray-400' : 'bg-[#ee7244] hover:bg-[#c75d36]'}`}
              >
              { 
                !isConnected 
                 ? "Connect Wallet" 
                 : isConnected && (!chainId || !supportedChainIds.includes(watchingChain as number)) 
                 ? "Invalid chain Click to Change"
                 : ( fromTokenBalance < swapFromAmount ) ?
                  "inSufficient Swap token" 
                 : madeAchoice === "path not found" ?
                   "No valid path found"
                 : isConnected && pendApprove ?
                  "Approving token..."
                 : allowanceAmount === 0 || (allowanceAmount < swapFromAmount ) ?
                  "Approve token"
                 : isConnected && pendExecute
                 ? "Loading..." : "Swap"
                 }
            </button>
            {/* {isErrorSwap && <div>Error swapping tokens</div>}
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirmingSwap && <div>Waiting for confirmation...</div>} 
            {isConfirmedSwap && <div>Transaction confirmed.</div>}  */}
          </div>

          {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-400">
                Route priority:
                <span className="text-gray-500 cursor-help">?</span>
              </div>
              <select className="bg-transparent outline-none">
                <option>Recommended</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-400">
                Settings
                <span className="text-gray-500 cursor-help">?</span>
              </div>
              <button className="text-gray-400">⚙️</button>
            </div>
          </div> */}
        </div>

        <div className="mt-4 text-right text-xs text-gray-400">
          Powered by Pg
        </div>

        <SelectToken
          isOpenFrom={isSelectFromTokenOpen}
          isOpenTo={isSelectToTokenOpen}
          onClose={() => closeTokenModal()}
          onSelect={handleTokenSelect}
          fromTokenAddress={fromToken?.address}
          toTokenAddress={toToken?.address}
        />

        <StatusReport
          open={statusMo}
          isPending={pendExecute}
          isConfirming={isConfirmingSwap}
          isConfirmed={isConfirmedSwap}
          hash={hash}
          setStatusMo={setStatusMo}
        />

        <ChangeChain
          open={changeChainModal}
          closeState={setChangeChainModal}
        />
      </div>
    </div>
  );
};

export default Swap;