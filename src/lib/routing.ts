// 이 파일은 오직 '길찾기 계산'만 하는 파일입니다.
// HTML 태그(<div> 등)가 들어가지 않도록 주의하세요!

export async function fetchOSRMRoute(start: number[], end: number[]) {
  // start: [경도, 위도], end: [경도, 위도]
  const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`네트워크 오류: ${response.status}`);
  }

  const data = await response.json();

  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    throw new Error("경로를 찾을 수 없습니다.");
  }

  const route = data.routes[0];

  return {
    geometry: route.geometry,
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60
  };
}