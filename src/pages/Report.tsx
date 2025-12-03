import React, { useState, useEffect } from 'react';
import WeeklyChart from '../components/WeeklyChart';
import CalculatorModal from '../components/CalculatorModal'; // ★ 계산기 모달 가져오기
import { Calculator } from 'lucide-react'; // ★ 아이콘 가져오기

export default function Report() {
  const [time, setTime] = useState(new Date());
  
  // ★ 계산기 모달을 띄울지 말지 결정하는 상태
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return "2025.12.04(목)";
  };

  const formatTime = (date: Date) => {
    return "12:41";
  };

  return (
    <div className="w-full h-full bg-[#18181b] flex flex-col font-sans overflow-hidden animate-fade-in relative">
      
      {/* 1. 상단 헤더 */}
      <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-[#18181b]">
        <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-white font-bold text-lg">Green Route</span>

            {/* ★★★ 여기에 계산기 버튼을 추가했습니다! ★★★ */}
            <button 
                onClick={() => setShowCalculator(true)}
                className="ml-6 flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-zinc-700 active:scale-95"
            >
                <Calculator size={14} />
                배출량 계산기
            </button>
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

      {/* 2. 메인 컨텐츠 (흰색 카드 영역) */}
      <main className="flex-1 bg-white mx-6 mb-6 rounded-[32px] p-8 md:p-12 overflow-hidden flex flex-col justify-center">
        
        <div className="w-full h-full flex flex-col md:flex-row gap-16 items-center justify-center">
            
            {/* === [좌측] 주간 통계 === */}
            <section className="flex-1 w-full max-w-lg h-full flex flex-col justify-center">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        탄소배출량 주간 통계
                        <span className="text-sm font-normal text-slate-500 ml-2">(단위 : kg CO₂)</span>
                    </h2>
                    <span className="text-slate-400 text-base font-medium">2025.11.24-30</span>
                </div>

                <div className="flex gap-6 justify-center mb-8 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-[2px]"></div>
                        <span className="text-slate-600">기존 탄소 배출량</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-[2px]"></div>
                        <span className="text-slate-600">친환경 탄소 감소량</span>
                    </div>
                </div>

                <div className="relative h-72 flex items-end justify-between px-2 pt-6">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 text-[10px] text-slate-400 font-medium">
                        {[50, 40, 30, 20, 10, 0].map((val) => (
                            <div key={val} className="w-full border-b border-slate-100 border-dashed h-0 flex items-center">
                                <span className="absolute -left-12 w-10 text-right">{val === 0 ? '0kg' : `${val}kg`}</span>
                            </div>
                        ))}
                    </div>

                    {[
                        { day: '월', val1: 22, val2: 12 },
                        { day: '화', val1: 28, val2: 18 },
                        { day: '수', val1: 38, val2: 25 },
                        { day: '목', val1: 30, val2: 12 },
                        { day: '금', val1: 32, val2: 20 },
                        { day: '토', val1: 30, val2: 18 },
                        { day: '일', val1: 15, val2: 10 },
                    ].map((item) => (
                        <div key={item.day} className="relative z-10 flex flex-col items-center gap-3 w-10 group h-full justify-end">
                            <div className="w-full flex flex-col items-center gap-1.5 h-full justify-end">
                                <div style={{ height: `${item.val1 * 2.5}px` }} className="w-full bg-blue-600 rounded-[4px] relative group-hover:opacity-90 transition-all shadow-sm"></div>
                                <div style={{ height: `${item.val2 * 2.5}px` }} className="w-full bg-green-500 rounded-[4px] relative group-hover:opacity-90 transition-all shadow-sm"></div>
                            </div>
                            <span className="text-sm text-slate-500 font-medium">{item.day}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="hidden md:block w-px h-80 bg-slate-100 mx-4"></div>

            {/* === [우측] 월간 통계 === */}
            <section className="flex-1 w-full max-w-lg h-full flex flex-col justify-center items-center text-center">
                <div className="w-full flex justify-between items-end mb-16 px-4">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-left">
                        탄소배출량 월간 통계
                        <span className="text-sm font-normal text-slate-500 ml-2">(단위 : kg CO₂)</span>
                    </h2>
                    <span className="text-slate-400 text-base font-medium">2025.11</span>
                </div>

                <div className="relative w-full h-48 flex items-end justify-center mb-8 px-4">
                    <div className="absolute bottom-4 flex justify-center gap-8 w-full px-8">
                        {[1, 2, 3].map((i) => (
                            <Tree key={`back-${i}`} color="bg-[#4d8b31]" size="small" delay={i * 0.2} />
                        ))}
                    </div>
                    <div className="absolute bottom-0 flex justify-center gap-10 w-full z-10">
                        {[1, 2, 3, 4].map((i) => (
                            <Tree key={`front-${i}`} color="bg-[#74c35a]" size="large" delay={i * 0.1 + 0.5} />
                        ))}
                    </div>
                </div>

                <div className="space-y-3 mt-4">
                    <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                        <span>10월 탄소 감소 효과</span>
                        <span className="text-sm font-normal text-slate-500">(나무 그루 수 환산)</span>
                        <span>:</span>
                        <span className="text-green-600 font-extrabold text-xl">약 7그루</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                        월간 누적 탄소 감소량 : 36kg CO₂(감소율 36%)
                    </p>
                </div>
            </section>

        </div>
      </main>

      {/* ★ 3. 계산기 모달 (버튼 누르면 뜸) ★ */}
      {showCalculator && (
        <CalculatorModal onClose={() => setShowCalculator(false)} />
      )}

    </div>
  );
}

// 나무 컴포넌트
const Tree = ({ color, size, delay }: { color: string, size: 'small' | 'large', delay: number }) => {
    const scale = size === 'large' ? 1 : 0.8;
    const leafSize = size === 'large' ? 'w-20 h-24' : 'w-16 h-20';
    const trunkHeight = size === 'large' ? 'h-10' : 'h-8';

    return (
        <div 
            className="flex flex-col items-center relative group cursor-pointer" 
            style={{ transform: `scale(${scale})`, animation: `bounce-gentle 3s infinite ease-in-out ${delay}s` }}
        >
            <div className={`${leafSize} rounded-[40px] ${color} relative z-10 shadow-sm group-hover:scale-110 transition-transform duration-300`}></div>
            <div className={`w-4 ${trunkHeight} bg-[#4a3b2a] -mt-3 relative z-0 rounded-sm`}>
                <div className="absolute top-2 -left-2 w-3 h-1 bg-[#4a3b2a] rotate-[-45deg] rounded-full"></div>
                <div className="absolute top-4 -right-2 w-3 h-1 bg-[#4a3b2a] rotate-[30deg] rounded-full"></div>
            </div>
        </div>
    );
};