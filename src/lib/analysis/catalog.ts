// ─── POTENSIA · Katalog Kuesioner & Tipe Data ─────────────────────────────
// Shared antara form wizard (client), validasi API, dan mesin analisis.

export interface PhotoMetric {
  filePath: string;
  width: number;
  height: number;
  brightness: number; // 0–100
  colorfulness: number; // 0–100
  greenness: number; // 0–100 (dominasi vegetasi)
  blueness: number; // 0–100 (dominasi langit/air)
  quality: number; // 0–100 skor kualitas komposit
}

export interface AnalysisFormInput {
  villageName: string;
  district: string; // kecamatan
  city: string; // kabupaten/kota
  province: string;
  population: number;
  areaHa: number;
  description: string;
  contactEmail?: string;

  attractions: string[]; // key dari ATTRACTION_GROUPS[*].items
  mainAttraction: string;
  uniqueness: number; // 1–5
  monthlyVisitorsTier: string; // key VISITOR_TIERS
  ticketType: "free" | "paid";
  ticketPrice: number;

  roadCondition: number; // 1–5
  publicTransport: "good" | "limited" | "none";
  distanceToCityKm: number;
  travelMinutes: number;
  signalQuality: number; // 1–5
  signage: "yes" | "partial" | "no";

  amenities: string[]; // key AMENITIES
  homestayTier: "none" | "few" | "some" | "many";
  camping: boolean;

  pokdarwis: "active" | "formed" | "none";
  bumdes: "active" | "formed" | "none";
  guideCount: number;
  wasteScore: number; // 1–5
  safetyScore: number; // 1–5
  communityScore: number; // 1–5

  socialMedia: string[]; // key SOCIAL_CHANNELS
  governmentSupport: number; // 1–5
  recurringEvent: boolean;
  travelPartners: boolean;
}

export const ATTRACTION_GROUPS: {
  key: "alam" | "budaya" | "agro" | "buatan";
  label: string;
  hint: string;
  items: { key: string; label: string }[];
}[] = [
  {
    key: "alam",
    label: "Wisata Alam",
    hint: "Bentang alam sebagai daya tarik utama",
    items: [
      { key: "pantai", label: "Pantai & Pesisir" },
      { key: "airTerjun", label: "Air Terjun" },
      { key: "gunungBukit", label: "Gunung & Bukit" },
      { key: "sungai", label: "Sungai & Jeram" },
      { key: "danau", label: "Danau & Waduk" },
      { key: "hutan", label: "Hutan & Konservasi" },
      { key: "terasering", label: "Sawah & Terasering" },
      { key: "gua", label: "Gua & Karst" },
    ],
  },
  {
    key: "budaya",
    label: "Budaya & Sejarah",
    hint: "Tradisi hidup yang dapat dipentaskan",
    items: [
      { key: "rumahAdat", label: "Rumah Adat / Kampung Tradisional" },
      { key: "upacaraAdat", label: "Upacara & Ritual Adat" },
      { key: "seniPertunjukan", label: "Seni Tari & Musik Tradisi" },
      { key: "kerajinan", label: "Kerajinan Tangan" },
      { key: "kuliner", label: "Kuliner Khas" },
      { key: "situsSejarah", label: "Situs Sejarah & Cagar Budaya" },
    ],
  },
  {
    key: "agro",
    label: "Agrowisata",
    hint: "Aktivitas pertanian sebagai pengalaman",
    items: [
      { key: "perkebunan", label: "Perkebunan (Kopi / Teh / Kakao)" },
      { key: "peternakan", label: "Peternakan" },
      { key: "perikanan", label: "Perikanan" },
      { key: "kebunBuah", label: "Kebun Buah & Petik Sendiri" },
      { key: "hortikultura", label: "Sayur & Hortikultura" },
    ],
  },
  {
    key: "buatan",
    label: "Atraksi Buatan",
    hint: "Wahana yang dibangun pengelola",
    items: [
      { key: "spotFoto", label: "Spot Foto & Instagramable Point" },
      { key: "tamanTematik", label: "Taman Tematik" },
      { key: "wahanaPermainan", label: "Wahana Permainan / Outbound" },
      { key: "glamping", label: "Glamping & Camping Ground" },
    ],
  },
];

export const AMENITIES: { key: string; label: string; weight: number }[] = [
  { key: "toilet", label: "Toilet Umum Bersih", weight: 12 },
  { key: "ibadah", label: "Tempat Ibadah", weight: 8 },
  { key: "warung", label: "Warung / Rumah Makan", weight: 12 },
  { key: "parkir", label: "Area Parkir Memadai", weight: 10 },
  { key: "posInfo", label: "Pos Informasi Wisata", weight: 10 },
  { key: "listrik", label: "Listrik 24 Jam", weight: 8 },
  { key: "airBersih", label: "Air Bersih", weight: 8 },
  { key: "klinik", label: "Klinik / Puskesmas Terdekat", weight: 8 },
  { key: "sampah", label: "Pengelolaan Sampah Terpadu", weight: 8 },
  { key: "ruangPublik", label: "Taman / Ruang Publik", weight: 4 },
  { key: "wifi", label: "WiFi Area Umum", weight: 4 },
  { key: "atm", label: "Akses ATM / QRIS Meluas", weight: 8 },
];

export const SOCIAL_CHANNELS: { key: string; label: string; weight: number }[] = [
  { key: "instagram", label: "Instagram", weight: 15 },
  { key: "tiktok", label: "TikTok", weight: 12 },
  { key: "facebook", label: "Facebook", weight: 10 },
  { key: "youtube", label: "YouTube", weight: 10 },
  { key: "website", label: "Website Desa Wisata", weight: 15 },
];

export const VISITOR_TIERS: { key: string; label: string; mid: number }[] = [
  { key: "none", label: "Belum ada kunjungan terdata", mid: 0 },
  { key: "lt100", label: "< 100 orang / bulan", mid: 50 },
  { key: "ratusan", label: "100 – 500 orang / bulan", mid: 300 },
  { key: "ribuan", label: "500 – 2.000 orang / bulan", mid: 1200 },
  { key: "ribuanplus", label: "> 2.000 orang / bulan", mid: 3500 },
];

export const HOMESTAY_TIERS: { key: string; label: string }[] = [
  { key: "none", label: "Belum ada" },
  { key: "few", label: "1 – 3 unit" },
  { key: "some", label: "4 – 10 unit" },
  { key: "many", label: "> 10 unit" },
];

export const SIX_A_META: { key: string; label: string; desc: string }[] = [
  { key: "atraksi", label: "Attraction (Atraksi)", desc: "Daya tarik yang menjadi alasan wisatawan datang" },
  { key: "aksesibilitas", label: "Accessibility (Aksesibilitas)", desc: "Kemudahan mencapai destinasi" },
  { key: "amenitas", label: "Amenity (Amenitas)", desc: "Fasilitas pendukung kenyamanan pengunjung" },
  { key: "akomodasi", label: "Accommodation (Akomodasi)", desc: "Ketersediaan tempat menginap" },
  { key: "ancillary", label: "Ancillary (Layanan Pendukung)", desc: "Kelembagaan, SDM, dan layanan pelengkap" },
  { key: "awareness", label: "Awareness (Promosi)", desc: "Kesadaran pasar melalui promosi & citra" },
];

export interface SixAScore {
  key: string;
  label: string;
  score: number; // 0–100
  note: string;
  sub: { label: string; score: number }[];
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MonthPoint {
  month: string;
  visitors: number;
  revenue: number;
}

export interface RevenueScenario {
  key: "konservatif" | "moderat" | "optimistis";
  label: string;
  growthNote: string;
  monthly: MonthPoint[];
  totalVisitors: number;
  totalRevenue: number;
  bumdesRevenue: number;
  jobsEstimate: number;
}

export interface SpendItem {
  label: string;
  amount: number;
}

export interface BrandPalette {
  hex: string;
  name: string;
}

export interface BrandingData {
  themes: string[];
  taglines: string[];
  positioning: string;
  palette: BrandPalette[];
  keywords: string[];
  signatureExperiences: string[];
  packages: { name: string; desc: string }[];
}

export interface TargetMarket {
  segment: string;
  fit: number; // 0–100
  note: string;
}

export interface PriorityItem {
  rank: number;
  component: string;
  title: string;
  detail: string;
  impact: "Tinggi" | "Sedang" | "Rendah";
  effort: "Cepat" | "Menengah" | "Besar";
  timeline: string;
}

export interface RoadmapPhase {
  phase: string;
  period: string;
  title: string;
  focus: string;
  tasks: string[];
}

export interface Recommendation {
  title: string;
  detail: string;
}

export interface KeyMetric {
  label: string;
  value: string;
  tone: "good" | "bad" | "neutral";
}

export interface AnalysisReport {
  generatedAt: string;
  readinessScore: number;
  category: string;
  categoryShort: string;
  categoryDesc: string;
  sixA: SixAScore[];
  swot: SwotData;
  visualSummary: {
    avgBrightness: number;
    avgColorfulness: number;
    avgGreenness: number;
    avgBlueness: number;
    avgQuality: number;
    note: string;
  };
  photos: (PhotoMetric & { verdict: string; tags: string[] })[];
  revenue: {
    avgSpend: number;
    spendBreakdown: SpendItem[];
    scenarios: RevenueScenario[];
    assumptions: string[];
  };
  branding: BrandingData;
  targetMarkets: TargetMarket[];
  priorities: PriorityItem[];
  roadmap: RoadmapPhase[];
  recommendations: Recommendation[];
  keyMetrics: KeyMetric[];
}

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];
