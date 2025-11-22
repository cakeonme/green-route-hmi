import React, { useState, useEffect, ReactNode } from 'react';
import { CloudRain, MapPin, Home, ChevronLeft, BarChart2, Settings, Navigation } from 'lucide-react';

// Props 타입 정의: 외부에서 지도(children)와 속도(speed)를 받습니다.
interface HomeHudProps {
  children?: ReactNode; 
  speed?: number;
}

export default function HomeHud({ children, speed = 72 }: HomeHudProps) {
  const [time, setTime] = useState(new Date());
  const [gear, setGear] = useState('D');
  const [activeTab, setActiveTab] = useState('home');

  // 시간 업데이트 (1초마다)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 날짜 포맷
  const formatDate = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayName = days[date.getDay()];
    return `${year}.${month}.${day}(${dayName})`;
  };

  // 시간 포맷
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    // 전체 배경
    <div className="w-full h-full bg-[#18181b] text-white flex flex-col p-4 md:p-6 font-sans select-none overflow-hidden relative">
      
      {/* 1. 헤더 (날짜/시간) */}
      <header className="flex justify-end items-center gap-6 py-2 px-2 text-zinc-300 font-medium text-lg shrink-0">
          <div className="flex gap-3">
              <span className="text-zinc-400">날짜</span>
              <span>{formatDate(time)}</span>
          </div>
          <div className="flex gap-3">
              <span className="text-zinc-400">시간</span>
              <span>{formatTime(time)}</span>
          </div>
      </header>

      {/* 2. 메인 그리드 영역 */}
      <main className="flex-1 grid grid-cols-12 gap-6 px-2 pb-4 min-h-0">
          
          {/* [좌측 카드] 차량 이미지 + 기어 셀렉터 */}
          <section className="col-span-4 bg-[#27272a] rounded-[40px] p-6 flex flex-col items-center justify-between shadow-lg relative overflow-hidden">
              <div className="w-full text-center mt-2">
                  <h2 className="text-2xl font-bold tracking-wide text-white">AVANTE Hybrid</h2>
              </div>

              {/* 차량 Top View SVG */}
              <div className="flex-1 w-full flex items-center justify-center py-2">
                  <svg viewBox="0 0 200 400" className="h-full max-h-[300px] drop-shadow-2xl">
                      <path d="M30,60 C30,20 170,20 170,60 L170,340 C170,380 30,380 30,340 Z" fill="#f4f4f5" />
                      <path d="M40,90 L160,90 L150,140 L50,140 Z" fill="#27272a" />
                      <path d="M45,310 L155,310 L150,270 L50,270 Z" fill="#27272a" />
                      <rect x="50" y="145" width="100" height="120" fill="#fff" rx="5" />
                      <rect x="10" y="100" width="20" height="15" rx="5" fill="#f4f4f5" />
                      <rect x="170" y="100" width="20" height="15" rx="5" fill="#f4f4f5" />
                      <path d="M35,360 Q50,375 65,360" stroke="#ef4444" strokeWidth="4" fill="none" />
                      <path d="M135,360 Q150,375 165,360" stroke="#ef4444" strokeWidth="4" fill="none" />
                  </svg>
              </div>

              {/* 기어 셀렉터 */}
              <div className="bg-[#18181b] rounded-full p-2 flex gap-2 w-full max-w-[260px] justify-between shadow-inner shrink-0">
                  {['N', 'D', 'R', 'P'].map((g) => (
                      <button
                          key={g}
                          onClick={() => setGear(g)}
                          className={`w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center ${
                              gear === g 
                              ? 'bg-blue-600 text-white shadow-lg scale-105' 
                              : 'text-zinc-500 hover:bg-zinc-800'
                          }`}
                      >
                          {g}
                      </button>
                  ))}
              </div>
          </section>

          {/* [우측 영역] 상하 분할 */}
          <section className="col-span-8 flex flex-col gap-6 min-h-0">
              
              {/* ★ [우측 상단] 지도 표시 영역 ★ */}
              {/* Home.tsx에서 넘겨준 MapView가 children으로 이곳에 들어옵니다 */}
              <div className="h-[55%] w-full bg-[#27272a] rounded-[40px] overflow-hidden relative group shadow-lg">
                  <div className="absolute inset-0 z-0">
                    {children}
                  </div>
                  
                  {/* 오버레이 UI (목적지 없음 라벨) */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full z-10 flex items-center gap-2 pointer-events-none">
                     <Navigation size={16} className="text-white" />
                     <span className="text-white font-bold text-lg">목적지 없음</span>
                  </div>
              </div>

              {/* [우측 하단] 속도계 + 날씨 */}
              <div className="h-[45%] flex gap-6 min-h-0">
                  
                  {/* 속도계 카드 */}
                  <div className="flex-1 bg-[#27272a] rounded-[40px] flex flex-col items-center justify-center relative shadow-lg">
                      <div className="text-zinc-400 text-lg font-medium absolute top-6 left-8">속도</div>
                      <div className="flex items-baseline gap-2 mt-4">
                          {/* 외부에서 받은 speed 값 표시 */}
                          <span className="text-[90px] font-bold leading-none tracking-tighter text-white">
                              {speed}
                          </span>
                          <span className="text-2xl text-zinc-400 font-medium">Km/h</span>
                      </div>
                  </div>

                  {/* 날씨 카드 */}
                  <div className="flex-1 bg-gradient-to-br from-[#27272a] to-[#1e293b] rounded-[40px] relative overflow-hidden flex flex-col justify-center px-8 shadow-lg">
                      <div className="relative z-10">
                          <div className="text-zinc-300 text-sm mb-1 flex items-center gap-1">
                              <MapPin size={14} />
                              날씨 · 서울 중구 을지로1가
                          </div>
                          <div className="flex items-center justify-between mt-2">
                              <span className="text-5xl font-bold text-white">20.6°</span>
                              <CloudRain size={56} className="text-white drop-shadow-lg" />
                          </div>
                          <div className="mt-4 flex gap-4 text-sm text-zinc-400">
                              <div>
                                  <span className="block text-zinc-500 text-xs">습도</span>
                                  <span className="text-white font-medium">99%</span>
                              </div>
                              <div>
                                  <span className="block text-zinc-500 text-xs">강수량</span>
                                  <span className="text-white font-medium">4.5mm</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </main>

      {/* 3. 하단 독 (Dock) 메뉴 */}
      <div className="flex justify-center pt-4 shrink-0">
          <div className="flex gap-6">
            {[
                { id: 'home', icon: Home },
                { id: 'back', icon: ChevronLeft },
                { id: 'stats', icon: BarChart2 },
                { id: 'settings', icon: Settings },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                        activeTab === item.id 
                        ? 'bg-blue-600 text-white scale-110' 
                        : 'bg-[#3f3f46] text-zinc-400 hover:bg-[#52525b] hover:text-white'
                    }`}
                >
                    <item.icon size={24} />
                </button>
            ))}
          </div>
      </div>
    </div>
  );
}