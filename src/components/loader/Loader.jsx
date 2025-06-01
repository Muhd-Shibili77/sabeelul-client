import React from 'react';

const Loader = ({ color = 'bg-[rgba(53,130,140,1.4)]' }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-[45px] h-[45px] animate-spin-custom">
        <div className="loader-arm left-arm">
          <div className={`loader-ball animate-wobble1 ${color}`}></div>
        </div>
        <div className="loader-arm right-arm">
          <div className={`loader-ball animate-wobble1 delay-[-150ms] ${color}`}></div>
        </div>
        <div className="loader-arm bottom-arm">
          <div className={`loader-ball animate-wobble2 ${color}`}></div>
        </div>
      </div>

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

        .loader-arm {
          position: absolute;
          width: 30%;
          height: 100%;
        }

        .left-arm {
          bottom: 5%;
          left: 0;
          transform-origin: 50% 85%;
          transform: rotate(60deg);
        }

        .right-arm {
          bottom: 5%;
          right: 0;
          transform-origin: 50% 85%;
          transform: rotate(-60deg);
        }

        .bottom-arm {
          bottom: -5%;
          left: 0;
          transform: translateX(116.666%);
        }

        .loader-ball {
          position: absolute;
          width: 100%;
          padding-bottom: 100%;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default Loader;
