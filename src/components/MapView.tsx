import { useEffect, useRef } from "react";
import { loadKakaoMaps } from "../lib/kakaoLoader";

type Coord = { lat: number; lng: number };

type Marker = {
  lat: number;
  lng: number;
  label: string;
};

type Polyline = {
  path: Coord[];
  color: string;
};

interface MapViewProps {
  center: Coord;
  markers?: Marker[];
  polylines?: Polyline[];
  level?: number;
}

export default function MapView({ center, markers = [], polylines = [], level = 5 }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const polylinesRef = useRef<kakao.maps.Polyline[]>([]);
  const isInitializedRef = useRef(false);

  // 1. 맵 초기화 (최초 1회만)
  useEffect(() => {
    if (isInitializedRef.current || !containerRef.current) return;

    let isCancelled = false;

    loadKakaoMaps()
      .then(() => {
        if (isCancelled || !containerRef.current || !center) return;

        console.log("🗺️ 지도 초기화 중...", center);
        
        const initialCenter = new kakao.maps.LatLng(center.lat, center.lng);
        mapRef.current = new kakao.maps.Map(containerRef.current, {
          center: initialCenter,
          level: level,
        });
        
        isInitializedRef.current = true;
        console.log("✅ 지도 초기화 완료");
      })
      .catch((err) => {
        console.error("❌ 카카오맵 로드 실패:", err);
      });

    return () => {
      isCancelled = true;
    };
  }, [center, level]); // center와 level 의존성 추가

  // 2. 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      polylinesRef.current.forEach(p => p.setMap(null));
      markersRef.current = [];
      polylinesRef.current = [];
    };
  }, []);

  // 3. 중심 좌표 업데이트
  useEffect(() => {
    if (!mapRef.current || !center) return;
    
    const newCenter = new kakao.maps.LatLng(center.lat, center.lng);
    mapRef.current.setCenter(newCenter);
    console.log("📍 지도 중심 이동:", center);
  }, [center]);

  // 4. 줌 레벨 업데이트
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setLevel(level);
  }, [level]);

  // 5. 마커 업데이트
  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    console.log("📍 마커 추가:", markers.length + "개");

    // 새 마커 추가
    markers.forEach((markerData) => {
      const position = new kakao.maps.LatLng(markerData.lat, markerData.lng);
      const marker = new kakao.maps.Marker({
        map: mapRef.current!,
        position: position,
        title: markerData.label,
      });

      // 라벨 표시 (CustomOverlay 사용)
      const content = `
        <div style="
          padding: 4px 8px;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          color: #1e40af;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          white-space: nowrap;
        ">
          ${markerData.label}
        </div>
      `;

      new kakao.maps.CustomOverlay({
        map: mapRef.current!,
        position: position,
        content: content,
        yAnchor: 2.2, // 마커 위에 표시
      });

      markersRef.current.push(marker);
    });
  }, [markers]);

  // 6. 폴리라인(경로선) 업데이트
  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) return;

    // 기존 폴리라인 제거
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (polylines.length === 0) return;

    console.log("🛣️ 경로선 추가:", polylines.length + "개");

    // 새 폴리라인 추가
    polylines.forEach((polylineData) => {
      if (polylineData.path.length < 2) return; // 최소 2개 점 필요

      const linePath = polylineData.path.map(
        coord => new kakao.maps.LatLng(coord.lat, coord.lng)
      );

      const polyline = new kakao.maps.Polyline({
        map: mapRef.current!,
        path: linePath,
        strokeWeight: 5,
        strokeColor: polylineData.color,
        strokeOpacity: 0.8,
        strokeStyle: "solid",
      });

      polylinesRef.current.push(polyline);

      // 경로가 그려지면 해당 영역으로 지도 범위 조정
      const bounds = new kakao.maps.LatLngBounds();
      linePath.forEach(point => bounds.extend(point));
      mapRef.current!.setBounds(bounds);
      
      console.log("✅ 경로선 표시 완료");
    });
  }, [polylines]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "60vh",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        backgroundColor: "#f5f5f5", // 로딩 중 배경색
      }}
    />
  );
}