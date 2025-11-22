// src/lib/kakaoLocal.ts

export async function getCoordinates(address: string) {
  try {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        console.error("Kakao Maps services 라이브러리가 로드되지 않았습니다.");
        return null;
    }
    
    // Geocoder 객체 생성 (주소-좌표 변환에 사용)
    const geocoder = new window.kakao.maps.services.Geocoder();

    return new Promise((resolve, reject) => {
      // addressSearch를 사용해 정확한 주소를 좌표로 변환 시도
      geocoder.addressSearch(address, (data, status) => { 
        if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
          const result = data[0];
          resolve({
            lat: parseFloat(result.y),
            lng: parseFloat(result.x)
          });
        } else {
          // ZERO_RESULT가 발생하면 경고를 남기고 null 반환
          console.warn(`주소 '${address}'에 대한 좌표를 찾을 수 없습니다. (상태: ${status})`);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("주소-좌표 변환 중 오류 발생:", error);
    return null;
  }
}