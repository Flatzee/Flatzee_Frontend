// Simple nearest-city helper for Nepal (no external API).
// You can extend with more cities easily.

export type CityPoint = { city: string; lat: number; lon: number };

export const CITY_POINTS: CityPoint[] = [
  { city: "Kathmandu", lat: 27.7172, lon: 85.3240 },
  { city: "Bhaktapur", lat: 27.6710, lon: 85.4298 },
  { city: "Lalitpur",  lat: 27.6644, lon: 85.3188 },
  { city: "Pokhara",   lat: 28.2096, lon: 83.9856 },
  { city: "Patan",     lat: 27.6760, lon: 85.3240 },
  { city: "Butwal",    lat: 27.7000, lon: 83.4500 },
  { city: "Biratnagar",lat: 26.4525, lon: 87.2718 },
  { city: "Dharan",    lat: 26.8144, lon: 87.2797 },
];

function haversineKm(a: CityPoint, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestCity(lat: number, lon: number): string {
  let best = CITY_POINTS[0];
  let bestD = Infinity;
  for (const c of CITY_POINTS) {
    const d = haversineKm(c, { lat, lon });
    if (d < bestD) {
      best = c;
      bestD = d;
    }
  }
  return best.city;
}
