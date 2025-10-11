import { useState } from "react";
import MapView from "../components/MapView";
import { getCurrentPosition } from "../lib/geo";
import { fetchOSRMRoute } from "../lib/routing";

type Coord = { lat: number; lng: number };

function maskKey(k?: string) {
  if (!k) return "(없음)";
  return k.slice(0, 4) + "****" + k.slice(-4);
}

export default function Home() {
  const appkey = import.meta.env.VITE_KAKAO_APPKEY as string | undefined;

  // 기본 중심 좌표 (서울 시청)
  const DEFAULT_CENTER: Coord = { lat: 37.5665, lng: 126.9780 };
  
  const [my, setMy] = useState<Coord | null>(null);
  const [dest] = useState<Coord>({ lat: 37.5796, lng: 126.9770 });
  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>([]);
  const [meta, setMeta] = useState<{ km: number; min: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 지도 중심: 내 위치가 있으면 내 위치, 없으면 기본 중심
  const mapCenter = my || DEFAULT_CENTER;
  
  console.log("🏠 Home 렌더링:", { my, mapCenter });

  async function handleLocate() {
    setErr(null);
    try {
      const pos = await getCurrentPosition();
      setMy(pos);
    } catch (e: any) {
      setErr(e?.message ?? "위치 정보를 가져올 수 없어요");
    }
  }

  async function handleRoute() {
    setErr(null);
    if (!my) return setErr("먼저 '현재 위치'를 가져와 주세요.");
    setLoading(true);
    try {
      // OSRM은 (lng,lat) 순서
      const res = await fetchOSRMRoute([my.lng, my.lat], [dest.lng, dest.lat]);
      const poly = res.geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));
      setRoutePath(poly);
      setMeta({ km: res.distanceKm, min: res.durationMin });
    } catch (e: any) {
      setErr(e?.message ?? "경로를 가져오지 못했어요");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">GreenRoute — 기본 지도 / 내 위치 / 경로</h1>

      <div className="text-sm text-gray-600">
        <b>.env 키 확인:</b> {maskKey(appkey)}
      </div>

      {/* 버튼 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleLocate} className="px-3 py-2 rounded-lg bg-blue-600 text-white">
          현재 위치
        </button>
        <button
          onClick={handleRoute}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "경로 탐색 중..." : "경로 탐색 (내 위치 → 도착지)"}
        </button>
      </div>

      {/* 상태 표시 */}
      <div className="text-sm text-gray-700 space-y-1">
        <div>도착지(임시): <code>{dest.lat.toFixed(5)}, {dest.lng.toFixed(5)}</code></div>
        <div>내 위치: {my ? <code>{my.lat.toFixed(5)}, {my.lng.toFixed(5)}</code> : "—"}</div>
        {meta && (
          <div className="p-2 rounded-lg border bg-emerald-50">
            거리: <b>{meta.km.toFixed(2)} km</b> · 예상 시간: <b>{meta.min.toFixed(0)} 분</b>
          </div>
        )}
        {err && <div className="p-2 rounded bg-red-50 text-red-700">{err}</div>}
      </div>

      {/* 지도 */}
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
  );
}