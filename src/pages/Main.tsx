import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, X } from 'lucide-react'; // 아이콘
import MapView from '../components/MapView'; // 지도

export default function Main() {
  const [time, setTime] = useState(new Date());

  // 시간 업데이트 (초 단위)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 가상 경로 데이터 (지도에 그릴 파란 선)
  const mockRoutePath = [
    { lat: 37.5665, lng: 126.9780 }, // 시청
    { lat: 37.5700, lng: 126.9750 }, // 광화문 인근
    { lat: 37.5750, lng: 126.9700 },
    { lat: 37.5796, lng: 126.9770 }  // 경복궁
  ];

  // 현재 시간 포맷 (예: 12:41 PM)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="w-full h-full bg-[#18181b] text-white font-sans relative flex flex-col overflow-hidden animate-fade-in">
      
      {/* 1. 배경 지도 (내비게이션 모드) */}
      <div className="absolute inset-0 z-0">
        <MapView 
            center={{ lat: 37.5700, lng: 126.9750 }} // 자동차 위치 (중심)
            level={3} // 확대 레벨 (주행 중엔 가깝게)
            markers={[]} // 주행 중엔 마커 대신 자동차 아이콘 사용
            polylines={[{ path: mockRoutePath, color: '#3b82f6' }]} 
        />
      </div>

      {/* ★ 2. 주행 모드 오버레이 UI (HUD 스타일) ★ */}
      
      {/* [좌측 상단] 속도 제한 표지판 */}
      <div className="absolute top-6 left-6 flex flex-col items-center z-10 animate-slide-in-left">
        {/* 빨간 테두리 제한 속도 */}
        <div className="w-20 h-20 bg-white rounded-full border-[6px] border-[#ff3045] flex items-center justify-center shadow-lg z-20 relative">
            <span className="text-4xl font-extrabold text-black tracking-tighter">80</span>
        </div>
        {/* 현재 속도 (검은 박스) */}
        <div className="bg-[#1e1d23] w-16 pt-8 pb-3 rounded-b-2xl -mt-6 flex justify-center items-end shadow-lg border border-zinc-700">
            <span className="text-2xl font-bold text-white">45</span>
        </div>
      </div>

      {/* [중앙 상단] 시계 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-[#1e1d23]/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 shadow-xl">
            <span className="text-3xl font-bold text-white tracking-widest">
                {formatTime(time)}
            </span>
        </div>
      </div>

      {/* [우측 상단] 길안내 (TBT) */}
      <div className="absolute top-6 right-6 z-10 animate-slide-in-right">
        <div className="bg-[#006df3] w-[280px] rounded-[24px] p-5 shadow-2xl flex items-center gap-5 relative overflow-hidden">
            {/* 화살표 아이콘 */}
            <div className="relative z-10">
                <ArrowLeft size={48} className="text-white stroke-[3px]" />
            </div>
            {/* 안내 텍스트 */}
            <div className="relative z-10">
                <div className="text-4xl font-extrabold text-white mb-1">
                    340<span className="text-xl font-medium ml-1">m</span>
                </div>
                <div className="text-lg text-blue-100 font-medium">
                    삼일대로
                </div>
            </div>
            {/* 배경 장식 (물결) */}
            <div className="absolute -right-4 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* [화면 중앙] 내 자동차 아이콘 (지도 위에 고정) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none drop-shadow-2xl">
         {/* 자동차 그림 (SVG) */}
         <div className="w-16 h-32 bg-white rounded-[20px] relative shadow-xl border-2 border-zinc-200">
            {/* 앞유리 */}
            <div className="absolute top-6 left-1 right-1 h-6 bg-zinc-800 rounded-sm opacity-90"></div>
            {/* 뒷유리 */}
            <div className="absolute bottom-4 left-1 right-1 h-5 bg-zinc-800 rounded-sm opacity-90"></div>
            {/* 지붕 */}
            <div className="absolute top-14 left-1 right-1 h-10 bg-zinc-100 rounded-sm opacity-50"></div>
            {/* 헤드라이트 효과 (빛) */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-40 bg-white/10 blur-2xl rounded-full"></div>
         </div>
      </div>

      {/* [우측 하단] 안내 중지 버튼 */}
      <div className="absolute bottom-8 right-6 z-20">
        <button 
            onClick={() => window.location.reload()} // 임시: 새로고침 (Home으로 복귀)
            className="bg-[#1e1d23]/90 hover:bg-red-900/90 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 transition-all backdrop-blur-md"
        >
            <X size={18} />
            안내 중지
        </button>
      </div>

    </div>
  );
}