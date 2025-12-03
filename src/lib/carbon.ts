// 1. 내연기관차 연료별 탄소 배출 계수 (kg CO2/L)
export const ICE_EMISSION_FACTORS = {
  gasoline: 2.24, // 휘발유
  diesel: 2.77,   // 경유
  lpg: 1.80       // LPG
};

// 2. 전력 생산 탄소 배출 계수 (g CO2/kWh -> kg 변환을 위해 나중에 1000 나눔)
export const ELEC_EMISSION_FACTOR_G_PER_KWH = 457;

// 3. 나무 한 그루의 연간 CO2 흡수량 (kg CO2/년)
export const TREE_CO2_ABSORPTION_KG_PER_YEAR = 6.6;

// --- 계산 함수 ---

// 내연기관차 계산
export function calculateIceCo2(fuelType: 'gasoline' | 'diesel' | 'lpg', distanceKm: number, fuelEff: number) {
  // 배출량 = (주행거리 / 연비) * 배출계수
  const fuelConsumed = distanceKm / fuelEff;
  const factor = ICE_EMISSION_FACTORS[fuelType];
  return fuelConsumed * factor;
}

// 전기차 계산
export function calculateEvCo2(distanceKm: number, fuelEff: number) {
  // 전비(km/kWh) 역수 -> 소비전력(kWh/km)
  const energyConsumption = 1 / fuelEff;
  
  // 배출량(g) = 주행거리 * 소비전력 * 전력배출계수
  const emissionGram = distanceKm * energyConsumption * ELEC_EMISSION_FACTOR_G_PER_KWH;
  
  // kg 단위로 변환
  return emissionGram / 1000;
}

// 나무 그루 수 환산
export function calculateTrees(co2Kg: number) {
  if (co2Kg <= 0) return 0;
  return co2Kg / TREE_CO2_ABSORPTION_KG_PER_YEAR;
}