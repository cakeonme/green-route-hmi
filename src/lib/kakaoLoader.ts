const KAKAO_SDK_URL = "https://dapi.kakao.com/v2/maps/sdk.js";

let loadPromise: Promise<typeof window.kakao> | null = null;

export function loadKakaoMaps(): Promise<typeof window.kakao> {
  // 이미 로드 중이면 같은 Promise 반환
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // 1. 이미 완전히 로드된 경우
    if (window.kakao?.maps) {
      console.log("✅ kakao.maps already loaded");
      resolve(window.kakao);
      return;
    }

    // 2. API 키 확인
    const appkey = import.meta.env.VITE_KAKAO_APPKEY;
    if (!appkey) {
      reject(new Error("VITE_KAKAO_APPKEY is missing (.env 확인 + dev 서버 재시작 필요)"));
      return;
    }

    // 3. 스크립트가 이미 DOM에 있는지 확인
    const existed = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-sdk="true"]'
    );

    if (existed) {
      console.log("ℹ️ Kakao SDK script tag already present");
      
      // window.kakao는 있지만 maps가 아직 준비 안 된 경우
      if (window.kakao && !window.kakao.maps) {
        console.log("⏳ Waiting for kakao.maps...");
        const checkInterval = setInterval(() => {
          if (window.kakao?.maps) {
            clearInterval(checkInterval);
            console.log("✅ kakao.maps ready!");
            resolve(window.kakao);
          }
        }, 50);

        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error("Timeout waiting for kakao.maps"));
        }, 5000);
        return;
      }

      // window.kakao.maps는 있는데 load가 안 된 경우
      if (window.kakao?.maps) {
        try {
          window.kakao.maps.load(() => {
            console.log("✅ kakao.maps.load OK (existing script)");
            resolve(window.kakao);
          });
        } catch (e) {
          reject(new Error("kakao.maps.load failed"));
        }
        return;
      }
    }

    // 4. 새로 스크립트 로드
    console.log("🚀 Loading Kakao SDK...");
    const script = document.createElement("script");
    script.src = `${KAKAO_SDK_URL}?appkey=${appkey}&autoload=false&libraries=services`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-kakao-sdk", "true");

    script.onload = () => {
      console.log("📦 Kakao SDK script loaded");
      
      if (!window.kakao?.maps) {
        reject(new Error("window.kakao.maps not found after script load"));
        return;
      }

      try {
        window.kakao.maps.load(() => {
          console.log("✅ kakao.maps.load OK");
          resolve(window.kakao);
        });
      } catch (e) {
        reject(new Error("kakao.maps.load failed (도메인 등록 or 네트워크 확인)"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Kakao SDK (네트워크/도메인/키 확인)"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}