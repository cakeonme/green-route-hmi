import React, { useState, useEffect } from 'react';
import { X, MapPin, Leaf, Clock, Navigation } from 'lucide-react';
import MapView from '../components/MapView';

export default function Settings2({ onBack, onStartNavigation }: any) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayName = days[date.getDay()];
    return `${year}.${month}.${day}(${dayName})`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // ★ 수정된 좌표 데이터 (광화문 교보문고 -> 서부 YMCA) ★
  
  // 1. 출발지: 교보문고 광화문점
  const START_POS = { lat: 37.5704, lng: 126.9768 };
  
  // 2. 도착지: 서부 YMCA (상암동)
  const END_POS = { lat: 37.5760, lng: 126.9015 }; 

  // 3. 지도 중심 (두 지점의 중간쯤)
  const MAP_CENTER = { lat: 37.5732, lng: 126.9390 };

  // 4. 가상 경로 데이터 (파란 선)
  // 실제로는 API로 받아오지만, 시연용으로 대략적인 경로 좌표를 찍었습니다.
  const mockRoutePath = [
    START_POS,                      // 교보문고
    { lat: 37.5700, lng: 126.9600 }, // 서대문역 인근
    { lat: 37.5600, lng: 126.9400 }, // 연대 앞
    { lat: 37.5650, lng: 126.9100 }, // 망원동 인근
    END_POS                         // 서부 YMCA
  ];

  return (
    <div className="w-full h-full relative bg-[#18181b] text-white font-sans flex flex-col overflow-hidden animate-fade-in">
      
      {/* 1. 배경 지도 */}
      <div className="absolute inset-0 z-0">
        <MapView 
            center={MAP_CENTER} // 지도의 중심
            level={7} // 두 지점이 다 보이도록 줌 레벨 조정 (숫자가 클수록 멀리 보임)
            markers={[
                { ...START_POS, label: '출발' },
                { ...END_POS, label: '도착' }
            ]}
            polylines={[{ path: mockRoutePath, color: '#3b82f6' }]} 
        />
        {/* 오버레이 (텍스트 가독성용) */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      </div>

      {/* 2. 상단 헤더 */}
      <header className="absolute top-0 right-0 p-6 flex gap-6 text-zinc-300 text-sm font-medium z-20 pointer-events-none">
        <div className="flex gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md shadow-md">
            <span>날짜</span>
            <span className="text-white">{formatDate(time)}</span>
        </div>
        <div className="flex gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md shadow-md">
            <span>시간</span>
            <span className="text-white">{formatTime(time)}</span>
        </div>
      </header>

      {/* 3. 좌측 패널 */}
      <div className="absolute top-0 left-0 h-full w-[420px] p-6 flex flex-col z-10 bg-gradient-to-r from-black/80 to-transparent pointer-events-auto">
        
        {/* 출발/도착 정보 (텍스트 수정됨) */}
        <div className="space-y-4 mt-12 mb-6 pl-2">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                     <div className="text-xs text-zinc-300">현 위치</div>
                </div>
                <div className="text-zinc-100 text-sm pl-4 font-medium text-shadow">교보문고 광화문점</div>
            </div>
            
            <div className="h-6 w-0.5 bg-zinc-500/50 ml-3"></div>

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                     <MapPin size={14} className="text-red-500" fill="currentColor" />
                     <div className="text-xs text-zinc-300">목적지</div>
                </div>
                <div className="text-white text-xl font-bold pl-4 leading-tight text-shadow-lg">서부 YMCA 피트니스</div>
            </div>
        </div>

        {/* 경로 옵션 카드들 */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-20 scrollbar-hide">
            
            {/* 카드 1: 친환경 경로 */}
            <button onClick={onStartNavigation} className="w-full bg-[#1e1d23]/90 backdrop-blur-md border-2 border-green-500/50 rounded-2xl p-5 text-left relative group hover:bg-[#2a2930] hover:scale-[1.02] transition-all shadow-xl">
                <div className="absolute -top-3 -right-2 bg-green-600 text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-md animate-bounce">추천</div>
                <div className="flex items-center gap-2 mb-3">
                    <Leaf size={18} className="text-green-400" fill="currentColor" />
                    <span className="font-bold text-green-400 text-lg">친환경 경로</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-3xl font-bold text-white tracking-tight">28<span className="text-sm font-normal text-zinc-400 ml-1">분</span></div>
                        <div className="text-xs text-zinc-400 mt-1">14.2km · 통행료 무료</div>
                    </div>
                    <div className="text-right bg-green-900/30 px-3 py-1 rounded-lg border border-green-500/20">
                         <div className="text-[10px] text-zinc-400">CO₂ 절감</div>
                         <div className="text-sm font-bold text-green-400">0.8kg ▼</div>
                    </div>
                </div>
            </button>

            {/* 카드 2: 일반 경로 */}
            <button onClick={onStartNavigation} className="w-full bg-[#1e1d23]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left hover:bg-[#2a2930] hover:scale-[1.02] transition-all shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Navigation size={18} className="text-zinc-400" />
                    <span className="font-bold text-zinc-300 text-lg">일반 경로</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-3xl font-bold text-zinc-300 tracking-tight">32<span className="text-sm font-normal text-zinc-500 ml-1">분</span></div>
                        <div className="text-xs text-zinc-500 mt-1">15.5km · 통행료 2,000원</div>
                    </div>
                    <div className="text-right px-3 py-1">
                         <div className="text-[10px] text-zinc-600">CO₂ 배출</div>
                         <div className="text-sm font-bold text-zinc-500">2.1kg</div>
                    </div>
                </div>
            </button>

            {/* 카드 3: 최단 시간 */}
            <button onClick={onStartNavigation} className="w-full bg-[#1e1d23]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left hover:bg-[#2a2930] hover:scale-[1.02] transition-all shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Clock size={18} className="text-zinc-400" />
                    <span className="font-bold text-zinc-300 text-lg">최단 시간</span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-3xl font-bold text-zinc-300 tracking-tight">26<span className="text-sm font-normal text-zinc-500 ml-1">분</span></div>
                        <div className="text-xs text-zinc-500 mt-1">16.1km · 통행료 2,000원</div>
                    </div>
                </div>
            </button>
        </div>

        {/* 하단 닫기 버튼 */}
        <div className="mt-auto pt-4">
            <button onClick={onBack} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 font-bold shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
                <X size={20} />
                닫기
            </button>
        </div>
      </div>
    </div>
  );
}