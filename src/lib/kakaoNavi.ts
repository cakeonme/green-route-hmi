// src/lib/kakaoNavi.ts

// 환경 변수에서 REST API 키 가져오기
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

// 길찾기 API 호출 함수
export async function getDirections(start: { lat: number; lng: number }, end: { lat: number; lng: number }) {
  if (!KAKAO_REST_API_KEY) {
    console.error("VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다.");
    return null;
  }

  const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${start.lng},${start.lat}&destination=${end.lng},${end.lat}`;

  const headers = {
    'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("경로 탐색 API 호출 중 오류 발생:", error);
    return null;
  }
}