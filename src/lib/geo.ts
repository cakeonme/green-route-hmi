export type Coord = { lat: number; lng: number };

export function getCurrentPosition(timeoutMs = 10000): Promise<Coord> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      return reject(new Error("이 브라우저는 위치 정보를 지원하지 않아요"));
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ 
        lat: pos.coords.latitude, 
        lng: pos.coords.longitude 
      }),
      (err) => {
        // GeolocationPositionError 타입의 에러 처리
        const errorMessages: Record<number, string> = {
          1: "위치 정보 권한이 거부되었어요. 브라우저 설정을 확인해주세요.",
          2: "위치 정보를 가져올 수 없어요. 네트워크를 확인해주세요.",
          3: "위치 정보 요청 시간이 초과되었어요."
        };
        const message = errorMessages[err.code] || err.message;
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 }
    );
  });
}