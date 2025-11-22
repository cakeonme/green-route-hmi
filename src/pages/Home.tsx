import React, { useState } from "react";
import HomeHud from "../components/HomeHud"; // 껍데기 디자인
import { Navigation } from "lucide-react"; // 아이콘

export default function Home() {
  // Home 화면은 로직 없이 '상태 표시'만 합니다.
  const [speed] = useState(72); // 고정 속도 (예시)
  const [gear] = useState('D'); // 고정 기어 (예시)

  return (
    <div className="w-full h-full bg-black">
      {/* HomeHud: 우리가 만든 아반떼 대시보드 틀 */}
      <HomeHud speed={speed}>
        
        {/* 지도 영역에 들어갈 내용 (Home에서는 그냥 배경 이미지처럼 처리) */}
        <div className="w-full h-full relative bg-[#2e2e33] flex items-center justify-center overflow-hidden">
            
            {/* 1. 지도 배경 패턴 (이미지 대신 CSS로 가볍게 표현) */}
            <div className="absolute inset-0 opacity-30" 
                 style={{
                     backgroundImage: 'radial-gradient(#6b7280 1px, transparent 1px)', 
                     backgroundSize: '24px 24px'
                 }}>
            </div>
            
            {/* 2. 도로 느낌의 장식 선 */}
            <div className="absolute top-0 left-1/2 w-32 h-full bg-white/5 skew-x-12 blur-xl"></div>

            {/* 3. '목적지 없음' 텍스트 & 아이콘 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
                <h2 className="text-4xl font-bold text-white drop-shadow-md tracking-tight">목적지 없음</h2>
                <div className="flex items-center gap-2 text-zinc-400 text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    <Navigation size={14} className="fill-current" />
                    <span>내비게이션을 실행하려면 Main으로 이동하세요</span>
                </div>
            </div>

        </div>

      </HomeHud>
    </div>
  );
}