import React from 'react'

const Loader = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="relative w-[45px] h-[45px] animate-spin-custom">
          <div className="absolute w-[30%] h-full bottom-[5%] left-0 origin-[50%_85%] rotate-[60deg]">
            <div className="absolute w-full pb-full bg-[rgba(53,130,140,1.4)] rounded-full animate-wobble1"></div>
          </div>
          <div className="absolute w-[30%] h-full bottom-[5%] right-0 origin-[50%_85%] rotate-[-60deg]">
            <div className="absolute w-full pb-full bg-[rgba(53,130,140,1.4)] rounded-full animate-wobble1 delay-[-150ms]"></div>
          </div>
          <div className="absolute w-[30%] h-full bottom-[-5%] left-0 translate-x-[116.666%]">
            <div className="absolute w-full pb-full bg-[rgba(53,130,140,1.4)] rounded-full animate-wobble2"></div>
          </div>
        </div>
  
        {/* Custom keyframes using a style tag */}
        <style>{`
          @keyframes spin-custom {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
  
          @keyframes wobble1 {
            0%, 100% {
              transform: translateY(0%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translateY(-66%) scale(0.65);
              opacity: 0.8;
            }
          }
  
          @keyframes wobble2 {
            0%, 100% {
              transform: translateY(0%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translateY(66%) scale(0.65);
              opacity: 0.8;
            }
          }
  
          .animate-spin-custom {
            animation: spin-custom 2s linear infinite;
          }
  
          .animate-wobble1 {
            animation: wobble1 0.8s ease-in-out infinite;
          }
  
          .animate-wobble2 {
            animation: wobble2 0.8s ease-in-out infinite;
          }
  
          .pb-full {
            padding-bottom: 100%;
          }
        `}</style>
      </div>
    );
  };
  

export default Loader