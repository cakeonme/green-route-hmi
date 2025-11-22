import React, { useState, useEffect } from 'react';
import { X, MapPin, Leaf, Clock, Navigation, ArrowLeft } from 'lucide-react';
import MapView from '../components/MapView'; // 지도 컴포넌트

export default function Settings2({ onBack, onStartNavigation }: any) {
  const [time, setTime] = useState(new Date());

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `2025.09.26(${days[5]})`;
  };

  const formatTime = (date: Date) => {
    return "12:41";
  };

  // 가상의 경로 데이터 (지도에 파란 선 그리기용)
  const mockRoutePath = [
    { lat: 37.5665, lng: 126.9780 }, // 서울시청
    { lat: 37.5700, lng: 126.9750 },
    { lat: 37.5750, lng: 126.9700 },
    { lat: 37.5796, lng: 126.9770 }  // 경복궁
  ];

  return (
    <div className="w-full h-full bg-[#18181b] text-white font-sans relative flex flex-col overflow-hidden animate-fade-in">
      
      {/* 1. 배경 지도 (화면 전체를 덮도록 설정) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <MapView 
            center={{ lat: 37.5730, lng: 126.9760 }}
            level={5}
            markers={[
                { lat: 37.5665, lng: 126.9780, label: '출발' },
                { lat: 37.5796, lng: 126.9770, label: '도착' }
            ]}
            polylines={[{ path: mockRoutePath, color: '#3b82f6' }]} 
        />
        {/* 지도 위를 덮는 어두운 오버레이 (텍스트 잘 보이게) */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      </div>

      {/* 2. 상단 헤더 (시간/날짜) */}
      <header className="absolute top-0 right-0 p-6 flex gap-6 text-zinc-300 text-sm font-medium z-20">
        <div className="flex gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md shadow-md">
            <span>날짜</span>
            <span className="text-white">{formatDate(time)}</span>
        </div>
        <div className="flex gap-2 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md shadow-md">
            <span>시간</span>
            <span className="text-white">{formatTime(time)}</span>
        </div>
      </header>

      {/* 3. 좌측 경로 정보 패널 (여기에 카드들이 있습니다!) */}
      <div className="absolute top-0 left-0 h-full w-[420px] p-6 flex flex-col z-10 bg-gradient-to-r from-black/80 to-transparent">
        
        {/* 출발/도착 정보 */}
        <div className="space-y-4 mt-12 mb-6 pl-2">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                     <div className="text-xs text-zinc-300">현 위치</div>
                </div>
                <div className="text-zinc-100 text-sm pl-4 font-medium text-shadow">서울 중구 태평로 1가</div>
            </div>
            
            <div className="h-6 w-0.5 bg-zinc-500/50 ml-3"></div> {/* 연결선 */}

            <div className="space-y-1">
                <div className="flex items-center gap-2">
                     <MapPin size={14} className="text-red-500" fill="currentColor" />
                     <div className="text-xs text-zinc-300">목적지</div>
                </div>
                <div className="text-white text-xl font-bold pl-4 leading-tight text-shadow-lg">서부 YMCA 피트니스</div>
            </div>
        </div>

        {/* ★ 경로 옵션 카드들 (클릭하면 안내 시작!) ★ */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-2 pb-20 scrollbar-hide">
            
            {/* 카드 1: 친환경 경로 (추천) */}
            <button 
                onClick={onStartNavigation} 
                className="w-full bg-[#1e1d23]/90 backdrop-blur-md border-2 border-green-500/50 rounded-2xl p-5 text-left relative group hover:bg-[#2a2930] hover:scale-[1.02] transition-all shadow-xl"
            >
                <div className="absolute -top-3 -right-2 bg-green-600 text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-md animate-bounce">
                    추천
                </div>
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
            <button 
                onClick={onStartNavigation} 
                className="w-full bg-[#1e1d23]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left hover:bg-[#2a2930] hover:scale-[1.02] transition-all shadow-lg"
            >
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
            <button 
                onClick={onStartNavigation} 
                className="w-full bg-[#1e1d23]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-left hover:bg-[#2a2930] hover:scale-[1.02] transition-all shadow-lg"
            >
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

        {/* 하단 닫기 버튼 (뒤로가기) */}
        <div className="mt-auto pt-4">
            <button 
                onClick={onBack}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 font-bold shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
                <X size={20} />
                닫기
            </button>
        </div>

      </div>

    </div>
  );
}