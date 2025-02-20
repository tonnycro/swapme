import { useChangeChain } from "../hooks/useChangeChain";

const ChangeChain = ({ 
    open,
    closeState, 
  }: any) => {
      const changeChain = useChangeChain();
  
  
    
      const onClose = () => {
        closeState(false);
      }


      const pickChain = (chainId: 146) => {
        changeChain(chainId);
        closeState(false);
      }

      const supportedChains = [
        {
            name: 'Bsc',
            id: 56,
            logo: '/bnb-logo.svg'
        },
        {
            name: 'BscTestnet',
            id: 97,
            logo: '/bnb-logo.svg'
        },
        {
            name: 'Sonic',
            id: 146,
            logo: '/sonic-logo.svg'
        },
        {
            name: 'SonicTestnet',
            id: 57054,
            logo: '/sonic-logo.svg'
        },
      ]
    
      if (!open) return null;
    
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex items-center justify-center h-screen bg-transparent w-full">

            <div className="bg-gray-900 rounded-lg p-8 h-[350px] w-full max-w-md">
                <div className="mb-4 flex justify-between items-center">
                   <h2 className="">We currently only support</h2>

                   <button
                        onClick={() => onClose()}
                        className="right-3 top-3.5 text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    {
                        supportedChains.map((data, index) => (
                        <div onClick={() => pickChain(data.id as 146)} className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-900 border border-transparent hover:border-gray-700 rounded-lg transition-colors cursor-pointer" key={index}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white">
                                <img src={data.logo} alt="chain logo" />
                            </div>
                            <div className="flex flex-col items-start">
                            <span className="text-white font-medium">{data.name}</span>
                            </div>
                        </div>
                        ))
                    }
                </div>

            </div>
          </div>
        </div>
      );
    };
  
  export default ChangeChain;