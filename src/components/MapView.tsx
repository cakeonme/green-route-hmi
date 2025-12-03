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
  /** 네비게이션 전용 모드 (드래그/줌 제한 등) */
  navigationMode?: boolean;
}

export default function MapView({
  center,
  level = 3,
  markers = [],
  polylines = [],
  navigationMode = false,   // ⭐ 기본 false → Settings2는 기존 그대로
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  // 1. 카카오맵 스크립트 로드
  useEffect(() => {
    const checkKakao = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
        return true;
      }
      return false;
    };

    if (checkKakao()) return;

    const script = document.querySelector(
      'script[src*="//dapi.kakao.com/v2/maps/sdk.js"]',
    );
    if (script) {
      script.addEventListener('load', () => setIsKakaoLoaded(true));
    } else {
      const newScript = document.createElement('script');
      const appKey = import.meta.env.VITE_KAKAO_APPKEY;
      if (appKey) {
        newScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
        newScript.onload = () => {
          window.kakao.maps.load(() => setIsKakaoLoaded(true));
        };
        document.head.appendChild(newScript);
      } else {
        console.error('VITE_KAKAO_APPKEY is missing in .env');
      }
    }

    const timeoutId = setTimeout(() => {
      if (!isKakaoLoaded && window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // 2. 지도 초기화 + 데이터 그리기
  useEffect(() => {
    if (!isKakaoLoaded || !mapContainer.current) return;

    window.kakao.maps.load(() => {
      const { kakao } = window;

      if (!mapInstance.current) {
        const options = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level,
        };
        const map = new kakao.maps.Map(mapContainer.current, options);

        // ⭐ 여기서 모드에 따른 인터랙션 설정
        applyInteractionMode(map, navigationMode);

        mapInstance.current = map;
        mapInstance.current.relayout();
        drawMapData();
      } else {
        // 이미 지도 있으면 상호작용 옵션만 다시 맞춰주고, 데이터만 다시 그림
        applyInteractionMode(mapInstance.current, navigationMode);
        drawMapData();
      }
    });
    // navigationMode도 의존성에 추가 (모드 바뀌면 즉시 반영)
  }, [isKakaoLoaded, center, level, markers, polylines, navigationMode]);

  const applyInteractionMode = (map: any, navMode: boolean) => {
    // ✅ 네비 모드: 지도 고정 / 줌 범위 좁게
    if (navMode) {
      map.setDraggable(false);
      map.setZoomable(false);
      map.setMinLevel(1);
      map.setMaxLevel(3);
    } else {
      // ✅ 일반 모드 (Settings2용): 지금까지처럼 자유롭게
      map.setDraggable(true);
      map.setZoomable(true);
      map.setMinLevel(1);
      map.setMaxLevel(14);
    }
  };

  const drawMapData = () => {
    if (!mapInstance.current) return;
    const { kakao } = window;

    // 중심/레벨 업데이트
    const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
    mapInstance.current.setCenter(moveLatLon);
    mapInstance.current.setLevel(level);

    // 기존 오버레이 삭제
    markersRef.current.forEach((m) => m.setMap(null));
    polylinesRef.current.forEach((p) => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    // 마커 추가
    markers.forEach((marker) => {
      const position = new kakao.maps.LatLng(marker.lat, marker.lng);
      const m = new kakao.maps.Marker({ position });
      m.setMap(mapInstance.current);
      markersRef.current.push(m);
    });

    // 경로 추가
    polylines.forEach((line) => {
      const path = line.path.map(
        (p) => new kakao.maps.LatLng(p.lat, p.lng),
      );
      const polyline = new kakao.maps.Polyline({
        path,
        strokeWeight: 8,
        strokeColor: line.color || '#3b82f6',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      });
      polyline.setMap(mapInstance.current);
      polylinesRef.current.push(polyline);
    });
  };

  return (
    <div
      ref={mapContainer}
      className="w-full h-full relative z-0 bg-[#2e2e33]"
      style={{ minHeight: '100%' }}
    />
  );
}
