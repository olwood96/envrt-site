/** Country centroid + regional/city-level coordinates for production journey maps */

interface CountryCoord {
  lat: number;
  lng: number;
}

const COORDS: Record<string, CountryCoord> = {
  afghanistan: { lat: 33.93, lng: 67.71 },
  albania: { lat: 41.15, lng: 20.17 },
  algeria: { lat: 28.03, lng: 1.66 },
  argentina: { lat: -38.42, lng: -63.62 },
  australia: { lat: -25.27, lng: 133.78 },
  austria: { lat: 47.52, lng: 14.55 },
  bangladesh: { lat: 23.68, lng: 90.36 },
  belgium: { lat: 50.5, lng: 4.47 },
  bolivia: { lat: -16.29, lng: -63.59 },
  brazil: { lat: -14.24, lng: -51.93 },
  bulgaria: { lat: 42.73, lng: 25.49 },
  cambodia: { lat: 12.57, lng: 104.99 },
  cameroon: { lat: 7.37, lng: 12.35 },
  canada: { lat: 56.13, lng: -106.35 },
  chile: { lat: -35.68, lng: -71.54 },
  china: { lat: 35.86, lng: 104.2 },
  colombia: { lat: 4.57, lng: -74.3 },
  "costa rica": { lat: 9.75, lng: -83.75 },
  croatia: { lat: 45.1, lng: 15.2 },
  "czech republic": { lat: 49.82, lng: 15.47 },
  czechia: { lat: 49.82, lng: 15.47 },
  denmark: { lat: 56.26, lng: 9.5 },
  "dominican republic": { lat: 18.74, lng: -70.16 },
  ecuador: { lat: -1.83, lng: -78.18 },
  egypt: { lat: 26.82, lng: 30.8 },
  "el salvador": { lat: 13.79, lng: -88.9 },
  estonia: { lat: 58.6, lng: 25.01 },
  ethiopia: { lat: 9.15, lng: 40.49 },
  finland: { lat: 61.92, lng: 25.75 },
  france: { lat: 46.23, lng: 2.21 },
  germany: { lat: 51.17, lng: 10.45 },
  ghana: { lat: 7.95, lng: -1.02 },
  greece: { lat: 39.07, lng: 21.82 },
  guatemala: { lat: 15.78, lng: -90.23 },
  haiti: { lat: 18.97, lng: -72.29 },
  honduras: { lat: 15.2, lng: -86.24 },
  "hong kong": { lat: 22.4, lng: 114.11 },
  hungary: { lat: 47.16, lng: 19.5 },
  india: { lat: 20.59, lng: 78.96 },
  indonesia: { lat: -0.79, lng: 113.92 },
  iran: { lat: 32.43, lng: 53.69 },
  iraq: { lat: 33.22, lng: 43.68 },
  ireland: { lat: 53.14, lng: -7.69 },
  israel: { lat: 31.05, lng: 34.85 },
  italy: { lat: 41.87, lng: 12.57 },
  japan: { lat: 36.2, lng: 138.25 },
  jordan: { lat: 30.59, lng: 36.24 },
  kazakhstan: { lat: 48.02, lng: 66.92 },
  kenya: { lat: -0.02, lng: 37.91 },
  "south korea": { lat: 35.91, lng: 127.77 },
  korea: { lat: 35.91, lng: 127.77 },
  laos: { lat: 19.86, lng: 102.5 },
  latvia: { lat: 56.88, lng: 24.6 },
  lebanon: { lat: 33.85, lng: 35.86 },
  lithuania: { lat: 55.17, lng: 23.88 },
  madagascar: { lat: -18.77, lng: 46.87 },
  malaysia: { lat: 4.21, lng: 101.98 },
  mauritius: { lat: -20.35, lng: 57.55 },
  mexico: { lat: 23.63, lng: -102.55 },
  mongolia: { lat: 46.86, lng: 103.85 },
  morocco: { lat: 31.79, lng: -7.09 },
  mozambique: { lat: -18.67, lng: 35.53 },
  myanmar: { lat: 21.91, lng: 95.96 },
  nepal: { lat: 28.39, lng: 84.12 },
  netherlands: { lat: 52.13, lng: 5.29 },
  "new zealand": { lat: -40.9, lng: 174.89 },
  nicaragua: { lat: 12.87, lng: -85.21 },
  nigeria: { lat: 9.08, lng: 8.68 },
  norway: { lat: 60.47, lng: 8.47 },
  pakistan: { lat: 30.38, lng: 69.35 },
  panama: { lat: 8.54, lng: -80.78 },
  peru: { lat: -9.19, lng: -75.02 },
  philippines: { lat: 12.88, lng: 121.77 },
  poland: { lat: 51.92, lng: 19.15 },
  portugal: { lat: 39.4, lng: -8.22 },
  romania: { lat: 45.94, lng: 24.97 },
  russia: { lat: 61.52, lng: 105.32 },
  "saudi arabia": { lat: 23.89, lng: 45.08 },
  senegal: { lat: 14.5, lng: -14.45 },
  serbia: { lat: 44.02, lng: 21.01 },
  singapore: { lat: 1.35, lng: 103.82 },
  slovakia: { lat: 48.67, lng: 19.7 },
  slovenia: { lat: 46.15, lng: 14.99 },
  "south africa": { lat: -30.56, lng: 22.94 },
  spain: { lat: 40.46, lng: -3.75 },
  "sri lanka": { lat: 7.87, lng: 80.77 },
  sweden: { lat: 60.13, lng: 18.64 },
  switzerland: { lat: 46.82, lng: 8.23 },
  syria: { lat: 34.8, lng: 38.99 },
  taiwan: { lat: 23.7, lng: 120.96 },
  tanzania: { lat: -6.37, lng: 34.89 },
  thailand: { lat: 15.87, lng: 100.99 },
  tunisia: { lat: 33.89, lng: 9.54 },
  turkey: { lat: 38.96, lng: 35.24 },
  turkiye: { lat: 38.96, lng: 35.24 },
  uganda: { lat: 1.37, lng: 32.29 },
  ukraine: { lat: 48.38, lng: 31.17 },
  "united arab emirates": { lat: 23.42, lng: 53.85 },
  uae: { lat: 23.42, lng: 53.85 },
  uk: { lat: 55.38, lng: -3.44 },
  "united kingdom": { lat: 55.38, lng: -3.44 },
  usa: { lat: 37.09, lng: -95.71 },
  us: { lat: 37.09, lng: -95.71 },
  "united states": { lat: 37.09, lng: -95.71 },
  uruguay: { lat: -32.52, lng: -55.77 },
  uzbekistan: { lat: 41.38, lng: 64.59 },
  venezuela: { lat: 6.42, lng: -66.59 },
  vietnam: { lat: 14.06, lng: 108.28 },
  zambia: { lat: -13.13, lng: 27.85 },
  zimbabwe: { lat: -19.02, lng: 29.15 },
};

export function getCountryCoords(
  name: string | null | undefined
): CountryCoord | null {
  if (!name) return null;
  return COORDS[name.trim().toLowerCase()] ?? null;
}

/* ------------------------------------------------------------------ */
/*  Regional / city-level geocoding                                    */
/* ------------------------------------------------------------------ */

interface RegionalCoord {
  lat: number;
  lng: number;
}

const REGIONAL_DATA: Record<string, RegionalCoord> = {
  // Turkey
  "aydin,turkey": { lat: 37.85, lng: 27.84 },
  "aydin,turkiye": { lat: 37.85, lng: 27.84 },
  "denizli,turkey": { lat: 37.77, lng: 29.09 },
  "denizli,turkiye": { lat: 37.77, lng: 29.09 },
  "istanbul,turkey": { lat: 41.01, lng: 28.98 },
  "istanbul,turkiye": { lat: 41.01, lng: 28.98 },
  "izmir,turkey": { lat: 38.42, lng: 27.13 },
  "izmir,turkiye": { lat: 38.42, lng: 27.13 },
  "bursa,turkey": { lat: 40.18, lng: 29.06 },
  "bursa,turkiye": { lat: 40.18, lng: 29.06 },
  "gaziantep,turkey": { lat: 37.07, lng: 36.24 },
  "gaziantep,turkiye": { lat: 37.07, lng: 36.24 },
  "kayseri,turkey": { lat: 38.73, lng: 35.49 },
  "kayseri,turkiye": { lat: 38.73, lng: 35.49 },
  "kahramanmaras,turkey": { lat: 37.58, lng: 36.93 },
  "kahramanmaras,turkiye": { lat: 37.58, lng: 36.93 },
  "adana,turkey": { lat: 37.0, lng: 35.32 },
  "adana,turkiye": { lat: 37.0, lng: 35.32 },
  "usak,turkey": { lat: 38.67, lng: 29.41 },
  "tekirdag,turkey": { lat: 40.98, lng: 27.51 },
  "corlu,turkey": { lat: 41.16, lng: 27.8 },
  "malatya,turkey": { lat: 38.35, lng: 38.31 },

  // Portugal
  "viana do castelo,portugal": { lat: 41.69, lng: -8.83 },
  "porto,portugal": { lat: 41.16, lng: -8.63 },
  "braga,portugal": { lat: 41.55, lng: -8.43 },
  "guimaraes,portugal": { lat: 41.44, lng: -8.29 },
  "barcelos,portugal": { lat: 41.53, lng: -8.62 },
  "lisbon,portugal": { lat: 38.72, lng: -9.14 },

  // China
  "shanghai,china": { lat: 31.23, lng: 121.47 },
  "guangzhou,china": { lat: 23.13, lng: 113.26 },
  "shenzhen,china": { lat: 22.54, lng: 114.06 },
  "dongguan,china": { lat: 23.04, lng: 113.74 },
  "hangzhou,china": { lat: 30.27, lng: 120.15 },
  "suzhou,china": { lat: 31.3, lng: 120.59 },
  "ningbo,china": { lat: 29.87, lng: 121.54 },
  "shaoxing,china": { lat: 30.0, lng: 120.58 },
  "foshan,china": { lat: 23.02, lng: 113.12 },
  "zhongshan,china": { lat: 22.52, lng: 113.39 },
  "jiangsu,china": { lat: 32.97, lng: 119.45 },
  "zhejiang,china": { lat: 29.14, lng: 119.79 },
  "fujian,china": { lat: 26.08, lng: 117.99 },
  "shandong,china": { lat: 36.67, lng: 117.02 },
  "xinjiang,china": { lat: 41.75, lng: 84.77 },
  "hebei,china": { lat: 38.04, lng: 114.51 },

  // Bangladesh
  "dhaka,bangladesh": { lat: 23.81, lng: 90.41 },
  "chittagong,bangladesh": { lat: 22.36, lng: 91.78 },
  "gazipur,bangladesh": { lat: 24.0, lng: 90.43 },
  "narayanganj,bangladesh": { lat: 23.62, lng: 90.5 },
  "tongi,bangladesh": { lat: 23.89, lng: 90.4 },

  // India
  "mumbai,india": { lat: 19.08, lng: 72.88 },
  "delhi,india": { lat: 28.7, lng: 77.1 },
  "tirupur,india": { lat: 11.11, lng: 77.34 },
  "coimbatore,india": { lat: 11.0, lng: 76.96 },
  "surat,india": { lat: 21.17, lng: 72.83 },
  "ludhiana,india": { lat: 30.9, lng: 75.86 },
  "jaipur,india": { lat: 26.91, lng: 75.79 },
  "ahmedabad,india": { lat: 23.02, lng: 72.57 },
  "chennai,india": { lat: 13.08, lng: 80.27 },
  "erode,india": { lat: 11.34, lng: 77.73 },
  "tamil nadu,india": { lat: 11.13, lng: 78.66 },
  "gujarat,india": { lat: 22.26, lng: 71.19 },
  "rajasthan,india": { lat: 27.02, lng: 74.22 },
  "punjab,india": { lat: 31.15, lng: 75.34 },

  // Vietnam
  "ho chi minh city,vietnam": { lat: 10.82, lng: 106.63 },
  "hanoi,vietnam": { lat: 21.03, lng: 105.85 },
  "binh duong,vietnam": { lat: 11.17, lng: 106.65 },
  "dong nai,vietnam": { lat: 10.95, lng: 106.82 },

  // Pakistan
  "lahore,pakistan": { lat: 31.55, lng: 74.35 },
  "faisalabad,pakistan": { lat: 31.42, lng: 73.08 },
  "karachi,pakistan": { lat: 24.86, lng: 67.0 },
  "sialkot,pakistan": { lat: 32.5, lng: 74.53 },

  // Italy
  "lombardia,italy": { lat: 45.47, lng: 9.19 },
  "prato,italy": { lat: 43.88, lng: 11.1 },
  "como,italy": { lat: 45.81, lng: 9.08 },
  "biella,italy": { lat: 45.56, lng: 8.05 },
  "milan,italy": { lat: 45.46, lng: 9.19 },
  "florence,italy": { lat: 43.77, lng: 11.25 },
  "naples,italy": { lat: 40.85, lng: 14.27 },

  // Cambodia
  "phnom penh,cambodia": { lat: 11.56, lng: 104.92 },

  // Indonesia
  "jakarta,indonesia": { lat: -6.21, lng: 106.85 },
  "bandung,indonesia": { lat: -6.91, lng: 107.61 },
  "surabaya,indonesia": { lat: -7.25, lng: 112.75 },

  // Myanmar
  "yangon,myanmar": { lat: 16.87, lng: 96.2 },

  // Ethiopia
  "addis ababa,ethiopia": { lat: 9.02, lng: 38.75 },
  "hawassa,ethiopia": { lat: 7.06, lng: 38.48 },

  // Morocco
  "casablanca,morocco": { lat: 33.57, lng: -7.59 },
  "tangier,morocco": { lat: 35.77, lng: -5.8 },
  "fez,morocco": { lat: 34.03, lng: -5.0 },

  // Egypt
  "cairo,egypt": { lat: 30.04, lng: 31.24 },
  "alexandria,egypt": { lat: 31.2, lng: 29.92 },
  "mahalla,egypt": { lat: 30.97, lng: 31.17 },

  // Sri Lanka
  "colombo,sri lanka": { lat: 6.93, lng: 79.85 },

  // Thailand
  "bangkok,thailand": { lat: 13.76, lng: 100.5 },

  // South Korea
  "seoul,south korea": { lat: 37.57, lng: 126.98 },
  "daegu,south korea": { lat: 35.87, lng: 128.6 },

  // Japan
  "osaka,japan": { lat: 34.69, lng: 135.5 },
  "tokyo,japan": { lat: 35.68, lng: 139.69 },

  // Spain
  "barcelona,spain": { lat: 41.39, lng: 2.17 },
  "valencia,spain": { lat: 39.47, lng: -0.38 },

  // UK
  "manchester,united kingdom": { lat: 53.48, lng: -2.24 },
  "leicester,united kingdom": { lat: 52.63, lng: -1.13 },
  "london,united kingdom": { lat: 51.51, lng: -0.13 },
  "manchester,uk": { lat: 53.48, lng: -2.24 },
  "leicester,uk": { lat: 52.63, lng: -1.13 },
  "london,uk": { lat: 51.51, lng: -0.13 },

  // USA
  "los angeles,united states": { lat: 34.05, lng: -118.24 },
  "new york,united states": { lat: 40.71, lng: -74.01 },
  "los angeles,usa": { lat: 34.05, lng: -118.24 },
  "new york,usa": { lat: 40.71, lng: -74.01 },

  // Romania
  "bucharest,romania": { lat: 44.43, lng: 26.1 },

  // Tunisia
  "tunis,tunisia": { lat: 36.81, lng: 10.18 },
  "monastir,tunisia": { lat: 35.78, lng: 10.83 },

  // Mauritius
  "port louis,mauritius": { lat: -20.16, lng: 57.5 },
};

/**
 * Get the best available coordinates for a location.
 * Prefers regional (city-level) coordinates when available,
 * falls back to country centroid.
 */
export function getLocationInfo(
  country: string | null | undefined,
  regional: string | null | undefined
): CountryCoord | null {
  if (!country) return null;

  // Try regional first
  if (regional) {
    const regionClean = regional.trim().toLowerCase();
    const countryClean = country.trim().toLowerCase();
    if (regionClean !== "nan" && regionClean !== "null" && regionClean !== "undefined") {
      const key = `${regionClean},${countryClean}`;
      const regionalCoord = REGIONAL_DATA[key];
      if (regionalCoord) return regionalCoord;
    }
  }

  // Fall back to country centroid
  return getCountryCoords(country);
}
