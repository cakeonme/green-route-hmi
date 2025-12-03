import React, { useState, useEffect } from "react";
// 아이콘: Settings(톱니바퀴)는 진짜 설정용, Search(돋보기)는 경로검색용
import { Home as HomeIcon, Search, Map, FileText, Settings } from 'lucide-react';

// 페이지 컴포넌트들
import HomePage from "./pages/Home";
import SettingsPage from "./pages/Settings"; // 경로 검색 (구 Settings)
import Settings2Page from "./pages/Settings2";
import MainPage from "./pages/Main";
import ReportPage from "./pages/Report";
import RealSettingsPage from "./pages/RealSettings"; // ★ 새로 추가된 진짜 설정 페이지

export default function App() {
  // 페이지 상태: home, search, search-detail, nav-loading, main, report, settings
  const [page, setPage] = useState<string>('home');

  useEffect(() => {
    if (page === 'nav-loading') {
      const timer = setTimeout(() => {
        setPage('main');
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [page]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden font-sans text-white">
      
      {/* 1. 메인 화면 영역 */}
      <div className="flex-1 overflow-hidden relative w-full h-full">
        
        {page === 'home' && <HomePage />}
        
        {/* === SEARCH PAGE (구 Settings: 경로 검색) === */}
        {page === 'search' && (
            <div onClick={() => setPage('search-detail')} className="w-full h-full cursor-pointer">
                <SettingsPage />
            </div>
        )}

        {/* === SEARCH DETAIL (구 Settings2: 경로 상세) === */}
        {page === 'search-detail' && (
            <Settings2Page 
                onBack={() => setPage('search')} 
                onStartNavigation={() => setPage('nav-loading')} 
            />
        )}

        {page === 'nav-loading' && (
            <div className="w-full h-full bg-[#18181b] flex flex-col items-center justify-center animate-fade-in z-50">
                <div className="text-center">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Map size={48} className="text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">경로를 탐색하고 있습니다</h2>
                    <p className="text-zinc-400 text-lg">서부 YMCA 피트니스</p>
                </div>
                <div className="mt-12 w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-[width_4s_ease-in-out_forwards] w-0"></div>
                </div>
            </div>
        )}

        {page === 'main' && <MainPage />}

        {page === 'report' && <ReportPage />}

        {/* === REAL SETTINGS (진짜 환경설정) === */}
        {page === 'settings' && <RealSettingsPage />}

      </div>

      {/* 2. 하단 내비게이션 바 (Dock) - 5개 버튼 */}
      {page !== 'nav-loading' && (
        <div className="h-24 bg-[#18181b] border-t border-white/5 shrink-0 flex items-center justify-between px-12 pb-4 z-50">
            
            {/* 1. Home */}
            <NavButton 
                active={page === 'home'} 
                onClick={() => setPage('home')} 
                icon={HomeIcon} 
                label="Home" 
            />
            
            {/* 2. Search (경로 검색) */}
            <NavButton 
                active={page.includes('search')} 
                onClick={() => setPage('search')} 
                icon={Search} 
                label="Search" 
            />
            
            {/* 3. Main (지도) - 가운데 강조 */}
            <button 
                onClick={() => setPage('main')} 
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105 active:scale-95 ${
                    page === 'main' ? 'bg-blue-600 text-white scale-110' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
            >
                <Map size={28} fill={page === 'main' ? "currentColor" : "none"} />
            </button>
            
            {/* 4. Report */}
            <NavButton 
                active={page === 'report'} 
                onClick={() => setPage('report')} 
                icon={FileText} 
                label="Report" 
            />

            {/* 5. Settings (진짜 설정) */}
            <NavButton 
                active={page === 'settings'} 
                onClick={() => setPage('settings')} 
                icon={Settings} 
                label="Settings" 
            />

        </div>
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-1.5 w-14 transition-all duration-300 ${
                active ? 'text-blue-500 transform scale-110' : 'text-zinc-500 hover:text-zinc-300'
            }`}
        >
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-tight">{label}</span>
        </button>
    )
}