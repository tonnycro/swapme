
const StatusReport = ({ 
  open,
  isPending, 
  isConfirming, 
  isConfirmed,
  isError,
  hash,
  setStatusMo
}: any) => {
  


    if(isError) {
        console.log(isError, "checking the error");
    }
    
  
    const onClose = () => {
        setStatusMo(false);
    }
  
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex items-center justify-center h-screen bg-transparent w-full">
          <div className="bg-gray-900 rounded-lg p-8 h-[350px] w-full max-w-md">
            {
                isConfirming || isPending ?
                (
                 <div className="flex flex-col items-center gap-10">
                    <div className="loader"></div>
                    <div className="">Processing Transaction...</div>
                 </div>   
                )
                : isConfirmed ?
                (
                  <>
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-green-500 rounded-full p-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white text-center mb-4">Trade has been completed!</h1>
                        <p className="text-gray-400 text-center mb-8 text-sm">
                            Your Trade was successful.
                        </p>
                        <button onClick={onClose} className="bg-[#ee7244] hover:bg-[#c75d36] text-white font-medium py-3 px-6 rounded-lg w-full">
                           Back to home
                        </button>
                        <div className="text-gray-400 text-center mt-4">
                        <a href={`https://sonicscan.org/tx/${hash}`}   target="_blank"  className="underline">View in Explorer</a>
                    </div>
                  </>  
                ) 
                : 
                (
                <div className="flex flex-col items-center gap-5">
                        <div className="text-red-400">Something went wrong</div>
                         <button onClick={onClose} className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg w-full">
                           Back to home
                        </button>
                </div>

                )
            }
          </div>
        </div>
      </div>
    );
  };

export default StatusReport;