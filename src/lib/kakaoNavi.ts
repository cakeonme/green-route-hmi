// 카카오 모빌리티 길찾기 API 호출 함수

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export async function fetchKakaoRoute(start: { lng: number; lat: number }, end: { lng: number; lat: number }) {
  // origin, destination 포맷: "경도,위도"
  const origin = `${start.lng},${start.lat}`;
  const destination = `${end.lng},${end.lat}`;

  // ★ 중요: 프록시 경로인 '/api'를 사용하여 요청 (CORS 회피)
  const url = `/api/v1/directions?origin=${origin}&destination=${destination}&priority=RECOMMEND&car_fuel=GASOLINE&car_hipass=false&alternatives=false&road_details=false`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `KakaoAK ${REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Kakao API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("경로를 찾을 수 없습니다.");
    }

    const route = data.routes[0];
    const summary = route.summary;

    // 경로 좌표 추출 (vertexes -> LatLng)
    const path: { lat: number; lng: number }[] = [];
    
    route.sections.forEach((section: any) => {
      section.roads.forEach((road: any) => {
        const vertexes = road.vertexes;
        for (let i = 0; i < vertexes.length; i += 2) {
          path.push({
            lng: vertexes[i],
            lat: vertexes[i + 1],
          });
        }
      });
    });

    return {
      path, // 지도에 그릴 경로 데이터
      distanceKm: (summary.distance / 1000).toFixed(1), // km
      durationMin: Math.round(summary.duration / 60),   // 분
      fare: summary.fare.toll, // 통행료
      taxiFare: summary.fare.taxi, // 택시비
    };

  } catch (error) {
    console.error("Kakao Route Fetch Error:", error);
    throw error;
  }
}