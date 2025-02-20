import { config } from '../../utils/configigurations';
import { switchChain } from 'wagmi/actions';

export const useChangeChain = () => {
  const changeChain = async (chainId: 146  ) => { // Default to BSC Mainnet
    try {
      await switchChain(config, { chainId })
    } catch (error) {
      console.error("Error changing chain", error)
    }
  }

  return changeChain
}