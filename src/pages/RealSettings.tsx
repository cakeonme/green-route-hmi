import React, { useState, useEffect } from 'react';
import { Car, Navigation, Volume2, Link, Monitor, Settings } from 'lucide-react';

export default function RealSettings() {
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

  // 시간 포맷 (HH:MM)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false // 24시간제 (오후 1시 -> 13:00)
    });
  };
  const MENU_ITEMS = [
    { id: 1, label: '차량', icon: Car },
    { id: 2, label: '네비게이션', icon: Navigation },
    { id: 3, label: '사운드', icon: Volume2 },
    { id: 4, label: '기기연결', icon: Link },
    { id: 5, label: '화면구성', icon: Monitor },
    { id: 6, label: '일반', icon: Settings },
  ];

  return (
    <div className="w-full h-full bg-[#18181b] text-white font-sans flex flex-col overflow-hidden animate-fade-in">
      
      {/* 1. 상단 헤더 */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-white font-bold text-lg">Green Route</span>
        </div>
        
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

      {/* 2. 메인 설정 그리드 */}
      <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
        <div className="grid grid-cols-3 gap-6 max-w-4xl w-full">
            {MENU_ITEMS.map((item) => (
                <button 
                    key={item.id}
                    className="aspect-[3/2] bg-[#2c2c35] rounded-[32px] flex flex-col items-center justify-center gap-4 hover:bg-[#3f3f46] transition-all hover:scale-105 active:scale-95 group shadow-lg"
                >
                    {/* 아이콘 원형 배경 없이 바로 아이콘 크게 */}
                    <item.icon size={64} className="text-white mb-2" strokeWidth={2.5} />
                    <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
      </main>

    </div>
  );
}