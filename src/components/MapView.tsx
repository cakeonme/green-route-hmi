import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MapViewProps {
  center: { lat: number; lng: number };
  level?: number;
  markers?: { lat: number; lng: number; label?: string }[];
  polylines?: { path: { lat: number; lng: number }[]; color?: string }[];
}

export default function MapView({ center, level = 3, markers = [], polylines = [] }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  
  // 카카오 스크립트 로드 상태 확인용
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  // 1. 카카오맵 스크립트가 로드되었는지 감시
  useEffect(() => {
    const checkKakao = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
        return true;
      }
      return false;
    };

    if (checkKakao()) return;

    const script = document.querySelector('script[src*="//dapi.kakao.com/v2/maps/sdk.js"]');
    if (script) {
        script.addEventListener('load', () => setIsKakaoLoaded(true));
    } else {
        // 혹시 index.html에 스크립트가 없다면 동적으로 추가 (비상용)
        const newScript = document.createElement('script');
        // .env 파일이 없다면 직접 키를 입력하거나, 없을 경우 오류 처리 필요
        const appKey = import.meta.env.VITE_KAKAO_APPKEY; 
        if (appKey) {
            newScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`; // autoload=false 추가 중요!
            newScript.onload = () => {
                window.kakao.maps.load(() => setIsKakaoLoaded(true));
            };
            document.head.appendChild(newScript);
        } else {
            console.error("VITE_KAKAO_APPKEY is missing in .env");
        }
    }
    
    // 타임아웃 설정 (스크립트 로드 실패 대비)
    const timeoutId = setTimeout(() => {
        if (!isKakaoLoaded && window.kakao && window.kakao.maps) {
             setIsKakaoLoaded(true);
        }
    }, 2000);

    return () => clearTimeout(timeoutId);

  }, []);

  // 2. 지도가 로드되면 초기화 및 그리기
  useEffect(() => {
    if (!isKakaoLoaded || !mapContainer.current) return;

    // window.kakao.maps.load 콜백을 사용하여 API 로드 완료 후 실행 보장
    window.kakao.maps.load(() => {
        // 지도 생성 (이미 있으면 생략)
        if (!mapInstance.current) {
            const options = {
              center: new window.kakao.maps.LatLng(center.lat, center.lng),
              level: level,
            };
            mapInstance.current = new window.kakao.maps.Map(mapContainer.current, options);
            
            // 지도 생성 직후 리사이즈 한 번 해줌 (깨짐 방지)
            mapInstance.current.relayout();
            
            // 초기 데이터 그리기
            drawMapData();
        } else {
          // 이미 지도가 있으면 데이터만 다시 그리기
          drawMapData();
        }
    });
  }, [isKakaoLoaded, center, level, markers, polylines]);

  // 마커와 경로 그리는 함수 분리
  const drawMapData = () => {
    if (!mapInstance.current) return;

    // 중심 이동
    const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
    mapInstance.current.setCenter(moveLatLon);
    mapInstance.current.setLevel(level);

    // 기존 오버레이 삭제
    markersRef.current.forEach(m => m.setMap(null));
    polylinesRef.current.forEach(p => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    // 마커 추가
    markers.forEach(marker => {
      const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);
      
      const m = new window.kakao.maps.Marker({ 
          position,
      });
      m.setMap(mapInstance.current);
      markersRef.current.push(m);
    });

    // 경로 추가
    polylines.forEach(line => {
      const path = line.path.map(p => new window.kakao.maps.LatLng(p.lat, p.lng));
      const polyline = new window.kakao.maps.Polyline({
        path: path,
        strokeWeight: 8,
        strokeColor: line.color || '#3b82f6',
        strokeOpacity: 0.9,
        strokeStyle: 'solid'
      });
      polyline.setMap(mapInstance.current);
      polylinesRef.current.push(polyline);
    });
  };

  return (
    <div 
        ref={mapContainer} 
        className="w-full h-full relative z-0 bg-[#2e2e33]" // 로딩 전엔 회색 배경
        style={{ minHeight: '100%' }} // 높이 강제 설정 추가
    />
  );
}