// ─── POTENSIA · Mesin Analisis Desa Wisata ────────────────────────────────
// Mesin skoring deterministik + generasi naratif yang mengubah kuesioner
// & metrik visual foto menjadi laporan strategis lengkap.

import {
  ATTRACTION_GROUPS,
  AMENITIES,
  SOCIAL_CHANNELS,
  VISITOR_TIERS,
  MONTH_LABELS,
  type AnalysisFormInput,
  type AnalysisReport,
  type PhotoMetric,
  type SixAScore,
  type SwotData,
  type RevenueScenario,
  type TargetMarket,
  type PriorityItem,
  type RoadmapPhase,
  type Recommendation,
  type BrandingData,
  type SpendItem,
  type MonthPoint,
} from "./catalog";

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const round = (v: number) => Math.round(v);
const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

function themeOf(attractionKey: string): string {
  for (const g of ATTRACTION_GROUPS) {
    if (g.items.some((i) => i.key === attractionKey)) return g.key;
  }
  return "alam";
}

function labelOf(attractionKey: string): string {
  for (const g of ATTRACTION_GROUPS) {
    const it = g.items.find((i) => i.key === attractionKey);
    if (it) return it.label;
  }
  return attractionKey;
}

// ────────────────────────────────────────────────────────────────────────────
// SKOR 6A
// ────────────────────────────────────────────────────────────────────────────

function scoreAtraksi(f: AnalysisFormInput, photos: PhotoMetric[]): SixAScore {
  const count = f.attractions.length;
  const groups = new Set(f.attractions.map(themeOf));
  const tierMid = VISITOR_TIERS.find((t) => t.key === f.monthlyVisitorsTier)?.mid ?? 0;
  const tierScore = tierMid === 0 ? 8 : tierMid < 100 ? 40 : tierMid < 500 ? 62 : tierMid < 2000 ? 82 : 100;
  const avgQuality = avg(photos.map((p) => p.quality));

  const sVariety = clamp((Math.min(count, 8) / 8) * 100);
  const sUnique = clamp((f.uniqueness / 5) * 100);
  const sDiverse = clamp((Math.min(groups.size, 3) / 3) * 100);
  const sMomentum = tierScore;
  const sVisual = clamp(avgQuality);

  const score = clamp(
    sVariety * 0.26 + sUnique * 0.24 + sMomentum * 0.2 + sDiverse * 0.1 + sVisual * 0.2
  );

  const note =
    score >= 70
      ? `Portofolio ${count} atraksi lintas ${groups.size} tema dengan keunikan ${f.uniqueness}/5 menjadi magnet utama desa.`
      : score >= 45
        ? `Atraksi cukup beragam, namun keunggulan diferensiasi masih perlu dipertajam.`
        : `Daya tarik masih tipis — butuh kurasi cerita dan penajaman satu atraksi unggulan.`;

  return {
    key: "atraksi",
    label: "Attraction",
    score: round(score),
    note,
    sub: [
      { label: "Keragaman daya tarik", score: round(sVariety) },
      { label: "Keunikan & diferensiasi", score: round(sUnique) },
      { label: "Momentum kunjungan", score: round(sMomentum) },
      { label: "Kekuatan visual (foto)", score: round(sVisual) },
      { label: "Keragaman tema", score: round(sDiverse) },
    ],
  };
}

function scoreAksesibilitas(f: AnalysisFormInput): SixAScore {
  const sRoad = clamp((f.roadCondition / 5) * 100);
  const sTransport = f.publicTransport === "good" ? 100 : f.publicTransport === "limited" ? 55 : 12;
  const sSignal = clamp((f.signalQuality / 5) * 100);
  const sSignage = f.signage === "yes" ? 100 : f.signage === "partial" ? 55 : 15;
  const t = f.travelMinutes;
  const sTime = t <= 30 ? 100 : t <= 60 ? 82 : t <= 120 ? 60 : t <= 180 ? 38 : 18;

  const score = clamp(sRoad * 0.3 + sTransport * 0.2 + sSignal * 0.12 + sSignage * 0.13 + sTime * 0.25);

  const note =
    score >= 70
      ? "Konektivitas sehat — desa mudah dijangkau pasar wisatawan kota terdekat."
      : score >= 45
        ? "Akses cukup, tetapi kombinasi jalan & transportasi publik masih menyaring calon pengunjung."
        : "Aksesibilitas adalah ganjalan terbesar: perjalanan panjang dan infrastruktur minim menghambat kunjungan.";

  return {
    key: "aksesibilitas",
    label: "Accessibility",
    score: round(score),
    note,
    sub: [
      { label: "Kondisi jalan", score: round(sRoad) },
      { label: "Transportasi publik", score: round(sTransport) },
      { label: "Waktu tempuh kota", score: round(sTime) },
      { label: "Petunjuk arah", score: round(sSignage) },
      { label: "Sinyal & konektivitas", score: round(sSignal) },
    ],
  };
}

function scoreAmenitas(f: AnalysisFormInput): SixAScore {
  const total = AMENITIES.reduce((a, b) => a + b.weight, 0);
  const got = AMENITIES.filter((a) => f.amenities.includes(a.key)).reduce((a, b) => a + b.weight, 0);
  const score = clamp((got / total) * 100);
  const missing = AMENITIES.filter((a) => !f.amenities.includes(a.key));

  const note =
    score >= 70
      ? "Fasilitas dasar relatif lengkap dan siap menerima tamu dalam jumlah menengah."
      : score >= 45
        ? `Fasilitas setengah jalan — prioritas benahi: ${missing.slice(0, 2).map((m) => m.label.toLowerCase()).join(" & ")}.`
        : "Fasilitas dasar masih sangat terbatas; kenyamanan pengunjung berisiko rendah.";

  const top = AMENITIES.slice(0, 5).map((a) => ({
    label: a.label,
    score: f.amenities.includes(a.key) ? 100 : 0,
  }));

  return {
    key: "amenitas",
    label: "Amenity",
    score: round(score),
    note,
    sub: [...top, { label: `Ketercapaian ${f.amenities.length}/${AMENITIES.length} fasilitas`, score: round(score) }],
  };
}

function scoreAkomodasi(f: AnalysisFormInput): SixAScore {
  const tierScore = { none: 12, few: 46, some: 74, many: 96 }[f.homestayTier];
  const score = clamp(tierScore + (f.camping ? 12 : 0));
  const note =
    f.homestayTier === "none"
      ? "Tanpa akomodasi, desa terjebak menjadi destinasi singgahan singkat (passthrough)."
      : `Akomodasi ${f.homestayTier === "many" ? "memadai" : "mulai tumbuh"}${f.camping ? " ditambah opsi camping/glamping" : ""} — kunci menaikkan lama tinggal.`;
  return {
    key: "akomodasi",
    label: "Accommodation",
    score: round(score),
    note,
    sub: [
      { label: "Ketersediaan homestay", score: round(tierScore) },
      { label: "Alternatif camping/glamping", score: f.camping ? 100 : 0 },
    ],
  };
}

function scoreAncillary(f: AnalysisFormInput): SixAScore {
  const sPok = f.pokdarwis === "active" ? 100 : f.pokdarwis === "formed" ? 60 : 10;
  const sBum = f.bumdes === "active" ? 100 : f.bumdes === "formed" ? 55 : 12;
  const sGuide = clamp((Math.min(f.guideCount, 12) / 12) * 100);
  const sWaste = clamp((f.wasteScore / 5) * 100);
  const sSafe = clamp((f.safetyScore / 5) * 100);
  const sComm = clamp((f.communityScore / 5) * 100);

  const score = clamp(
    sPok * 0.22 + sBum * 0.14 + sGuide * 0.16 + sWaste * 0.16 + sSafe * 0.14 + sComm * 0.18
  );

  const note =
    score >= 70
      ? "Kelembagaan & SDM lokal solid — modal sosial untuk skala naik sudah ada."
      : score >= 45
        ? "Lembaga sudah terbentuk namun kapasitas pengelolaan & SDM pemandu perlu distandarkan."
        : "Kosongnya kelembagaan pengelola membuat perkembangan destinasi rentan berhenti di level proyek.";

  return {
    key: "ancillary",
    label: "Ancillary",
    score: round(score),
    note,
    sub: [
      { label: "Pokdarwis", score: round(sPok) },
      { label: "BUMDes", score: round(sBum) },
      { label: "Pemandu lokal", score: round(sGuide) },
      { label: "Pengelolaan sampah", score: round(sWaste) },
      { label: "Partisipasi warga", score: round(sComm) },
    ],
  };
}

function scoreAwareness(f: AnalysisFormInput): SixAScore {
  const socialTotal = SOCIAL_CHANNELS.reduce((a, b) => a + b.weight, 0);
  const socialGot = SOCIAL_CHANNELS.filter((s) => f.socialMedia.includes(s.key)).reduce((a, b) => a + b.weight, 0);
  const sSocial = clamp((socialGot / socialTotal) * 100);
  const sGov = clamp((f.governmentSupport / 5) * 100);
  const sEvent = f.recurringEvent ? 100 : 0;
  const sPartner = f.travelPartners ? 100 : 0;

  const score = clamp(sSocial * 0.5 + sGov * 0.24 + sEvent * 0.13 + sPartner * 0.13);

  const note =
    score >= 70
      ? "Mesin promosi hidup — desa sudah masuk radar pasar digital."
      : score >= 45
        ? "Promosi sporadis; butuh kalender konten & satu kanal andalan yang konsisten."
        : "Desa nyaris tak terlihat di ruang digital — kesadaran pasar harus dibangun dari nol.";

  return {
    key: "awareness",
    label: "Awareness",
    score: round(score),
    note,
    sub: [
      { label: "Kanal media sosial", score: round(sSocial) },
      { label: "Dukungan pemerintah", score: round(sGov) },
      { label: "Agenda event rutin", score: round(sEvent) },
      { label: "Kemitraan biro wisata", score: round(sPartner) },
    ],
  };
}

// ────────────────────────────────────────────────────────────────────────────
// KATEGORI KESIAPAN
// ────────────────────────────────────────────────────────────────────────────

function categorize(score: number) {
  if (score >= 85)
    return {
      short: "Pionir",
      label: "Pionir — Sangat Siap",
      desc: "Desa berada di garda depan desa wisata nasional: fondasi lengkap, siap dikembangkan sebagai destinasi unggulan dan model percontohan.",
    };
  if (score >= 70)
    return {
      short: "Berkembang",
      label: "Berkembang — Siap",
      desc: "Fondasi pariwisata telah terbentuk. Fokus pada standardisasi layanan, penguatan merek, dan perluasan jangkauan pasar.",
    };
  if (score >= 55)
    return {
      short: "Potensial",
      label: "Potensial — Cukup Siap",
      desc: "Potensi besar sudah terlihat namun beberapa komponen kunci masih ganjal. Periode emas untuk percepatan terarah.",
    };
  if (score >= 40)
    return {
      short: "Tumbuh",
      label: "Tumbuh — Perlu Penguatan",
      desc: "Desa mulai bergerak, namun tata kelola dan fasilitas dasar harus diperkuat sebelum promosi besar-besaran.",
    };
  return {
    short: "Rintisan",
    label: "Rintisan — Pembinaan Awal",
    desc: "Desa berada di titik nol pembinaan. Bangun kelembagaan, kurasi atraksi, dan siapkan warga sebelum membuka keran kunjungan.",
  };
}

// ────────────────────────────────────────────────────────────────────────────
// SWOT
// ────────────────────────────────────────────────────────────────────────────

function buildSwot(f: AnalysisFormInput, sixA: SixAScore[], photos: PhotoMetric[]): SwotData {
  const sorted = [...sixA].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const groups = new Set(f.attractions.map(themeOf));
  const avgGreen = avg(photos.map((p) => p.greenness));
  const avgQuality = avg(photos.map((p) => p.quality));
  const tierMid = VISITOR_TIERS.find((t) => t.key === f.monthlyVisitorsTier)?.mid ?? 0;

  const S: string[] = [
    `${top.label} menjadi komponen terkuat (${top.score}/100) — fondasi utama destinasi saat ini.`,
  ];
  if (groups.has("alam") && groups.has("budaya"))
    S.push("Kombinasi langka daya tarik alam dan budaya hidup dalam satu desa — paket pengalaman yang sulit ditiru kompetitor.");
  if (groups.has("alam") && groups.has("agro"))
    S.push("Perpaduan bentang alam dan aktivitas agro membuka produk wisata edukasi-sepanjang-tahun, tak bergantung satu musim.");
  if (f.uniqueness >= 4)
    S.push(`Daya tarik utama (“${f.mainAttraction || "atraksi unggulan"}”) dinilai berkeunikan tinggi (${f.uniqueness}/5) oleh tim desa.`);
  if (avgGreen >= 55)
    S.push(`Lanskap hijau mendominasi ${round(avgGreen)}% frame foto — aset visual kuat untuk konten pemasaran organik.`);
  if (f.communityScore >= 4)
    S.push(`Partisipasi warga tinggi (${f.communityScore}/5) — modal sosial terpenting desa wisata sudah dimiliki.`);
  if (f.governmentSupport >= 4)
    S.push(`Dukungan pemerintah daerah kuat (${f.governmentSupport}/5), memudahkan advokasi anggaran & program.`);
  if (f.pokdarwis === "active")
    S.push("Pokdarwis telah aktif — roda pengelolaan tidak bergantung satu atau dua tokoh.");
  if (tierMid >= 500)
    S.push(`Basis kunjungan ±${tierMid.toLocaleString("id-ID")} orang/bulan membuktikan pasar sudah mengetuk pintu.`);
  if (f.ticketType === "paid")
    S.push("Skema retribusi berbayar sudah berjalan — desa telah menangkap nilai ekonomi dari kunjungan.");
  if (avgQuality >= 70)
    S.push("Kualitas dokumentasi visual desa sangat baik — materi siap pakai untuk kanal promosi.");

  const W: string[] = [
    `${bottom.label} adalah mata rantai terlemah (${bottom.score}/100) — kebocoran terbesar pengalaman pengunjung.`,
  ];
  if (f.homestayTier === "none")
    W.push("Belum ada satu pun akomodasi — wisatawan dipaksa pulang hari yang sama, belanja lokal minimal.");
  if (f.pokdarwis === "none")
    W.push("Belum ada Pokdarwis — pengelolaan atraksi belum punya nahkoda kelembagaan yang sah.");
  if (f.socialMedia.length <= 1)
    W.push("Jejak digital nyaris kosong; destinasi tak muncul saat calon wisatawan mencari.");
  if (f.guideCount < 3)
    W.push(`Hanya ${f.guideCount} pemandu lokal — kapasitas interpretasi & storytelling sangat terbatas.`);
  if (f.roadCondition <= 2)
    W.push(`Kondisi jalan dinilai ${f.roadCondition}/5 — kesan pertama dan keselamatan dipertaruhkan.`);
  if (f.publicTransport === "none")
    W.push("Tanpa angkutan umum, segmen tanpa kendaraan pribadi (pelajar, backpacker) otomatis tersaring.");
  if (f.amenities.length <= 3)
    W.push("Fasilitas dasar (toilet, warung, parkir, pos info) masih sangat terbatas.");
  if (f.signage === "no")
    W.push("Tidak ada petunjuk arah — pengunjung pertama sering tersesat dan buruk untuk word-of-mouth.");
  if (f.wasteScore <= 2)
    W.push("Pengelolaan sampah lemah — berisiko merusak aset alam yang justru dijual.");
  if (f.travelMinutes > 150)
    W.push(`Waktu tempuh ±${f.travelMinutes} menit dari kota menuntut produk wisata yang benar-benar layak diperjuangkan.`);
  if (f.ticketType === "free" && tierMid >= 300)
    W.push("Arus kunjungan yang sudah ada belum dimonetisasi sama sekali — potensi kas desa menguap.");

  const O: string[] = [
    "Tren wisata minat-khusus, healing, dan slow-living terus tumbuh di pasar domestik — tepat dengan karakter desa.",
  ];
  if (groups.has("agro"))
    O.push("Permintaan wisata edukasi (peternakan, petik buah, farm-to-cup) dari sekolah & keluarga urban melonjak pasca-pandemi.");
  if (groups.has("budaya"))
    O.push("Minat pada wisata budaya otentik dan wellness retreat membuka segmen bernilai tinggi per kunjungan.");
  if (f.attractions.includes("sungai") || f.attractions.includes("airTerjun") || f.attractions.includes("danau"))
    O.push("Aktivitas wisata air (body rafting, susur sungai, tubing) sedang viral di kalangan Gen Z.");
  if (!f.recurringEvent)
    O.push(`Festival tahunan khas ${f.villageName} dapat menjadi magnet kunjungan musiman yang mudah dipasarkan.`);
  O.push("Skema Dana Desa, program ADWI Kemenparekraf, dan CSR perusahaan terbuka untuk pembiayaan infrastruktur & pelatihan.");
  O.push("Algoritma media sosial sedang memihak konten desa yang autentik — biaya akuisisi penonton relatif murah saat ini.");
  if (!f.travelPartners)
    O.push("Biro perjalanan & komunitas (sepeda, gowes, hiking, fotografi) aktif mencari destinasi baru untuk open trip.");

  const T: string[] = [
    "Persaingan antar desa wisata di kawasan yang sama — tanpa diferensiasi, desa mudah tersubstitusi.",
    "Ketergantungan pada musim liburan dan akhir pekan membuat arus kas berdenyut tak stabil.",
  ];
  if (f.attractions.includes("gunungBukit") || f.attractions.includes("airTerjun") || f.attractions.includes("pantai") || f.attractions.includes("sungai"))
    T.push("Atraksi berbasis bentang alam rentan cuaca ekstrem & bencana — SOP keselamatan dan mitigasi wajib ada.");
  T.push("Jika tata kelola tidak transparan dan merata, gejolak sosial & kebocoran ekonomi ke pemodal luar dapat menggerus dukungan warga.");
  if (f.wasteScore <= 3)
    T.push("Tekanan sampah wisata meningkat seiring kunjungan — tanpa sistem, citra desa bisa rusak cepat lewat ulasan negatif.");
  T.push("Konsep desa wisata mudah ditiru tetangga; keunggulan hanya bertahan jika cerita, layanan, dan standar terus diperbarui.");

  return {
    strengths: S.slice(0, 6),
    weaknesses: W.slice(0, 6),
    opportunities: O.slice(0, 6),
    threats: T.slice(0, 6),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// SIMULASI PENDAPATAN
// ────────────────────────────────────────────────────────────────────────────

const SEASONALITY = [0.72, 0.7, 0.82, 0.92, 1.05, 1.12, 1.38, 1.3, 1.02, 0.95, 0.9, 1.42];

function buildRevenue(f: AnalysisFormInput, readiness: number) {
  const tierMid = VISITOR_TIERS.find((t) => t.key === f.monthlyVisitorsTier)?.mid ?? 0;
  const base = tierMid === 0 ? 120 : tierMid; // baseline aktivasi untuk desa baru

  const ticketEffective = f.ticketType === "paid" ? Math.max(f.ticketPrice, 3000) : 8000;
  const kuliner = 24000;
  const oleh2 = 14000;
  const transport = 9000;
  const homestayShare =
    f.homestayTier === "none" ? 0 : f.homestayTier === "few" ? 14400 : f.homestayTier === "some" ? 27000 : 36000;

  const spendBreakdown: SpendItem[] = [
    { label: f.ticketType === "paid" ? "Karcis & retribusi" : "Karcis & retribusi (skenario usulan)", amount: ticketEffective },
    { label: "Kuliner, warung & kafe", amount: kuliner },
    { label: "Oleh-oleh & produk UMKM", amount: oleh2 },
    { label: "Parkir & transport lokal", amount: transport },
    { label: "Alokasi menginap per pengunjung", amount: homestayShare },
  ];
  const avgSpend = spendBreakdown.reduce((a, b) => a + b.amount, 0);

  const r = readiness;
  const scenarios: RevenueScenario[] = (
    [
      { key: "konservatif", label: "Konservatif", growth: 0.3 + r / 300, note: "Promosi jalan alami, tanpa program khusus." },
      { key: "moderat", label: "Moderat", growth: 0.55 + r / 200, note: "Kalender konten aktif + 1 event skala desa per kuartal." },
      { key: "optimistis", label: "Optimistis", growth: 0.85 + r / 140, note: "Eksekusi penuh roadmap: kemitraan biro, festival tahunan, paket bermerek." },
    ] as const
  ).map((s) => {
    const monthly: MonthPoint[] = MONTH_LABELS.map((m, i) => {
      const ramp = 1 + s.growth * ((i + 1) / 12) * 0.5;
      const visitors = round(base * SEASONALITY[i] * ramp);
      return { month: m, visitors, revenue: round(visitors * avgSpend) };
    });
    const totalVisitors = monthly.reduce((a, b) => a + b.visitors, 0);
    const totalRevenue = monthly.reduce((a, b) => a + b.revenue, 0);
    return {
      key: s.key,
      label: s.label,
      growthNote: s.note,
      monthly,
      totalVisitors,
      totalRevenue,
      bumdesRevenue: round(totalRevenue * 0.32),
      jobsEstimate: Math.max(4, round(totalVisitors / 320)),
    };
  });

  const assumptions = [
    `Baseline kunjungan: ${tierMid === 0 ? "aktivasi awal ±120 pengunjung/bulan setelah peluncuran" : `±${tierMid.toLocaleString("id-ID")} pengunjung/bulan dari data saat ini`}.`,
    `Rerata belanja per pengunjung: Rp ${avgSpend.toLocaleString("id-ID")} (karcis, kuliner, oleh-oleh, transport, alokasi menginap).`,
    "Kurva musiman mengikuti pola wisata domestik: puncak Juni–Juli & liburan akhir tahun.",
    `Margin bersih yang layak disisihkan BUMDes diasumsikan 32% dari peredaran bruto.`,
    "Proyeksi 12 bulan pertama — bukan jaminan; akurasi meningkat dengan data kunjungan aktual.",
  ];

  return { avgSpend, spendBreakdown, scenarios, assumptions };
}

// ────────────────────────────────────────────────────────────────────────────
// BRANDING & TARGET PASAR
// ────────────────────────────────────────────────────────────────────────────

const THEME_LABEL: Record<string, string> = {
  alam: "Wisata Alam",
  budaya: "Budaya & Sejarah",
  agro: "Agrowisata",
  buatan: "Atraksi Buatan",
};

function buildBranding(f: AnalysisFormInput): BrandingData {
  const counts: Record<string, number> = { alam: 0, budaya: 0, agro: 0, buatan: 0 };
  f.attractions.forEach((a) => (counts[themeOf(a)] += 1));
  const themes = Object.entries(counts).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const name = f.villageName;
  const primary = themes[0] ?? "alam";
  const secondary = themes[1];

  const taglinePool: Record<string, string[]> = {
    alam: [`Sejuknya ${name}, Hangatnya Warganya`, `Di ${name}, Alam Masih Bercerita`, `${name}: Kembali ke Pelukan Bumi`],
    budaya: [`${name}: Napas Tradisi, Ramahnya Jiwa`, `Warisan Hidup dari ${name}`, `Melangkah Masuk ke Zaman yang Asri`],
    agro: [`${name}: Petik Cerita, Petik Rezeki`, `Dari Ladang ${name} ke Hati`, `Keceriaan Panen Sepanjang Tahun`],
    buatan: [`${name}: Ruang Ceria Keluarga`, `Gerbang Bahagia ${name}`, `Dunia Baru di Tepian Desa`],
  };
  const mixLine = `Pesona ${name}: ${THEME_LABEL[primary] === "Wisata Alam" ? "Asri Alamnya" : THEME_LABEL[primary]}${secondary ? `, ${secondary === "budaya" ? "Kental Budayanya" : secondary === "agro" ? "Subur Alamnya" : "Seru Wahana"}` : ""}`;
  const taglines = [...taglinePool[primary], mixLine].slice(0, 3);

  const paletteByTheme: Record<string, { hex: string; name: string }[]> = {
    alam: [
      { hex: "#1E5138", name: "Hutan Pinus" },
      { hex: "#7FAE6D", name: "Daun Muda" },
      { hex: "#E2932C", name: "Pagi Terasering" },
      { hex: "#F4EFE3", name: "Kabut Desa" },
    ],
    budaya: [
      { hex: "#7A2E1D", name: "Bata Tradisi" },
      { hex: "#E2932C", name: "Emas Upacara" },
      { hex: "#173E2C", name: "Lurik Malam" },
      { hex: "#F4EFE3", name: "Kertas Lontar" },
    ],
    agro: [
      { hex: "#2F5D34", name: "Kebun" },
      { hex: "#B9D989", name: "Tunas" },
      { hex: "#C05B2C", name: "Tanah Subur" },
      { hex: "#F4EFE3", name: "Susu Pagi" },
    ],
    buatan: [
      { hex: "#173E2C", name: "Pekat" },
      { hex: "#E2932C", name: "Ceria" },
      { hex: "#7FAE6D", name: "Segar" },
      { hex: "#F4EFE3", name: "Kanvas" },
    ],
  };

  const keywordsByTheme: Record<string, string[]> = {
    alam: ["Asri", "Menenangkan", "Lestari", "Segar"],
    budaya: ["Otentik", "Hangat", "Penuh Cerita", "Sakral"],
    agro: ["Subur", "Edukasi", "Panen", "Gotong Royong"],
    buatan: ["Ceria", "Keluarga", "Instagramable", "Modern"],
  };

  const experienceByAttraction: Record<string, string> = {
    airTerjun: "Trekking pagi berkabut menuju air terjun tersembunyi",
    pantai: "Senja perahu nelayan & pasar ikan sore hari",
    gunungBukit: "Sunrise point & kopi pagi di punggung bukit",
    sungai: "Susur sungai / body rafting dengan pemandu warga",
    danau: "Kano tenang menyibak kabut di atas danau",
    hutan: "Tur edukasi hutan & pengamatan burung endemik",
    terasering: "Berjalan di pematang terasering saat matahari terbit",
    gua: "Eksplorasi gua bersama pemandu bersertifikat",
    rumahAdat: "Menginap & belajar tata ruang rumah adat",
    upacaraAdat: "Menyaksikan ritual adat dengan penerjemah budaya",
    seniPertunjukan: "Pentas seni warga & kelas tari singkat",
    kerajinan: "Lokakarya membuat kerajinan bersama perajin",
    kuliner: "Pasar kuliner sore & dapur bersama warga",
    situsSejarah: "Tur cerita situs sejarah bersama juru kunci",
    perkebunan: "Tur petik–sangrai–seduh dari kebun ke cangkir",
    peternakan: "Memberi pakan & memerah susu bersama peternak",
    perikanan: "Mancing bareng & bakar hasil tangkapan",
    kebunBuah: "Petik buah musiman langsung dari pohon",
    hortikultura: "Kelas berkebun singkat & bawa pulang hasilnya",
    spotFoto: "Jalur berburu spot foto ikonik desa",
    tamanTematik: "Piknik keluarga di taman tematik",
    wahanaPermainan: "Paket outbound & permainan tim",
    glamping: "Berkemah bintang lima di antara kebun warga",
  };
  const experiences = f.attractions
    .map((a) => experienceByAttraction[a])
    .filter(Boolean)
    .slice(0, 5);
  if (experiences.length === 0) experiences.push("Tur jalan kaki menyapa pagi desa bersama pemandu warga");

  const packages = [
    { name: `Seharian di ${name}`, desc: "Open trip 1 hari: atraksi unggulan + makan siang rumahan + cinderamata." },
    { name: `Tinggal di ${name} (2H1M)`, desc: `Menginap di homestay warga, ikut aktivitas harian ${primary === "agro" ? "kebun" : primary === "budaya" ? "sanggar" : "desa"}, pulang membawa cerita.` },
    { name: `Kelas Desa ${name}`, desc: "Paket edukasi sekolah/komunitas: belajar langsung dari warga, penuh praktik." },
  ];

  const positioning =
    `Posisikan ${name} sebagai "${primary === "alam" ? "pelarian hijau" : primary === "budaya" ? "jendela budaya hidup" : primary === "agro" ? "ruang belajar panen" : "taman bermain ala desa"}${secondary ? ` yang dibalut ${THEME_LABEL[secondary].toLowerCase()}` : ""} untuk pasar ${f.travelMinutes <= 90 ? "kota-kota di sekitarnya" : "minat khusus yang rela menempuh perjalanan"}. ` +
    `Cerita utama: ${f.mainAttraction ? `“${f.mainAttraction}”` : "atraksi unggulan desa"} — jual satu alasan kuat untuk datang, bukan daftar panjang fasilitas.`;

  return {
    themes: themes.map((t) => THEME_LABEL[t]),
    taglines,
    positioning,
    palette: paletteByTheme[primary],
    keywords: [...keywordsByTheme[primary], "Ramah"],
    signatureExperiences: experiences,
    packages,
  };
}

function buildTargetMarkets(f: AnalysisFormInput, sixA: SixAScore[]): TargetMarket[] {
  const has = (k: string) => f.attractions.includes(k);
  const agro = f.attractions.filter((a) => themeOf(a) === "agro").length;
  const budaya = f.attractions.filter((a) => themeOf(a) === "budaya").length;
  const alam = f.attractions.filter((a) => themeOf(a) === "alam").length;
  const buatan = f.attractions.filter((a) => themeOf(a) === "buatan").length;
  const amenity = sixA.find((s) => s.key === "amenitas")?.score ?? 0;
  const akomodasi = sixA.find((s) => s.key === "akomodasi")?.score ?? 0;
  const akses = sixA.find((s) => s.key === "aksesibilitas")?.score ?? 0;

  return [
    {
      segment: "Keluarga & Komunitas Urban",
      fit: round(clamp(34 + f.safetyScore * 7 + amenity * 0.28 + (has("tamanTematik") || has("wahanaPermainan") || has("spotFoto") ? 14 : 0) + buatan * 4, 20, 96)),
      note: "Mencari destinasi aman, fasilitas jelas, cocok akhir pekan bersama anak.",
    },
    {
      segment: "Gen Z & Pasangan Muda",
      fit: round(clamp(30 + alam * 9 + (has("spotFoto") ? 18 : 0) + (f.socialMedia.length >= 2 ? 10 : 0) + akses * 0.1, 20, 97)),
      note: "Pemburu konten & pengalaman estetik; penentu viral tidaknya sebuah destinasi.",
    },
    {
      segment: "Wisatawan Minat Khusus (Hiking · Foto · Sepeda)",
      fit: round(clamp(26 + (has("gunungBukit") ? 22 : 0) + (has("hutan") ? 16 : 0) + (has("airTerjun") ? 14 : 0) + (has("terasering") ? 12 : 0) + (has("sungai") ? 10 : 0), 20, 96)),
      note: "Rela menempuh jarak jauh demi trek & komposisi visual yang autentik.",
    },
    {
      segment: "Sekolah & Wisata Edukasi",
      fit: round(clamp(24 + agro * 12 + budaya * 8 + f.guideCount * 2 + (has("upacaraAdat") ? 8 : 0), 20, 95)),
      note: "Pasar rombongan besar berulang; butuh kurikulum kunjungan & pemandu siap.",
    },
    {
      segment: "Korporat & Komunitas (Outbound)",
      fit: round(clamp(22 + (has("wahanaPermainan") ? 22 : 0) + (has("glamping") ? 12 : 0) + akomodasi * 0.22 + f.guideCount * 2, 20, 94)),
      note: "Budget besar per kepala, datang di hari kerja — penyeimbang musiman.",
    },
    {
      segment: "Wisatawan Mancanegara (Backpacker & Slow Travel)",
      fit: round(clamp(14 + budaya * 9 + alam * 6 + (f.homestayTier !== "none" ? 14 : 0) + f.guideCount * 2, 12, 90)),
      note: "Belanja per hari tinggi; menuntut homestay layak, pemandu dwibahasa, cerita kuat.",
    },
  ].sort((a, b) => b.fit - a.fit);
}

// ────────────────────────────────────────────────────────────────────────────
// PRIORITAS, ROADMAP, REKOMENDASI
// ────────────────────────────────────────────────────────────────────────────

function buildPriorities(f: AnalysisFormInput, sixA: SixAScore[]): PriorityItem[] {
  const sorted = [...sixA].sort((a, b) => a.score - b.score);
  const items: PriorityItem[] = [];
  const name = mainTitle(f);

  const templates: Record<string, (f: AnalysisFormInput) => PriorityItem> = {
    ancillary: (f) => ({
      rank: 0,
      component: "Ancillary",
      title:
        f.pokdarwis === "none"
          ? "Bentuk Pokdarwis & satukan kelembagaan pengelola"
          : "Standarkan layanan & perbanyak pemandu lokal tersertifikasi",
      detail:
        f.pokdarwis === "none"
          ? `SK-kan Pokdarwis ${name} (minimal 11 anggota lintas generasi & gender), tetapkan pengurus, SOP piket, dan rekening kas bersama BUMDes. Tanpa ini, semua inisiatif akan berhenti di level relawan.`
          : `Rekrut & latih minimal 10 pemandu muda (storytelling dasar, P3K, bahasa Inggris wisata). Uji sertifikasi via dinas/LSPr.`,
      impact: "Tinggi",
      effort: f.pokdarwis === "none" ? "Cepat" : "Menengah",
      timeline: "0–3 bulan",
    }),
    awareness: () => ({
      rank: 0,
      component: "Awareness",
      title: "Bangun mesin promosi digital & identitas visual",
      detail: `Rilis Instagram + TikTok/Website ${name}, tetapkan identitas visual konsisten, pasang kalender konten mingguan (3–5 unggahan), dan kumpulkan 30 foto/10 video stok terbaik. Kirim undangan familiarization trip ke 5 kreator lokal.`,
      impact: "Tinggi",
      effort: "Cepat",
      timeline: "0–3 bulan",
    }),
    akomodasi: (f) => ({
      rank: 0,
      component: "Accommodation",
      title: f.homestayTier === "none" ? "Kembangkan program homestay desa tahap pertama" : "Tingkatkan kualitas & kapasitas akomodasi",
      detail:
        f.homestayTier === "none"
          ? "Kurasi 5–10 rumah warga memenuhi standar CHSE (bersih, sehat, aman, ramah lingkungan), seragamkan tarif & cara pesan, latih tuan rumah. Mulai dari paket 2H1M guna mengerek lama tinggal tamu."
          : "Standarkan servis (checklist linen, sarapan khas, SOP keluhan), pasang end-to-end booking sederhana (WhatsApp terpusat), dan pertimbangkan 1 unit glamping asal sesuai tata ruang.",
      impact: "Tinggi",
      effort: "Besar",
      timeline: "3–12 bulan",
    }),
    amenitas: (f) => ({
      rank: 0,
      component: "Amenity",
      title: "Benahi fasilitas dasar paling terasa pengunjung",
      detail: `Prioritaskan: ${AMENITIES.filter((a) => !f.amenities.includes(a.key)).slice(0, 3).map((m) => m.label.toLowerCase()).join(", ") || "pemeliharaan fasilitas existing"}. Toilet bersih & tempat sampah memengaruhi ulasan lebih keras daripada wahana baru.`,
      impact: "Tinggi",
      effort: "Menengah",
      timeline: "3–9 bulan",
    }),
    aksesibilitas: (f) => ({
      rank: 0,
      component: "Accessibility",
      title: f.roadCondition <= 2 ? "Advokasi perbaikan akses & rambu menuju desa" : "Perkuat navigasi & kenyamanan perjalanan",
      detail:
        (f.roadCondition <= 2 ? "Usulkan peningkatan jalan melalui musrenbang kecamatan, didukung data potensi ekonomi dari laporan ini. " : "") +
        "Pasang totem & petunjuk arah dari simpul jalan utama, susun peta digital (Google Maps + titik temu jelas), dan sediakan lencana parkir bregada jelas.",
      impact: "Sedang",
      effort: "Besar",
      timeline: "6–12 bulan",
    }),
    atraksi: (f) => ({
      rank: 0,
      component: "Attraction",
      title: "Kemas ulang atraksi unggulan menjadi pengalaman bermerek",
      detail: `Alih-alih menambah wahana baru, kemas “${f.mainAttraction || "atraksi unggulan"}” menjadi pengalaman berdurasi 2–3 jam dengan alur jelas (sambutan → interpretasi → aktivitas → momen khas → tutup). Tambahkan satu signature photo-moment.`,
      impact: "Tinggi",
      effort: "Menengah",
      timeline: "3–6 bulan",
    }),
  };

  for (const s of sorted) {
    if (items.length >= 5) break;
    const maker = templates[s.key];
    if (maker) items.push({ ...maker(f), rank: items.length + 1 });
  }
  return items;
}

function mainTitle(f: AnalysisFormInput): string {
  return f.villageName;
}

function buildRoadmap(f: AnalysisFormInput, readiness: number, branding: BrandingData): RoadmapPhase[] {
  const name = f.villageName;
  const p1: string[] = [];
  if (f.pokdarwis === "none") p1.push(`Bentuk & SK-kan Pokdarwis ${name}; aktifkan peran BUMDes sebagai kaki ekonomi (kas, retribusi, unit usaha).`);
  else p1.push("Segarkan struktur Pokdarwis: pembagian peran jelas, jadwal piket, dan kanal WhatsApp terpusat untuk reservasi.");
  if (f.socialMedia.length <= 1) p1.push(`Rilis kanal Instagram & TikTok ${name}; unggah konsisten 3–5 konten/minggu memakai identitas visual yang disarankan.`);
  if (!f.amenities.includes("toilet")) p1.push("Bangun/renovasi toilet publik standar bersih di titik kumpul atraksi utama.");
  if (f.signage !== "yes") p1.push("Pasang petunjuk arah minimal dari 3 simpul jalan utama + totem selamat datang beridentitas desa.");
  if (f.wasteScore <= 3) p1.push("Operasikan sistem pilah sampah sederhana: bak pilah di titik wisata, jadwal angkut, bank sampah warga.");
  p1.push(`Soft-launch atraksi unggulan (“${f.mainAttraction || "atraksi utama"}”) via open trip komunitas/undangan kreator; kumpulkan testimoni & foto UGC.`);
  if (f.ticketType === "free") p1.push("Uji retribusi sukarela/karcis festival Rp 5.000–10.000 sebagai percobaan monetisasi pertama.");
  p1.push("Pasang buku tamu digital (formulir QR) untuk membangun baseline data pengunjung sejak hari pertama.");

  const p2: string[] = [
    `Luncurkan 3 paket bermerek (“${branding.packages[0].name}”, “${branding.packages[1].name}”, “${branding.packages[2].name}”) lengkap dengan tarif & SOP kunjungan.`,
  ];
  if (f.homestayTier === "none" || f.homestayTier === "few") p2.push("Kembangkan homestay CHSE: mulai 5–10 kamar tersebar di rumah warga, tarif & booking diseragamkan BUMDes.");
  else p2.push("Standarkan mutu akomodasi existing: checklist kebersihan, sarapan khas, dan kanal booking terpusat.");
  p2.push("Sertifikasi minimal 10 pemandu lokal (pelatihan HPI/LSPr dasar, P3K, dan storytelling).");
  if (!f.recurringEvent) p2.push(`Rancang festival tahunan ${name}: satu tanggal ikonik, satu agenda budaya/alam khas, dipromosikan 3 bulan ke depan.`);
  p2.push("Bangun kemitraan dengan 5 biro perjalanan & komunitas (gowes, hiking, fotografi) untuk kunjungan terjadwal.");
  if (f.roadCondition <= 2) p2.push("Advokasi peningkatan jalan via musrenbang; siapkan data kunjungan & potensi ekonomi sebagai amunisi pengajuan.");
  if (!f.amenities.includes("klinik")) p2.push("Siapkan titik P3K & pos siaga di atraksi utama, termasuk jalur evakuasi darurat.");

  const p3: string[] = [
    readiness >= 55
      ? "Ajukan desa ke Anugerah Desa Wisata Indonesia (ADWI) & program prioritas Kemenparekraf/Kemendesa."
      : "Naikkan kelas bertahap: kejar standar pengelolaan desa wisata Kemenparekraf sebelum mendaftar ADWI.",
    "Digitalisasi penuh: e-ticketing, dashboard kunjungan real-time, evaluasi bulanan berbasis data.",
    "Terapkan manajemen daya dukung (carrying capacity): batas kunjungan harian, zonasi keramaian-ketenangan, aturan konservasi.",
    "Bangun unit usaha turunan: kuliner kemasan, merchandise identitas desa, dan jasa dokumentasi wisata.",
    "Audit kualitas layanan tahunan oleh pihak eksternal + publikasi laporan dampak kepada warga (transparansi hasil).",
  ];

  return [
    {
      phase: "Fase 1",
      period: "Bulan 0–3",
      title: "Fondasi & Peluncuran Cepat",
      focus: "Kelembagaan sah, wajah digital hadir, quick wins yang terasa warga.",
      tasks: p1.slice(0, 7),
    },
    {
      phase: "Fase 2",
      period: "Bulan 3–12",
      title: "Produk & Layanan Terstandar",
      focus: "Paket bermerek, homestay hidup, SDM tersertifikasi, kemitraan mulai mengalir.",
      tasks: p2.slice(0, 7),
    },
    {
      phase: "Fase 3",
      period: "Tahun 1–3",
      title: "Naik Kelas & Berkelanjutan",
      focus: "Pengakuan nasional, digitalisasi penuh, keberlanjutan lingkungan dan ekonomi.",
      tasks: p3.slice(0, 5),
    },
  ];
}

function buildRecommendations(f: AnalysisFormInput, sixA: SixAScore[], branding: BrandingData, readiness: number): Recommendation[] {
  const recs: Recommendation[] = [
    {
      title: "Pegang satu cerita besar, jangan jual semuanya",
      detail: `Gunakan “${f.mainAttraction || branding.signatureExperiences[0]}” sebagai alasan utama datang ke ${f.villageName}; kemampuan lain menjadi kejutan yang memperpanjang cerita. Tagline arahan: “${branding.taglines[0]}”.`,
    },
    {
      title: "Aktifkan retribusi sebagai instrumen, bukan penghalang",
      detail:
        f.ticketType === "paid"
          ? `Pertahankan karcis Rp ${f.ticketPrice.toLocaleString("id-ID")}, tetapi pecah menjadi komponen transparan (karcis, parkir, paket) dan tampilkan ke mana uang mengalir (papan dampak desa) untuk membangun kepercayaan.`
          : `Mulai karcis digital sederhana Rp 8.000–12.000 per pengunjung; berikan nilai terasa (gelang, air minum, peta) agar kenaikan tidak terasa sebagai pajak.`,
    },
    {
      title: "Jadikan konten sebagai jalan masuk pasar termurah",
      detail: `Foto menunjukkan aset visual ${avgName(sixA)} yang layak dipoles. Terapkan ritme 3–5 konten/minggu: reels suasana, UGC pengunjung, dan cerita warga. Undang 5 kreator lokal untuk famtrip berbayar-barter.`,
    },
    {
      title: "Bangun paket dengan jangkar harga berlapis",
      detail: `Siapkan 3 level: Rp 25–50rb (pengalaman singkat), Rp 150–300rb (${branding.packages[0].name}), dan Rp 600rb–1,2jt (${branding.packages[1].name} termasuk homestay). Paket tengah biasanya terlaris — desain ia menjadi yang paling menarik.`,
    },
    {
      title: "Kelola lewat data sejak hari pertama",
      detail: "Foto buku tamu/QR check-in, catat belanja rata-rata sederhana, dan adakan evaluasi bulanan Pokdarwis–BUMDes berbasis angka. Keputusan besar tak lagi pakai perasaan.",
    },
    {
      title: "Kunci kemitraan kunci, bukan ramai-ramai",
      detail: "Dua tipe partner cukup: biro perjalanan/komunitas untuk arus pengunjung terjadwal, dan kampus/dinas untuk pelatihan & volunteer. Tanda tangani satu MoU berdampak per kuartal.",
    },
    {
      title: readiness >= 55 ? "Desa sudah pantas naik panggung nasional" : "Selesaikan fondasi sebelum panggung nasional",
      detail:
        readiness >= 55
          ? "Dokumentasikan capaian, susun profil video 3 menit, dan daftarkan desa ke ADWI/perangkat pengakuan wisata lokal untuk membuka akses program & legitimasi."
          : "Selesaikan dulu tiga hal: kelembagaan aktif, fasilitas dasar bersih, dan satu atraksi bermerek — baru kemudian kembangkan promosi besar & ajukan penghargaan.",
    },
  ];
  return recs;
}

function avgName(sixA: SixAScore[]): string {
  const atr = sixA.find((s) => s.key === "atraksi");
  return atr && atr.score >= 50 ? "yang kuat" : "yang perlu difoto ulang dengan cahaya terbaik";
}

// ────────────────────────────────────────────────────────────────────────────
// ENTRY POINT
// ────────────────────────────────────────────────────────────────────────────

export function runAnalysis(f: AnalysisFormInput, photos: PhotoMetric[]): AnalysisReport {
  const sixA: SixAScore[] = [
    scoreAtraksi(f, photos),
    scoreAksesibilitas(f),
    scoreAmenitas(f),
    scoreAkomodasi(f),
    scoreAncillary(f),
    scoreAwareness(f),
  ];

  const weights: Record<string, number> = {
    atraksi: 0.2,
    aksesibilitas: 0.17,
    amenitas: 0.16,
    akomodasi: 0.12,
    ancillary: 0.15,
    awareness: 0.2,
  };
  const readiness = round(sixA.reduce((a, s) => a + s.score * weights[s.key], 0));
  const cat = categorize(readiness);

  const swot = buildSwot(f, sixA, photos);
  const revenue = buildRevenue(f, readiness);
  const branding = buildBranding(f);
  const targetMarkets = buildTargetMarkets(f, sixA);
  const priorities = buildPriorities(f, sixA);
  const roadmap = buildRoadmap(f, readiness, branding);
  const recommendations = buildRecommendations(f, sixA, branding, readiness);

  const sorted = [...sixA].sort((a, b) => b.score - a.score);
  const moderat = revenue.scenarios[1];
  const avgQuality = round(avg(photos.map((p) => p.quality)));

  const keyMetrics: AnalysisReport["keyMetrics"] = [
    { label: "Skor Visual Foto", value: `${avgQuality}/100`, tone: avgQuality >= 60 ? "good" : avgQuality >= 40 ? "neutral" : "bad" },
    { label: "Komponen Terkuat", value: sorted[0].label, tone: "good" },
    { label: "Komponen Terlemah", value: sorted[sorted.length - 1].label, tone: "bad" },
    { label: "Estimasi Pendapatan Thn-1", value: `Rp ${(moderat.totalRevenue / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`, tone: "neutral" },
  ];

  const green = avg(photos.map((p) => p.greenness));
  const visualNote =
    green >= 55
      ? `Frame foto didominasi vegetasi hijau (${round(green)}%) — desa membaca kuat sebagai destinasi alam. Pertahankan tajuk visual ini pada semua kanal promosi.`
      : green >= 35
        ? `Komposisi visual seimbang antara alam dan unsur binaan. Varikan sudut foto untuk memperkuat cerita desa.`
        : `Foto cenderung didominasi unsur binaan/abu-abu (${round(100 - green)}% non-vegetatif). Tambahkan dokumentasi lanskap & aktivitas warga untuk memperkuat citra desa wisata.`;

  const photoVerdict = photos.map((p) => {
    const tags: string[] = [];
    if (p.greenness >= 60) tags.push("Vegetasi Dominan");
    if (p.blueness >= 58) tags.push("Tonal Langit/Air Kuat");
    if (p.colorfulness >= 62) tags.push("Kaya Warna");
    if (p.brightness < 32) tags.push("Pencahayaan Rendah");
    if (p.brightness > 78) tags.push("Sangat Terang");
    if (tags.length === 0) tags.push("Komposisi Seimbang");
    const verdict =
      p.quality >= 75 ? "Sangat kuat untuk pemasaran" : p.quality >= 58 ? "Kuat" : p.quality >= 42 ? "Cukup" : "Perlu foto ulang";
    return { ...p, verdict, tags };
  });

  return {
    generatedAt: new Date().toISOString(),
    readinessScore: readiness,
    category: cat.label,
    categoryShort: cat.short,
    categoryDesc: cat.desc,
    sixA,
    swot,
    visualSummary: {
      avgBrightness: round(avg(photos.map((p) => p.brightness))),
      avgColorfulness: round(avg(photos.map((p) => p.colorfulness))),
      avgGreenness: round(green),
      avgBlueness: round(avg(photos.map((p) => p.blueness))),
      avgQuality,
      note: visualNote,
    },
    photos: photoVerdict,
    revenue,
    branding,
    targetMarkets,
    priorities,
    roadmap,
    recommendations,
    keyMetrics,
  };
}

export function validatePayload(raw: unknown): { ok: true; data: AnalysisFormInput } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) return { ok: false, error: "Payload tidak valid." };
  const r = raw as Record<string, unknown>;

  const str = (k: string, min = 1, max = 500): string | null => {
    const v = r[k];
    if (typeof v !== "string") return null;
    const t = v.trim();
    return t.length >= min && t.length <= max ? t : null;
  };
  const num = (k: string, min = 0, max = 1_000_000_000): number | null => {
    const v = Number(r[k]);
    return Number.isFinite(v) && v >= min && v <= max ? v : null;
  };
  const arr = (k: string): string[] => (Array.isArray(r[k]) ? (r[k] as unknown[]).filter((x): x is string => typeof x === "string") : []);

  const villageName = str("villageName", 2, 120);
  const district = str("district", 2, 120);
  const city = str("city", 2, 120);
  const province = str("province", 2, 120);
  const description = str("description", 30, 2000);
  if (!villageName || !district || !city || !province || !description)
    return { ok: false, error: "Lengkapi identitas desa & deskripsi minimal 30 karakter." };

  const population = num("population", 0, 50_000_000) ?? 0;
  const areaHa = num("areaHa", 0, 10_000_000) ?? 0;
  const contactEmail = str("contactEmail", 0, 120) || undefined;

  const attractionKeys = new Set(ATTRACTION_GROUPS.flatMap((g) => g.items.map((i) => i.key)));
  const attractions = arr("attractions").filter((a) => attractionKeys.has(a));
  if (attractions.length === 0) return { ok: false, error: "Pilih minimal satu jenis daya tarik desa." };

  const uniqueness = num("uniqueness", 1, 5) ?? 3;
  const tierKeys = VISITOR_TIERS.map((t) => t.key);
  const monthlyVisitorsTier = tierKeys.includes(String(r.monthlyVisitorsTier)) ? String(r.monthlyVisitorsTier) : "none";
  const ticketType = r.ticketType === "paid" ? "paid" : "free";
  const ticketPrice = num("ticketPrice", 0, 1_000_000) ?? 0;

  const roadCondition = num("roadCondition", 1, 5) ?? 3;
  const publicTransport = r.publicTransport === "good" || r.publicTransport === "limited" ? r.publicTransport : "none";
  const distanceToCityKm = num("distanceToCityKm", 0, 5000) ?? 0;
  const travelMinutes = num("travelMinutes", 0, 2000) ?? 0;
  const signalQuality = num("signalQuality", 1, 5) ?? 3;
  const signage = r.signage === "yes" || r.signage === "partial" ? r.signage : "no";

  const amenityKeys = new Set(AMENITIES.map((a) => a.key));
  const amenities = arr("amenities").filter((a) => amenityKeys.has(a));
  const homestayTier = ["none", "few", "some", "many"].includes(String(r.homestayTier)) ? (String(r.homestayTier) as AnalysisFormInput["homestayTier"]) : "none";
  const camping = Boolean(r.camping);

  const pokdarwis = r.pokdarwis === "active" || r.pokdarwis === "formed" ? r.pokdarwis : "none";
  const bumdes = r.bumdes === "active" || r.bumdes === "formed" ? r.bumdes : "none";
  const guideCount = num("guideCount", 0, 500) ?? 0;
  const wasteScore = num("wasteScore", 1, 5) ?? 3;
  const safetyScore = num("safetyScore", 1, 5) ?? 3;
  const communityScore = num("communityScore", 1, 5) ?? 3;

  const socialKeys = new Set(SOCIAL_CHANNELS.map((s) => s.key));
  const socialMedia = arr("socialMedia").filter((s) => socialKeys.has(s));
  const governmentSupport = num("governmentSupport", 1, 5) ?? 3;
  const recurringEvent = Boolean(r.recurringEvent);
  const travelPartners = Boolean(r.travelPartners);

  return {
    ok: true,
    data: {
      villageName,
      district,
      city,
      province,
      population,
      areaHa,
      description,
      contactEmail,
      attractions,
      mainAttraction: str("mainAttraction", 0, 160) ?? "",
      uniqueness,
      monthlyVisitorsTier,
      ticketType,
      ticketPrice,
      roadCondition,
      publicTransport,
      distanceToCityKm,
      travelMinutes,
      signalQuality,
      signage,
      amenities,
      homestayTier,
      camping,
      pokdarwis,
      bumdes,
      guideCount,
      wasteScore,
      safetyScore,
      communityScore,
      socialMedia,
      governmentSupport,
      recurringEvent,
      travelPartners,
    },
  };
}
