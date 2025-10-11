import React from "react";
import MapView from "./components/MapView"; // 경로 확인!

export default function App() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">GreenRoute — 지도 테스트</h1>
      <MapView />
    </div>
  );
}
