import { useEffect, useRef, useState } from "react"; // ✅ useState import 추가
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
  console.log("🔵 MapView 렌더링됨!", { center, markers, polylines, level });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const overlaysRef = useRef<kakao.maps.CustomOverlay[]>([]); 
  const polylinesRef = useRef<kakao.maps.Polyline[]>([]);
  
  // 지도 객체 생성 완료 상태를 저장 (핵심: 시각화 로직 동기화)
  const [mapLoaded, setMapLoaded] = useState(false); 

  // 1. 맵 초기화 (최초 1회만)
  useEffect(() => {
    if (!containerRef.current || !center) {
      console.log("⚠️ 컨테이너 또는 center가 없음", { containerRef: !!containerRef.current, center });
      return;
    }

    let isCancelled = false;
    console.log("🚀 맵 초기화 시작...", center);

    loadKakaoMaps()
      .then(() => {
        if (isCancelled || !containerRef.current) return;

        console.log("🗺️ 지도 생성 중...", center);
        const initialCenter = new kakao.maps.LatLng(center.lat, center.lng);
        mapRef.current = new kakao.maps.Map(containerRef.current, {
          center: initialCenter,
          level: level,
        });
        
        console.log("✅ 지도 초기화 완료!");
        setMapLoaded(true); // 지도 로드 성공 시 상태 업데이트
      })
      .catch((err) => {
        console.error("❌ 카카오맵 로드 실패:", err);
      });

    return () => {
      isCancelled = true;
    };
  }, [center]);

  // 2. 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      overlaysRef.current.forEach(o => o.setMap(null)); 
      polylinesRef.current.forEach(p => p.setMap(null));
      overlaysRef.current = [];
      polylinesRef.current = [];
    };
  }, []);

  // 3. 중심 좌표 및 줌 레벨 업데이트
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    const newCenter = new kakao.maps.LatLng(center.lat, center.lng);
    mapRef.current.setCenter(newCenter);
    mapRef.current.setLevel(3);
    console.log("📍 지도 중심 이동 및 줌 레벨 변경:", center);
  }, [center, mapLoaded]); 

  // 4. 줌 레벨 업데이트
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.setLevel(level);
    console.log("🔍 줌 레벨 변경:", level);
  }, [level, mapLoaded]); 

  // 5. 마커 업데이트 (CustomOverlay만 사용)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return; 
    
    // 기존 오버레이 제거
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];

    if (markers.length === 0) {
      console.log("📍 마커 없음");
      return;
    }

    console.log("📍 마커 추가:", markers.length + "개");

    markers.forEach((markerData) => {
      const position = new kakao.maps.LatLng(markerData.lat, markerData.lng);
      
      // 핀과 라벨을 포함하는 HTML 콘텐츠 생성
      const content = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
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
            margin-bottom: 5px;
          ">
            ${markerData.label}
          </div>
          <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png" 
               style="width: 25px; height: 35px;">
        </div>
      `;

      const overlay = new kakao.maps.CustomOverlay({
        map: mapRef.current!,
        position: position,
        content: content,
        yAnchor: 1.6, 
      });

      overlaysRef.current.push(overlay);
    });
  }, [markers, mapLoaded]); 

  // 6. 폴리라인(경로선) 업데이트
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return; 

    // 기존 폴리라인 제거
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (polylines.length === 0) return;

    console.log("🛣️ 경로선 추가:", polylines.length + "개");

    // 새 폴리라인 추가
    polylines.forEach((polylineData) => {
      if (polylineData.path.length < 2) return;

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
    });
  }, [polylines, mapLoaded]); 

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "60vh",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        backgroundColor: "#f5f5f5",
      }}
    />
  );
}