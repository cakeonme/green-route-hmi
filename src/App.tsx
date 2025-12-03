import React, { useState, useEffect } from "react";
import { Home as HomeIcon, Settings, Map, FileText, BarChart2 } from 'lucide-react';

// 페이지 컴포넌트들 불러오기
import HomePage from "./pages/Home";
import SettingsPage from "./pages/Settings";
import Settings2Page from "./pages/Settings2";
import MainPage from "./pages/Main";
import ReportPage from "./pages/Report";

export default function App() {
  // 페이지 상태: home, settings, settings-detail, nav-loading, main, report
  const [page, setPage] = useState<string>('home');

  // ★ 로딩 화면 타이머 효과 ★
  // 'nav-loading' 상태가 되면, 4초(4000ms) 뒤에 자동으로 'main'으로 넘어갑니다.
  useEffect(() => {
    if (page === 'nav-loading') {
      const timer = setTimeout(() => {
        setPage('main');
      }, 4000); // 4초 대기
      return () => clearTimeout(timer);
    }
  }, [page]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden font-sans text-white">
      
      {/* =========================================
          1. 메인 화면 영역 (페이지 라우팅)
         ========================================= */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* 1) HOME PAGE (대시보드) */}
        {page === 'home' && <HomePage />}
        
        {/* 2) SETTINGS PAGE (경로 검색 입력창) */}
        {page === 'settings' && (
            // 검색창 어디를 눌러도 상세 화면으로 넘어가게 임시 처리
            <div onClick={() => setPage('settings-detail')} className="w-full h-full cursor-pointer">
                <SettingsPage />
            </div>
        )}

        {/* 3) SETTINGS 2 PAGE (경로 상세 & 지도 배경) */}
        {/* 안내 시작 -> 로딩 화면('nav-loading')으로 이동 */}
        {page === 'settings-detail' && (
            <Settings2Page 
                onBack={() => setPage('settings')} 
                onStartNavigation={() => setPage('nav-loading')} 
            />
        )}

        {/* 4) LOADING SCREEN (경로 탐색 중... 효과) */}
        {page === 'nav-loading' && (
            <div className="w-full h-full bg-[#18181b] flex flex-col items-center justify-center animate-fade-in z-50">
                <div className="text-center">
                    {/* 아이콘 깜빡임 효과 */}
                    <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Map size={48} className="text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">경로를 탐색하고 있습니다</h2>
                    <p className="text-zinc-400 text-lg">서부 YMCA 피트니스</p>
                </div>
                {/* 로딩 바 애니메이션 */}
                <div className="mt-12 w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-[width_4s_ease-in-out_forwards] w-0"></div>
                </div>
            </div>
        )}

        {/* 5) MAIN PAGE (진짜 내비게이션 주행 화면) */}
        {page === 'main' && <MainPage />}

        {/* 6) REPORT PAGE (주행 리포트) */}
        {page === 'report' && <ReportPage />}

      </div>

      {/* =========================================
          2. 하단 내비게이션 바 (Dock)
         ========================================= */}
      <div className="h-24 bg-[#18181b] border-t border-white/5 shrink-0 flex items-center justify-center gap-10 pb-4 px-6 z-50">
        
        {/* Home 버튼 */}
        <NavButton 
            active={page === 'home'} 
            onClick={() => setPage('home')} 
            icon={HomeIcon} 
            label="Home" 
        />
        
        {/* Settings 버튼 */}
        <NavButton 
            active={page.includes('settings')} 
            onClick={() => setPage('settings')} 
            icon={Settings} 
            label="Settings" 
        />
        
        {/* Main(내비게이션) 버튼 - 가운데 강조 */}
        <button 
            onClick={() => setPage('main')} 
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105 active:scale-95 ${
                page === 'main' || page === 'nav-loading' 
                ? 'bg-blue-600 text-white scale-110' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
        >
            <Map size={28} fill={page === 'main' ? "currentColor" : "none"} />
        </button>
        
        {/* Report 버튼 */}
        <NavButton 
            active={page === 'report'} 
            onClick={() => setPage('report')} 
            icon={FileText} 
            label="Report" 
        />
        
        {/* 레이아웃 균형을 위한 투명 박스 (필요 시 제거 가능) */}
        <div className="w-0"></div> 
      </div>
    </div>
  );
}

// 하단 버튼 디자인 컴포넌트
function NavButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-1.5 w-12 transition-all duration-300 ${
                active 
                ? 'text-blue-500 transform scale-110' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
        >
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-tight">{label}</span>
        </button>
    )
}