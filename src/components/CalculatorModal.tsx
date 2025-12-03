import React, { useState } from 'react';
import { X, Calculator, Car, Zap, Leaf } from 'lucide-react';
import { calculateIceCo2, calculateEvCo2, calculateTrees } from '../lib/carbon';

interface Props {
  onClose: () => void;
}

export default function CalculatorModal({ onClose }: Props) {
  const [carType, setCarType] = useState<'ice' | 'ev'>('ice'); // ice: 내연기관, ev: 전기차
  const [fuelType, setFuelType] = useState<'gasoline' | 'diesel' | 'lpg'>('gasoline');
  const [distance, setDistance] = useState<string>(''); // 주행 거리
  const [efficiency, setEfficiency] = useState<string>(''); // 연비/전비

  const [result, setResult] = useState<{ co2: number; trees: number } | null>(null);

  const handleCalculate = () => {
    const dist = parseFloat(distance);
    const eff = parseFloat(efficiency);

    if (!dist || !eff) return;

    let co2 = 0;
    if (carType === 'ice') {
      co2 = calculateIceCo2(fuelType, dist, eff);
    } else {
      co2 = calculateEvCo2(dist, eff);
    }

    const trees = calculateTrees(co2);
    setResult({ co2, trees });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e1d23] w-full max-w-md rounded-[30px] border border-zinc-700 shadow-2xl overflow-hidden relative">
        
        {/* 헤더 */}
        <div className="p-6 border-b border-zinc-700 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Calculator size={24} className="text-green-500" />
            탄소 배출량 계산기
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="p-6 space-y-5">
          
          {/* 차종 선택 */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-800 rounded-xl">
            <button 
              onClick={() => { setCarType('ice'); setResult(null); }}
              className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${carType === 'ice' ? 'bg-zinc-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Car size={16} /> 내연기관
            </button>
            <button 
              onClick={() => { setCarType('ev'); setResult(null); }}
              className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${carType === 'ev' ? 'bg-blue-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Zap size={16} /> 전기차
            </button>
          </div>

          {/* 세부 입력 */}
          <div className="space-y-4">
            {carType === 'ice' && (
              <div>
                <label className="block text-zinc-400 text-xs mb-2">연료 종류</label>
                <select 
                  value={fuelType} 
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl p-3 outline-none focus:border-green-500"
                >
                  <option value="gasoline">휘발유 (Gasoline)</option>
                  <option value="diesel">경유 (Diesel)</option>
                  <option value="lpg">LPG</option>
                </select>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-zinc-400 text-xs mb-2">주행 거리 (km)</label>
                <input 
                  type="number" 
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="예: 30"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl p-3 outline-none focus:border-green-500 placeholder:text-zinc-600"
                />
              </div>
              <div className="flex-1">
                <label className="block text-zinc-400 text-xs mb-2">
                  {carType === 'ice' ? '연비 (km/L)' : '전비 (km/kWh)'}
                </label>
                <input 
                  type="number" 
                  value={efficiency}
                  onChange={(e) => setEfficiency(e.target.value)}
                  placeholder={carType === 'ice' ? "예: 12" : "예: 5.5"}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl p-3 outline-none focus:border-green-500 placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* 계산 버튼 */}
          <button 
            onClick={handleCalculate}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-900/20"
          >
            계산하기
          </button>

          {/* 결과 표시 영역 */}
          {result && (
            <div className="mt-6 bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5 animate-slide-up">
              <div className="text-center space-y-1 mb-4">
                <div className="text-zinc-400 text-xs">예상 탄소 배출량</div>
                <div className="text-3xl font-extrabold text-white">
                  {result.co2.toFixed(2)} <span className="text-sm font-normal text-zinc-500">kg CO₂</span>
                </div>
              </div>
              
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-full text-white">
                    <Leaf size={20} fill="currentColor" />
                  </div>
                  <div className="text-green-100 text-sm font-medium">
                    소나무 환산
                  </div>
                </div>
                <div className="text-green-400 font-bold text-lg">
                  약 {result.trees.toFixed(1)} 그루 🌲
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
