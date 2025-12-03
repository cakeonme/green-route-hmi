import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, ArrowLeft } from 'lucide-react';

export default function Settings() {
  const [time, setTime] = useState(new Date());
  const [searchText, setSearchText] = useState("서부 YMCA 피트니스"); // 디자인 예시 텍스트

  // 시간 업데이트 (헤더용)
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

  return (
    <div className="w-full h-full bg-[#18181b] text-white p-6 md:p-10 flex flex-col font-sans relative animate-fade-in">
      
      {/* 1. 상단 헤더 (날짜/시간) */}
      <header className="flex justify-end items-center gap-6 mb-12 text-zinc-400 text-sm font-medium">
        <div className="flex gap-2">
            <span>날짜</span>
            <span className="text-zinc-200">{formatDate(time)}</span>
        </div>
        <div className="flex gap-2">
            <span>시간</span>
            <span className="text-zinc-200">{formatTime(time)}</span>
        </div>
      </header>

      {/* 2. 검색 영역 */}
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* 검색창 */}
        <div className="relative flex items-center">
          <div className="absolute left-4 bg-[#3f3f46] p-2 rounded-full text-zinc-400">
             <MapPin size={20} fill="currentColor" className="text-white" />
          </div>
          <input 
            type="text" 
            className="w-full bg-[#27272a] text-white text-xl font-bold rounded-full py-4 pl-16 pr-6 border border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-600"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* 검색 결과 리스트 (디자인에 있는 파란색 바) */}
        <div className="bg-[#232e48] rounded-lg p-4 flex items-center justify-between border-l-4 border-blue-500 shadow-lg cursor-pointer hover:bg-[#2a3755] transition-colors">
            <div className="flex items-center gap-6">
                <h3 className="text-xl font-bold text-white tracking-wide">
                    서부 YMCA 피트니스
                </h3>
                <span className="text-zinc-400 text-lg font-light">
                    서울특별시 마포구 상암동 442-4
                </span>
            </div>
        </div>
        
      </div>

      {/* 3. 하단 '경로 탐색' 버튼 (Floating Button) */}
      <div className="absolute bottom-8 right-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-3 flex items-center gap-2 shadow-[0_4px_14px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95">
            <Navigation size={20} fill="currentColor" />
            <span className="text-lg font-bold">경로 탐색</span>
        </button>
      </div>

    </div>
  );
}