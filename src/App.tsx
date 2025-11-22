import React, { useState, useEffect } from "react";
import { Home as HomeIcon, Settings, Map, FileText } from 'lucide-react';

// 페이지 컴포넌트들 불러오기
import HomePage from "./pages/Home";
import SettingsPage from "./pages/Settings";
import Settings2Page from "./pages/Settings2";
import MainPage from "./pages/Main";

export default function App() {
  // 페이지 상태: home, settings, settings-detail, nav-loading, main, report
  const [page, setPage] = useState<string>('home');

  // ★ 로딩 화면 타이머 효과 ★
  // 페이지가 'nav-loading' 상태가 되면, 3.5초 뒤에 자동으로 'main'으로 넘겨줍니다.
  useEffect(() => {
    if (page === 'nav-loading') {
      const timer = setTimeout(() => {
        setPage('main');
      }, 3500); // 3.5초 대기 (원하시면 숫자를 5000으로 바꾸면 5초가 됩니다)
      return () => clearTimeout(timer);
    }
  }, [page]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col overflow-hidden font-sans">
      
      {/* 1. 메인 화면 영역 */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* === HOME PAGE === */}
        {page === 'home' && <HomePage />}
        
        {/* === SETTINGS PAGE === */}
        {page === 'settings' && (
            <div onClick={() => setPage('settings-detail')} className="w-full h-full">
                <SettingsPage />
            </div>
        )}

        {/* === SETTINGS 2 PAGE (상세) === */}
        {/* 안내 시작을 누르면 -> 'nav-loading' (로딩 화면)으로 이동 */}
        {page === 'settings-detail' && (
            <Settings2Page 
                onBack={() => setPage('settings')} 
                onStartNavigation={() => setPage('nav-loading')} 
            />
        )}

        {/* === ★ LOADING SCREEN (임시 화면) ★ === */}
        {page === 'nav-loading' && (
            <div className="w-full h-full bg-[#18181b] flex flex-col items-center justify-center text-white animate-fade-in z-50">
                <div className="text-center">
                    {/* 아이콘 깜빡임 효과 */}
                    <Map size={80} className="mx-auto mb-8 text-blue-500 animate-pulse" />
                    <h2 className="text-3xl font-bold mb-3">경로 안내 중...</h2>
                    <p className="text-zinc-400 text-lg">서부 YMCA 피트니스로 이동합니다.</p>
                </div>
                {/* 로딩 바 장식 */}
                <div className="mt-12 w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-[width_3s_ease-in-out_forwards] w-0"></div>
                </div>
            </div>
        )}

        {/* === MAIN PAGE (진짜 내비게이션) === */}
        {page === 'main' && <MainPage />}

        {/* === REPORT PAGE === */}
        {page === 'report' && (
            <div className="w-full h-full bg-[#f2f4f6] p-6 overflow-y-auto flex items-center justify-center">
                 <div className="text-slate-400 font-bold text-xl">리포트 화면 준비중</div>
            </div>
        )}
      </div>

      {/* 2. 하단 내비게이션 바 (Dock) */}
      <div className="h-24 bg-[#18181b] border-t border-white/5 shrink-0 flex items-center justify-center gap-8 pb-4 px-6 z-50">
        <NavButton active={page === 'home'} onClick={() => setPage('home')} icon={HomeIcon} label="Home" />
        <NavButton active={page.includes('settings')} onClick={() => setPage('settings')} icon={Settings} label="Settings" />
        
        {/* 가운데 버튼을 눌러도 바로 내비게이션으로 가게 할지, 홈으로 가게 할지 선택 가능 */}
        <button 
            onClick={() => setPage('main')} 
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105 active:scale-95 ${
                page === 'main' || page === 'nav-loading' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
        >
            <Map size={28} fill={page === 'main' ? "currentColor" : "none"} />
        </button>
        
        <NavButton active={page === 'report'} onClick={() => setPage('report')} icon={FileText} label="Report" />
        <div className="w-12"></div> 
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-1 w-12 transition-all ${active ? 'text-blue-500 transform scale-110' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-tight">{label}</span>
        </button>
    )
}