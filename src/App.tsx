import { useState, useEffect } from 'react';
import MapView from './components/MapView';
import { getDirections } from './lib/kakaoNavi';
import { getCoordinates } from './lib/kakaoLocal';

// 지도에 표시할 초기 중심 좌표
const DEFAULT_CENTER = { lat: 37.566826, lng: 126.9786567 }; // 서울 시청

export default function App() {
  const [mapCenter, setMapCenter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [error, setError] = useState('');
  const [startAddress, setStartAddress] = useState('건대입구역'); // 출발지 주소 상태
  const [endAddress, setEndAddress] = useState('서울시청'); // 목적지 주소 상태

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation을 지원하지 않는 브라우저입니다.');
      setMapCenter(DEFAULT_CENTER);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter = { lat: latitude, lng: longitude };

        console.log('✅ 현재 위치를 성공적으로 가져옴:', newCenter);
        setMapCenter(newCenter);
        setError('');

        setMarkers([{
          lat: latitude,
          lng: longitude,
          label: '내 위치'
        }]);
      },
      (geoError) => {
        let errorMessage = '';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다.';
        } else {
          errorMessage = '위치 정보를 가져오는 데 실패했습니다.';
        }
        console.error('❌ 위치 권한 오류:', errorMessage);
        setError(errorMessage);
        setMapCenter(DEFAULT_CENTER);
        setMarkers([]);
      }
    );
  }, []);

  const handleSearchRoute = async () => {
    try {
      if (!startAddress || !endAddress) {
        alert("출발지와 목적지를 모두 입력해주세요.");
        return;
      }

      // 주소-좌표 변환
      const startCoord = await getCoordinates(startAddress);
      const endCoord = await getCoordinates(endAddress);

      if (!startCoord || !endCoord) {
        alert("유효하지 않은 주소입니다. 다시 확인해주세요.");
        return;
      }
      
      // 경로 탐색 API 호출
      const routeData = await getDirections(startCoord, endCoord);

      if (routeData && routeData.routes && routeData.routes.length > 0) {
        const path = routeData.routes[0].sections.flatMap(section => 
          section.roads.flatMap(road => 
            road.vertexes.reduce((acc, coord, index) => {
              if (index % 2 === 0) {
                acc.push({ lat: road.vertexes[index + 1], lng: coord });
              }
              return acc;
            }, [])
          )
        );

        setPolylines([{
          path: path,
          color: '#3b82f6'
        }]);

        // 경로에 시작, 도착 마커 추가
        setMarkers([
          { lat: startCoord.lat, lng: startCoord.lng, label: startAddress },
          { lat: endCoord.lat, lng: endCoord.lng, label: endAddress },
        ]);

      } else {
        console.error('경로 데이터를 가져오지 못했습니다.');
        setPolylines([]);
        alert('경로를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('경로 탐색 중 오류 발생:', err);
      setPolylines([]);
      alert('경로 탐색 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>GreenRoute — 지도 테스트</h1>
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          value={startAddress} 
          onChange={(e) => setStartAddress(e.target.value)} 
          placeholder="출발지"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input 
          type="text" 
          value={endAddress} 
          onChange={(e) => setEndAddress(e.target.value)} 
          placeholder="목적지"
          style={{ padding: '5px' }}
        />
        <button 
          onClick={handleSearchRoute} 
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          경로 탐색
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {mapCenter ? (
        <MapView center={mapCenter} markers={markers} polylines={polylines} />
      ) : (
        <div>위치를 불러오는 중입니다...</div>
      )}
    </div>
  );
}