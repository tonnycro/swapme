import { useState } from 'react'
import { SupportedChains } from '../../utils/Constants';
import { IChain } from '../../utils/typesInterface';
import CustomDropdown from '../hooks/CustomDropdown';

export default function SupportedAndSelectedChain() {

    const [_, setSelectedChain] = useState<IChain | null>(
        SupportedChains.find((chain) => chain.active) || null 
    );

  return (
        <div className="w-20 md:w-36 mx-auto ">
            <CustomDropdown
                options={SupportedChains}
                setSelectedValueSimple={setSelectedChain}
                useResponsive={true}
            />

            {/* {selectedChain && (
                <div className="mt-5 p-4 bg-gray-800 rounded-lg flex items-center space-x-4">
                <img
                    src={selectedChain.img}
                    alt={`${selectedChain.name} logo`}
                    className="w-10 h-10 rounded-full object-contain"
                />
                <div>
                    <p className="text-white text-lg font-semibold">{selectedChain.name}</p>
                    <p className="text-gray-400 text-sm">Chain ID: {selectedChain.id}</p>
                </div>
                </div>
            )} */}
        </div>
  )
}
