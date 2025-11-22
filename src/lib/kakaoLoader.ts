// src/lib/kakaoLoader.ts

const KAKAO_SDK_URL = "https://dapi.kakao.com/v2/maps/sdk.js";

let loadPromise: Promise<typeof window.kakao> | null = null;

export function loadKakaoMaps(): Promise<typeof window.kakao> {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      console.log("✅ kakao.maps already loaded");
      resolve(window.kakao);
      return;
    }

    const appkey = import.meta.env.VITE_KAKAO_APPKEY;
    if (!appkey) {
      reject(new Error("VITE_KAKAO_APPKEY is missing (.env 확인 + dev 서버 재시작 필요)"));
      return;
    }

    const existed = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-sdk="true"]'
    );

    if (existed) {
      console.log("ℹ️ Kakao SDK script tag already present");
      
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

    console.log("🚀 Loading Kakao SDK...");
    const script = document.createElement("script");
    // ✅ services 라이브러리 포함 (Geocoder 사용에 필수)
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