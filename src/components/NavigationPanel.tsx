import React from 'react';
import { ArrowUpRight, Leaf } from 'lucide-react';

export default function NavigationPanel() {
  return (
    <div className="w-[320px] flex flex-col gap-4 select-none animate-slide-in-left">
      
      {/* 1. 제한 속도 & 날짜 정보 */}
      <div className="flex justify-between items-start">
        {/* 제한 속도 표지판 */}
        <div className="w-16 h-16 bg-white rounded-full border-[5px] border-red-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-black tracking-tighter">80</span>
        </div>
        
        {/* 날짜/시간 (작게 표시) */}
        <div className="text-right bg-black/40 px-3 py-1 rounded-lg backdrop-blur-sm">
             <div className="text-zinc-400 text-xs font-medium">2025.09.26(금)</div>
             <div className="text-white text-xl font-bold font-mono">12:41</div>
        </div>
      </div>

      {/* 2. 핵심 주행 안내 카드 (검은색 배경) */}
      <div className="bg-[#1e1d23]/90 backdrop-blur-md border border-white/10 rounded-[30px] p-6 shadow-2xl relative overflow-hidden">
         
         {/* 진행 방향 화살표 (크게) */}
         <div className="mb-4 flex items-center gap-4">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <ArrowUpRight size={40} className="text-white" strokeWidth={3} />
             </div>
             <div>
                <div className="text-4xl font-bold text-white tracking-tight">
                    340<span className="text-2xl font-normal text-zinc-400 ml-1">m</span>
                </div>
             </div>
         </div>

         {/* 도로명 */}
         <div className="mb-6">
            <div className="text-2xl font-bold text-white leading-tight">삼일대로</div>
            <div className="text-zinc-400 text-sm mt-1">잠시 후 우회전</div>
         </div>

         {/* 구분선 */}
         <div className="w-full h-px bg-white/10 mb-4"></div>

         {/* 3. 하단 도착 정보 (친환경) */}
         <div className="flex justify-between items-end">
            <div>
                <div className="flex items-center gap-1 text-green-400 text-xs font-bold mb-1">
                    <Leaf size={12} fill="currentColor" />
                    친환경 경로
                </div>
                <div className="text-white font-bold text-xl">
                    12:55 <span className="text-sm font-normal text-zinc-400">도착</span>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-zinc-500">CO₂ 절감</div>
                <div className="text-sm font-bold text-green-400">0.8kg ▼</div>
            </div>
         </div>

         {/* 배경 장식 (은은한 빛) */}
         <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
      </div>

    </div>
  );
}