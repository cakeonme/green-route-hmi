import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, X, Home, Settings, FileText } from 'lucide-react';
import navigationMap from '../assets/navigation-map.jpg';

export default function Main() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden flex flex-col animate-fade-in">
      
      {/* 1. 배경 이미지 (지도 대신 사용) */}
      <div className="absolute inset-0 z-0">
        <img 
            src={navigationMap} 
            alt="Navigation Map" 
            className="w-full h-full object-cover" // 이미지가 화면을 꽉 채우도록 설정
        />
        {/* 지도 위 그라데이션 (UI 잘 보이게) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
      </div>

      {/* 2. 주행 정보 오버레이 (HUD) */}
      
      {/* [좌측 상단] 속도 표지판 */}
      <div className="absolute top-6 left-6 flex flex-col items-center z-20 pointer-events-none">
        <div className="w-20 h-20 bg-white rounded-full border-[6px] border-[#ff3045] flex items-center justify-center shadow-lg z-20 relative">
            <span className="text-4xl font-extrabold text-black tracking-tighter">80</span>
        </div>
        <div className="bg-[#1e1d23] w-16 pt-8 pb-3 rounded-b-2xl -mt-6 flex justify-center items-end shadow-lg border border-zinc-700">
            <span className="text-2xl font-bold text-white">45</span>
        </div>
      </div>

      {/* [중앙 상단] 시계 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-[#1e1d23]/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 shadow-xl">
            <span className="text-3xl font-bold text-white tracking-widest font-mono">
                {formatTime(time)}
            </span>
        </div>
      </div>

      {/* [우측 상단] 길안내 TBT */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none">
        <div className="bg-[#006df3] w-[280px] rounded-[24px] p-5 shadow-2xl flex items-center gap-5 relative overflow-hidden">
            <div className="relative z-10">
                <ArrowLeft size={48} className="text-white stroke-[3px]" />
            </div>
            <div className="relative z-10">
                <div className="text-4xl font-extrabold text-white mb-1">
                    340<span className="text-xl font-medium ml-1">m</span>
                </div>
                <div className="text-lg text-blue-100 font-medium">
                    삼일대로
                </div>
            </div>
            <div className="absolute -right-4 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* [화면 중앙] 내 자동차 (지도 위에 고정) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none drop-shadow-2xl">
         <div className="w-14 h-28 bg-white rounded-[16px] relative shadow-xl border-2 border-zinc-200">
            <div className="absolute top-5 left-1 right-1 h-5 bg-zinc-800 rounded-sm opacity-90"></div> 
            <div className="absolute bottom-3 left-1 right-1 h-4 bg-zinc-800 rounded-sm opacity-90"></div> 
            <div className="absolute top-12 left-1 right-1 h-8 bg-zinc-200 rounded-sm opacity-50"></div> 
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-24 h-40 bg-white/20 blur-2xl rounded-full"></div>
         </div>
      </div>

<div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-end px-10 pb-4 z-30 pointer-events-auto">
  <button 
    onClick={() => window.location.reload()} 
    className="bg-[#1e1d23]/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white px-6 py-3 rounded-full font-medium text-sm backdrop-blur-md flex items-center gap-2 transition-all"
  >
    <X size={16} />
    안내 중지
  </button>
</div>


    </div>
  );
}