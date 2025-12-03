import React from 'react';

// 주간 데이터 (예시)
const WEEKLY_DATA = [
  { day: '월', emission: 20, reduction: 10 },
  { day: '화', emission: 25, reduction: 15 },
  { day: '수', emission: 35, reduction: 22 }, // 가장 높음
  { day: '목', emission: 28, reduction: 10 },
  { day: '금', emission: 30, reduction: 18 },
  { day: '토', emission: 28, reduction: 17 },
  { day: '일', emission: 15, reduction: 10 },
];

export default function WeeklyChart() {
  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      
      {/* 1. 주간 통계 (막대 차트) */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">탄소배출량 주간 통계 <span className="text-xs text-slate-500 font-normal">(단위 : kg CO₂)</span></h3>
            <span className="text-slate-400 text-sm">2025.09.15-26</span>
        </div>

        {/* 범례 */}
        <div className="flex gap-4 justify-center mb-6 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div><span className="text-slate-500">기존 탄소 배출량</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span className="text-slate-500">친환경 탄소 감소량</span></div>
        </div>

        {/* 차트 영역 */}
        <div className="h-48 flex items-end justify-between gap-2 relative pt-6">
            {/* Y축 가이드라인 (점선) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
                {[50, 40, 30, 20, 10, 0].map((val) => (
                    <div key={val} className="w-full border-b border-slate-100 border-dashed h-0 flex items-center">
                        <span className="absolute -left-8">{val}kg</span>
                    </div>
                ))}
            </div>

            {/* 막대 그래프 */}
            {WEEKLY_DATA.map((data) => (
                <div key={data.day} className="relative z-10 flex flex-col items-center gap-1 w-full group">
                    {/* 툴팁 (호버 시 수치 표시) */}
                    <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        배출:{data.emission} / 감소:{data.reduction}
                    </div>
                    
                    {/* 막대 (Stack 형태) */}
                    <div className="w-3/5 max-w-[24px] flex flex-col-reverse gap-1 h-32 justify-end">
                        {/* 파란색 (배출량 - 감소량 = 실제 배출 느낌으로 표현하거나, 디자인처럼 위아래 배치) */}
                        {/* 여기서는 디자인처럼 두 개의 막대를 겹치지 않고 위아래로 쌓는 대신, 겹쳐 보이게 하거나 따로 배치 */}
                        <div style={{ height: `${data.emission * 1.5}px` }} className="w-full bg-blue-600 rounded-t-sm opacity-90"></div>
                        <div style={{ height: `${data.reduction * 1.5}px` }} className="w-full bg-green-500 rounded-t-sm -mt-2 z-10 border-t border-white"></div> 
                    </div>
                    <span className="text-xs text-slate-500 mt-2">{data.day}</span>
                </div>
            ))}
        </div>
      </div>

      {/* 2. 월간 통계 (도넛 차트) */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center relative">
         <div className="w-full flex justify-between items-center mb-6 absolute top-6 px-6">
            <h3 className="font-bold text-slate-800 text-lg">탄소배출량 월간 통계 <span className="text-xs text-slate-500 font-normal">(단위 : kg CO₂)</span></h3>
            <span className="text-slate-400 text-sm">2025.08</span>
        </div>

        <div className="flex items-center gap-8 mt-12">
            {/* 도넛 차트 (CSS Conic Gradient 사용) */}
            <div className="relative w-48 h-48 rounded-full" 
                 style={{ background: `conic-gradient(#3b82f6 0% 64%, #f1f5f9 64% 100%)` }}>
                {/* 안쪽 흰원 (도넛 모양 만들기) */}
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
                    {/* 초록색 진행바 (안쪽에 겹침) */}
                    <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(transparent 0% 64%, #22c55e 64% 100%)`, opacity: 0.2 }}></div>
                    
                    <span className="text-slate-500 text-sm font-medium">탄소 감소량</span>
                    <span className="text-4xl font-extrabold text-slate-800">36%</span>
                </div>
            </div>

            {/* 수치 텍스트 */}
            <div className="flex flex-col gap-3">
                <div>
                    <div className="text-2xl font-bold text-blue-600">120 kg CO₂</div>
                    <div className="text-xs text-slate-400">총 배출량</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-green-500">36 kg CO₂</div>
                    <div className="text-xs text-slate-400">총 절감량</div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}