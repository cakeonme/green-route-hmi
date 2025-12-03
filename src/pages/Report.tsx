import React, { useState, useEffect } from 'react';
import WeeklyChart from '../components/WeeklyChart'; // 차트 컴포넌트

export default function Report() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `2025.09.26(${days[5]})`; // 디자인 날짜 고정
  };

  const formatTime = (date: Date) => {
    return "12:41";
  };

  return (
    <div className="w-full h-full bg-[#f8fafc] flex flex-col font-sans overflow-hidden">
      
      {/* 1. 상단 검은색 헤더 */}
      <header className="bg-[#18181b] h-20 shrink-0 flex items-center justify-between px-8 shadow-md">
        <h1 className="text-2xl font-bold text-zinc-400">Report</h1>
        
        <div className="flex gap-6 text-zinc-400 text-sm font-medium">
            <div className="flex gap-2">
                <span>날짜</span>
                <span className="text-white">{formatDate(time)}</span>
            </div>
            <div className="flex gap-2">
                <span>시간</span>
                <span className="text-white">{formatTime(time)}</span>
            </div>
        </div>
      </header>

      {/* 2. 메인 컨텐츠 (차트 영역) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full flex flex-col justify-center">
            {/* 차트 컴포넌트 배치 */}
            <WeeklyChart />
        </div>
      </main>

    </div>
  );
}