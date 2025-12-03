import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, X, Home, Settings, FileText } from 'lucide-react';
import MapView from '../components/MapView';

type LatLng = { lat: number; lng: number };

export default function Main() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 내 차량 실제 위치(데모용)
  const CAR_POSITION: LatLng = { lat: 37.5700, lng: 126.9750 };

  // 카메라 중심: 차보다 약간 "앞쪽"을 보여주기 위해 위로 오프셋
  const CAMERA_OFFSET_LAT = 0.001; // 값 키우면 더 멀리 앞쪽 도로가 보임
  const MAP_CENTER: LatLng = {
    lat: CAR_POSITION.lat + CAMERA_OFFSET_LAT,
    lng: CAR_POSITION.lng,
  };

  // 데모용 경로(나중에 Directions API 결과로 교체 가능)
  const DEMO_ROUTE_PATH: LatLng[] = [
    { lat: 37.5685, lng: 126.9735 },
    { lat: 37.5692, lng: 126.9742 },
    { lat: 37.5700, lng: 126.9750 }, // 차 위치
    { lat: 37.5710, lng: 126.9760 },
    { lat: 37.5720, lng: 126.9770 },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden flex flex-col animate-fade-in">
      {/* 1. 배경 지도 */}
      <div className="absolute inset-0 z-0">
        <MapView
          center={MAP_CENTER}
          level={2} // ✅ 2 정도가 네비 느낌 나는 확대
          markers={[]}
          polylines={[{ path: DEMO_ROUTE_PATH, color: '#3b82f6' }]}
        />
        {/* 지도 위 그라데이션 (UI 잘 보이게) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
      </div>

      {/* 2. HUD 오버레이 */}

      {/* [좌측 상단] 속도 표지판 */}
      <div className="absolute top-6 left-6 flex flex-col items-center z-20 pointer-events-none">
        <div className="w-20 h-20 bg-white rounded-full border-[6px] border-[#ff3045] flex items-center justify-center shadow-lg relative">
          <span className="text-4xl font-extrabold text-black tracking-tighter">80</span>
        </div>
        <div className="bg-[#1e1d23] w-16 pt-8 pb-3 rounded-b-2xl -mt-6 flex justify-center items-end shadow-lg border border-zinc-700">
          <span className="text-2xl font-bold text-white">45</span>
        </div>
      </div>

      {/* [중앙 상단] 시계 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-[#1e1d23]/80 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/10 shadow-xl">
          <span className="text-3xl font-bold text-white tracking-widest">
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
            <div className="text-lg text-blue-100 font-medium">삼일대로</div>
          </div>
          <div className="absolute -right-4 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>

      {/* [화면 하단쪽] 내 자동차 (화면 기준 65% 지점에 고정) */}
      <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none drop-shadow-2xl">
        <div className="w-16 h-32 bg-white rounded-[20px] relative shadow-xl border-2 border-zinc-200">
          <div className="absolute top-6 left-1 right-1 h-6 bg-zinc-800 rounded-sm opacity-90" />
          <div className="absolute bottom-4 left-1 right-1 h-5 bg-zinc-800 rounded-sm opacity-90" />
          <div className="absolute top-14 left-1 right-1 h-10 bg-zinc-100 rounded-sm opacity-50" />
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-40 bg-white/10 blur-2xl rounded-full" />
        </div>
      </div>

      {/* [하단] 컨트롤 바 */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between px-10 pb-4 z-30 pointer-events-auto">
        <div className="flex items-center gap-8">
          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition">
            <Home size={24} />
            <span className="text-[10px]">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition">
            <Settings size={24} />
            <span className="text-[10px]">Settings</span>
          </button>

          {/* 파란색 강조 버튼 (현재 내비게이션 중) */}
          <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform -translate-y-2">
            <Navigation size={28} fill="currentColor" />
          </button>

          <button className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white transition">
            <FileText size={24} />
            <span className="text-[10px]">Report</span>
          </button>
        </div>

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
