import Swap from '../component/swap/Swap'

export default function Home() {
  return (
    <div className="flex flex-col  justify-center items-center w-full z-50">
    {/* Left Section with Swap */}
    <div className="w-full md:w-[550px] md:flex-shrink-0 p-4">
      <Swap />
    </div>

    {/* Right section with charts */}
    {/* <div className="flex-grow p-4 justify-center items-center h-full md:h-screen">
      <Stats />
    </div> */}
  </div>
  )
}

[/**     <div className="flex flex-col md:flex-row w-full min-h-screen"> */]