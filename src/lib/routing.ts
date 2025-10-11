import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import MapView from "../components/MapView";
import { getCurrentPosition } from "../lib/geo";
import { fetchOSRMRoute } from "../lib/routing";

type Coord = { lat: number; lng: number };

function maskKey(k?: string) {
  if (!k) return "(없음)";
  if (k.length < 8) return "****";
  return k.slice(0, 4) + "****" + k.slice(-4);
}

export default function Home() {
  const appkey = import.meta.env.VITE_KAKAO_APPKEY as string | undefined;
  
  // 기본 중심(서울 시청), 임시 도착지(경복궁 근처)
  const [center, setCenter] = useState<Coord>({ lat: 37.5665, lng: 126.9780 });
  const [my, setMy] = useState<Coord | null>(null);
  const [dest, setDest] = useState<Coord>({ lat: 37.5796, lng: 126.9770 });
  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>([]);
  const [meta, setMeta] = useState<{ km: number; min: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  
  // 마운트 상태 추적 (메모리 누수 방지)
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const mapCenter = useMemo(() => my ?? center, [my, center]);

  const handleLocate = useCallback(async () => {
    if (loading) return; // 중복 실행 방지
    
    setErr(null);
    setLoading(true);
    
    try {
      const pos = await getCurrentPosition();
      if (!isMountedRef.current) return;
      
      setMy(pos);
      setCenter(pos);
    } catch (e) {
      if (!isMountedRef.current) return;
      setErr(e instanceof Error ? e.message : "위치 정보를 가져올 수 없어요");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [loading]);

  const handleRoute = useCallback(async () => {
    if (loading) return; // 중복 실행 방지
    
    setErr(null);
    
    if (!my) {
      setErr("먼저 '현재 위치'를 가져와 주세요.");
      return;
    }
    
    setLoading(true);
    
    try {
      // OSRM은 (lng,lat) 순서
      const res = await fetchOSRMRoute([my.lng, my.lat], [dest.lng, dest.lat]);
      
      if (!isMountedRef.current) return;
      
      const poly = res.geometry.coordinates.map((c: number[]) => ({ 
        lat: c[1], 
        lng: c[0] 
      }));
      
      setRoutePath(poly);
      setMeta({ km: res.distanceKm, min: res.durationMin });
    } catch (e) {
      if (!isMountedRef.current) return;
      setErr(e instanceof Error ? e.message : "경로를 가져오지 못했어요");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [my, dest, loading]);

  // 환경변수 검증
  if (!appkey) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <h2 className="font-bold mb-2">⚠️ 설정 오류</h2>
          <p>VITE_KAKAO_APPKEY가 설정되지 않았습니다.</p>
          <p className="text-sm mt-1">프로젝트 루트의 .env 파일을 확인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">🌱 GreenRoute — 친환경 경로 탐색</h1>
      
      <div className="text-sm text-gray-600">
        <b>카카오맵 키 확인:</b> {maskKey(appkey)}
      </div>

      {/* 버튼 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleLocate}
          disabled={loading}
          aria-label="현재 위치 가져오기"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          📍 현재 위치
        </button>
        <button
          onClick={handleRoute}
          disabled={loading || !my}
          aria-label="경로 탐색"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "⏳ 경로 탐색 중..." : "🚗 경로 탐색 (내 위치 → 도착지)"}
        </button>
      </div>

      {/* 상태 표시 */}
      <div className="text-sm space-y-2">
        <div className="p-3 rounded-lg bg-gray-50 border">
          <div className="font-medium text-gray-700 mb-1">📌 도착지 (임시)</div>
          <code className="text-xs bg-white px-2 py-1 rounded">
            {dest.lat.toFixed(5)}, {dest.lng.toFixed(5)}
          </code>
        </div>
        
        <div className="p-3 rounded-lg bg-gray-50 border">
          <div className="font-medium text-gray-700 mb-1">📍 내 위치</div>
          {my ? (
            <code className="text-xs bg-white px-2 py-1 rounded">
              {my.lat.toFixed(5)}, {my.lng.toFixed(5)}
            </code>
          ) : (
            <span className="text-gray-500">—</span>
          )}
        </div>
        
        {meta && (
          <div className="p-3 rounded-lg border-2 border-emerald-500 bg-emerald-50">
            <div className="font-medium text-emerald-800 mb-1">✅ 경로 정보</div>
            <div className="flex gap-4 text-sm">
              <span>거리: <b className="text-emerald-700">{meta.km.toFixed(2)} km</b></span>
              <span>예상 시간: <b className="text-emerald-700">{meta.min.toFixed(0)} 분</b></span>
            </div>
          </div>
        )}
        
        {err && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
            ⚠️ {err}
          </div>
        )}
      </div>

      {/* 지도 */}
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <MapView
          center={mapCenter}
          markers={[
            ...(my ? [{ lat: my.lat, lng: my.lng, label: "내 위치" }] : []),
            { lat: dest.lat, lng: dest.lng, label: "도착지" },
          ]}
          polylines={routePath.length ? [{ path: routePath, color: "#10b981" }] : []}
          level={my ? 5 : 6}
        />
      </div>
    </div>
  );
}