// src/lib/kakaoLocal.ts
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export async function getCoordinates(address: string) {
  if (!KAKAO_REST_API_KEY) {
    console.error("VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다.");
    return null;
  }

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
  const headers = { 'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}` };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`주소 검색 API 호출 실패: ${response.status}`);
    }
    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const result = data.documents[0];
      return {
        lat: parseFloat(result.y),
        lng: parseFloat(result.x)
      };
    } else {
      console.warn(`주소 '${address}'에 대한 좌표를 찾을 수 없습니다.`);
      return null;
    }
  } catch (error) {
    console.error("주소-좌표 변환 중 오류 발생:", error);
    return null;
  }
}