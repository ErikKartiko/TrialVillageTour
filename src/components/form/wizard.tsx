"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, MapPinned, Sparkles, Route,
  TentTree, Camera, ClipboardCheck, LoaderCircle, ImagePlus, X,
  AlertTriangle, PartyPopper,
} from "lucide-react";
import {
  Field, TextInput, NumberInput, TextArea, Rating, RadioCards, CheckChips, Toggle,
} from "@/components/form/fields";
import {
  ATTRACTION_GROUPS, AMENITIES, SOCIAL_CHANNELS, VISITOR_TIERS, HOMESTAY_TIERS,
} from "@/lib/analysis/catalog";

// ─── State awal ─────────────────────────────────────────────────────────────
interface PhotoItem {
  file: File;
  preview: string;
}

const STEPS = [
  { key: "identitas", label: "Identitas", icon: MapPinned },
  { key: "atraksi", label: "Atraksi", icon: Sparkles },
  { key: "akses", label: "Akses", icon: Route },
  { key: "fasilitas", label: "Fasilitas", icon: TentTree },
  { key: "foto", label: "Foto", icon: Camera },
  { key: "kirim", label: "Kirim", icon: ClipboardCheck },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Wizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Langkah 1
  const [villageName, setVillageName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [population, setPopulation] = useState("");
  const [areaHa, setAreaHa] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [description, setDescription] = useState("");

  // Langkah 2
  const [attractions, setAttractions] = useState<string[]>([]);
  const [mainAttraction, setMainAttraction] = useState("");
  const [uniqueness, setUniqueness] = useState(3);
  const [monthlyVisitorsTier, setMonthlyVisitorsTier] = useState("none");
  const [ticketType, setTicketType] = useState<"free" | "paid">("free");
  const [ticketPrice, setTicketPrice] = useState("10000");

  // Langkah 3
  const [roadCondition, setRoadCondition] = useState(3);
  const [publicTransport, setPublicTransport] = useState<"good" | "limited" | "none">("limited");
  const [distanceToCityKm, setDistanceToCityKm] = useState("35");
  const [travelMinutes, setTravelMinutes] = useState("60");
  const [signalQuality, setSignalQuality] = useState(3);
  const [signage, setSignage] = useState<"yes" | "partial" | "no">("partial");

  // Langkah 4
  const [amenities, setAmenities] = useState<string[]>(["toilet", "ibadah"]);
  const [homestayTier, setHomestayTier] = useState<"none" | "few" | "some" | "many">("none");
  const [camping, setCamping] = useState(false);
  const [pokdarwis, setPokdarwis] = useState<"active" | "formed" | "none">("none");
  const [bumdes, setBumdes] = useState<"active" | "formed" | "none">("formed");
  const [guideCount, setGuideCount] = useState("0");
  const [wasteScore, setWasteScore] = useState(3);
  const [safetyScore, setSafetyScore] = useState(3);
  const [communityScore, setCommunityScore] = useState(3);
  const [socialMedia, setSocialMedia] = useState<string[]>([]);
  const [governmentSupport, setGovernmentSupport] = useState(3);
  const [recurringEvent, setRecurringEvent] = useState(false);
  const [travelPartners, setTravelPartners] = useState(false);

  // Langkah 5
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // ── Validasi per langkah ─────────────────────────────────────────────────
  const stepValid = useMemo((): boolean => {
    switch (step) {
      case 0:
        return (
          villageName.trim().length >= 2 &&
          province.trim().length >= 2 &&
          city.trim().length >= 2 &&
          district.trim().length >= 2 &&
          description.trim().length >= 30
        );
      case 1:
        return attractions.length > 0;
      case 4:
        return photos.length >= 3;
      default:
        return true;
    }
  }, [step, villageName, province, city, district, description, attractions, photos]);

  const invalidHint = useMemo(() => {
    if (step === 0) return "Lengkapi nama desa & wilayah, serta deskripsi minimal 30 karakter.";
    if (step === 1) return "Pilih minimal satu jenis daya tarik desa.";
    if (step === 4) return `Unggah minimal 3 foto desa (saat ini ${photos.length}).`;
    return "";
  }, [step, photos]);

  // ── Foto ─────────────────────────────────────────────────────────────────
  const addFiles = (list: FileList | File[]) => {
    const incoming = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const room = 8 - photos.length;
    const accepted = incoming.slice(0, Math.max(room, 0));
    if (accepted.length < incoming.length) setError("Maksimal 8 foto per analisis.");
    else setError(null);
    setPhotos((prev) => [
      ...prev,
      ...accepted.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removePhoto = (i: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        villageName, province, city, district,
        population: Number(population) || 0,
        areaHa: Number(areaHa) || 0,
        contactEmail: contactEmail || undefined,
        description,
        attractions, mainAttraction, uniqueness, monthlyVisitorsTier, ticketType,
        ticketPrice: Number(ticketPrice) || 0,
        roadCondition, publicTransport,
        distanceToCityKm: Number(distanceToCityKm) || 0,
        travelMinutes: Number(travelMinutes) || 0,
        signalQuality, signage,
        amenities, homestayTier, camping, pokdarwis, bumdes,
        guideCount: Number(guideCount) || 0,
        wasteScore, safetyScore, communityScore,
        socialMedia, governmentSupport, recurringEvent, travelPartners,
      };

      const fd = new FormData();
      fd.append("payload", JSON.stringify(payload));
      photos.forEach((p) => fd.append("photos", p.file));

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analisis gagal diproses.");
      router.push(`/proses/${json.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.");
      setSubmitting(false);
    }
  };

  const next = () => stepValid && setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Progres */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className="group flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={`grid size-9 place-items-center rounded-full border text-[11px] font-bold transition-all duration-300 sm:size-10 ${
                  i < step
                    ? "border-pine bg-pine text-paper"
                    : i === step
                      ? "border-pine bg-pine text-paper shadow-[0_10px_24px_-8px_rgba(23,62,44,0.8)]"
                      : "border-ink/15 bg-paper text-ink/35"
                }`}
              >
                <s.icon className="size-4" />
              </span>
              <span className={`hidden text-[10px] font-bold uppercase tracking-wider sm:block ${i <= step ? "text-pine" : "text-ink/30"}`}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pine via-moss to-fern"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.6, ease }}
          />
        </div>
      </div>

      {/* Kartu langkah */}
      <div className="overflow-hidden rounded-[28px] border border-ink/10 bg-parchment/50 shadow-[0_40px_90px_-50px_rgba(15,36,26,0.4)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -42 }}
            transition={{ duration: 0.45, ease }}
            className="bg-paper/60 p-6 sm:p-9"
          >
            {/* ── LANGKAH 1 · IDENTITAS ──────────────────────────────── */}
            {step === 0 && (
              <div>
                <StepTitle kicker="Langkah 1 dari 6" title="Kenalkan desa Anda" desc="Identitas dan gambaran umum desa yang akan dianalisis." />
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field label="Nama Desa"><TextInput value={villageName} onChange={(e) => setVillageName(e.target.value)} placeholder="cth. Desa Sukamaju" /></Field>
                  <Field label="Provinsi"><TextInput value={province} onChange={(e) => setProvince(e.target.value)} placeholder="cth. Jawa Timur" /></Field>
                  <Field label="Kabupaten / Kota"><TextInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="cth. Kab. Banyuwangi" /></Field>
                  <Field label="Kecamatan"><TextInput value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="cth. Kec. Licin" /></Field>
                  <Field label="Jumlah Penduduk" optional><NumberInput value={population} onChange={(e) => setPopulation(e.target.value)} placeholder="cth. 3200" suffix="jiwa" /></Field>
                  <Field label="Luas Wilayah" optional><NumberInput value={areaHa} onChange={(e) => setAreaHa(e.target.value)} placeholder="cth. 850" suffix="ha" /></Field>
                  <Field label="Email Kontak" optional className="sm:col-span-2"><TextInput type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="cth. pemdes@sukamaju.desa.id" /></Field>
                  <Field
                    label="Deskripsi Singkat Desa"
                    hint={`Ceritakan kondisi desa: letak, karakter warga, dan apa yang paling membanggakan. (${description.trim().length}/30 karakter)`}
                    className="sm:col-span-2"
                  >
                    <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Desa kami berada di lereng pegunungan, mayoritas warga berkebun kopi. Ada air terjun 40 meter yang selama ini hanya dikenal warga sekitar..." />
                  </Field>
                </div>
              </div>
            )}

            {/* ── LANGKAH 2 · ATRAKSI ────────────────────────────────── */}
            {step === 1 && (
              <div>
                <StepTitle kicker="Langkah 2 dari 6" title="Apa yang bisa dilihat & dirasakan di desa?" desc="Centang semua daya tarik yang ada — inilah bahan baku skor Attraction." />
                <div className="mt-7 space-y-6">
                  {ATTRACTION_GROUPS.map((g) => (
                    <div key={g.key}>
                      <p className="text-[13px] font-bold text-ink">{g.label} <span className="ml-2 text-[11px] font-medium text-ink/40">{g.hint}</span></p>
                      <div className="mt-2.5"><CheckChips options={g.items} values={attractions} onChange={setAttractions} /></div>
                    </div>
                  ))}
                  <div className="grid gap-5 border-t border-ink/8 pt-6 sm:grid-cols-2">
                    <Field label="Atraksi Unggulan" hint="Satu yang paling dibanggakan — jadi jangkar cerita desa." className="sm:col-span-2">
                      <TextInput value={mainAttraction} onChange={(e) => setMainAttraction(e.target.value)} placeholder="cth. Air Terjun Selo Rinse 40 meter" />
                    </Field>
                    <Field label="Tingkat Keunikan Daya Tarik">
                      <Rating value={uniqueness} onChange={setUniqueness} labels={["Biasa saja", "Sulit ditemukan di tempat lain"]} />
                    </Field>
                    <Field label="Perkiraan Kunjungan Saat Ini">
                      <RadioCards
                        options={VISITOR_TIERS.map((t) => ({ value: t.key, label: t.label }))}
                        value={monthlyVisitorsTier}
                        onChange={setMonthlyVisitorsTier}
                        cols={3}
                      />
                    </Field>
                    <Field label="Karcis Masuk" className="sm:col-span-2">
                      <RadioCards
                        options={[
                          { value: "free" as const, label: "Belum dipungut biaya", desc: "Kunjungan masih gratis / donasi sukarela." },
                          { value: "paid" as const, label: "Sudah ada karcis / retribusi", desc: "Desa telah memungut biaya masuk." },
                        ]}
                        value={ticketType}
                        onChange={setTicketType}
                        cols={2}
                      />
                    </Field>
                    {ticketType === "paid" && (
                      <Field label="Harga Karcis per Orang" className="sm:col-span-2">
                        <NumberInput value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="cth. 10000" suffix="Rp" />
                      </Field>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── LANGKAH 3 · AKSESIBILITAS ──────────────────────────── */}
            {step === 2 && (
              <div>
                <StepTitle kicker="Langkah 3 dari 6" title="Semudah apa desa dijangkau?" desc="Aksesibilitas menentukan seberapa banyak orang yang akhirnya benar-benar datang." />
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <Field label="Kondisi Jalan Menuju & di Dalam Desa">
                    <Rating value={roadCondition} onChange={setRoadCondition} labels={["Rusak / sulit dilalui", "Aspal mulus sampai lokasi"]} />
                  </Field>
                  <Field label="Ketersediaan Transportasi Umum">
                    <RadioCards
                      options={[
                        { value: "good" as const, label: "Ada & terjadwal" },
                        { value: "limited" as const, label: "Terbatas / ojek" },
                        { value: "none" as const, label: "Tidak ada" },
                      ]}
                      value={publicTransport}
                      onChange={setPublicTransport}
                      cols={3}
                    />
                  </Field>
                  <Field label="Jarak ke Pusat Kota / Kabupaten"><NumberInput value={distanceToCityKm} onChange={(e) => setDistanceToCityKm(e.target.value)} suffix="km" /></Field>
                  <Field label="Waktu Tempuh dari Kota Terdekat"><NumberInput value={travelMinutes} onChange={(e) => setTravelMinutes(e.target.value)} suffix="menit" /></Field>
                  <Field label="Kualitas Sinyal & Internet">
                    <Rating value={signalQuality} onChange={setSignalQuality} labels={["Blank spot", "4G lancar di mana-mana"]} />
                  </Field>
                  <Field label="Petunjuk Arah Menuju Desa">
                    <RadioCards
                      options={[
                        { value: "yes" as const, label: "Lengkap" },
                        { value: "partial" as const, label: "Sebagian" },
                        { value: "no" as const, label: "Belum ada" },
                      ]}
                      value={signage}
                      onChange={setSignage}
                      cols={3}
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* ── LANGKAH 4 · FASILITAS & KOMUNITAS ──────────────────── */}
            {step === 3 && (
              <div>
                <StepTitle kicker="Langkah 4 dari 6" title="Fasilitas, kelembagaan & promosi" desc="Ini bahan skor Amenity, Accommodation, Ancillary, dan Awareness." />
                <div className="mt-7 space-y-6">
                  <Field label={`Fasilitas yang Sudah Ada (${amenities.length} dipilih)`}>
                    <CheckChips options={AMENITIES.map((a) => ({ key: a.key, label: a.label }))} values={amenities} onChange={setAmenities} />
                  </Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Ketersediaan Homestay / Penginapan">
                      <RadioCards options={HOMESTAY_TIERS.map((t) => ({ value: t.key as "none" | "few" | "some" | "many", label: t.label }))} value={homestayTier} onChange={setHomestayTier} cols={4} />
                    </Field>
                    <Field label="Alternatif Menginap">
                      <Toggle checked={camping} onChange={setCamping} label="Area camping / glamping tersedia" desc="Lahan berkemah yang bisa disewakan." />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Pokdarwis (Kelompok Sadar Wisata)">
                      <RadioCards
                        options={[
                          { value: "active" as const, label: "Aktif" }, { value: "formed" as const, label: "Terbentuk tapi jarang aktif" }, { value: "none" as const, label: "Belum ada" },
                        ]}
                        value={pokdarwis}
                        onChange={setPokdarwis}
                        cols={3}
                      />
                    </Field>
                    <Field label="BUMDes">
                      <RadioCards
                        options={[
                          { value: "active" as const, label: "Aktif berusaha" }, { value: "formed" as const, label: "Ada tapi pasif" }, { value: "none" as const, label: "Belum ada" },
                        ]}
                        value={bumdes}
                        onChange={setBumdes}
                        cols={3}
                      />
                    </Field>
                    <Field label="Jumlah Pemandu / Kader Wisata Lokal">
                      <NumberInput value={guideCount} onChange={(e) => setGuideCount(e.target.value)} placeholder="cth. 4" suffix="orang" />
                    </Field>
                    <Field label="Dukungan Pemerintah Desa / Daerah">
                      <Rating value={governmentSupport} onChange={setGovernmentSupport} labels={["Belum peduli", "Ada program & anggaran"]} />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field label="Pengelolaan Sampah"><Rating value={wasteScore} onChange={setWasteScore} /></Field>
                    <Field label="Keamanan & SOP Keselamatan"><Rating value={safetyScore} onChange={setSafetyScore} /></Field>
                    <Field label="Antusiasme & Partisipasi Warga"><Rating value={communityScore} onChange={setCommunityScore} /></Field>
                  </div>
                  <Field label={`Kanal Media Sosial Aktif (${socialMedia.length} dipilih)`}>
                    <CheckChips options={SOCIAL_CHANNELS.map((s) => ({ key: s.key, label: s.label }))} values={socialMedia} onChange={setSocialMedia} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Toggle checked={recurringEvent} onChange={setRecurringEvent} label="Punya event / festival rutin" desc="Agenda tahunan yang mendatangkan orang." />
                    <Toggle checked={travelPartners} onChange={setTravelPartners} label="Sudah bermitra dengan biro perjalanan" desc="Agen wisata / komunitas yang rutin membawa tamu." />
                  </div>
                </div>
              </div>
            )}

            {/* ── LANGKAH 5 · FOTO ───────────────────────────────────── */}
            {step === 4 && (
              <div>
                <StepTitle kicker="Langkah 5 dari 6" title="Unggah foto terbaik desa" desc="3–8 foto: lanskap, atraksi, kerajinan, kegiatan warga. AI membaca karakter visual tiap frame." />
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}
                  className={`mt-7 grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                    dragOver ? "border-pine bg-pine/8" : "border-ink/15 bg-paper/70 hover:border-pine/40"
                  }`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                  />
                  <span className="grid size-14 place-items-center rounded-2xl bg-pine/8 text-pine"><ImagePlus className="size-6" /></span>
                  <p className="mt-4 text-sm font-bold text-ink">Tarik & letakkan foto di sini, atau klik untuk memilih</p>
                  <p className="mt-1 text-xs text-ink/45">{photos.length}/8 foto dipilih · JPG/PNG hingga 10 MB per foto</p>
                </div>

                {photos.length > 0 && (
                  <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {photos.map((p, i) => (
                      <motion.div
                        key={p.preview}
                        layout
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/10"
                      >
                        <Image src={p.preview} alt={`Foto desa ${i + 1}`} fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                          className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-ink/70 text-paper opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                          aria-label="Hapus foto"
                        >
                          <X className="size-3.5" />
                        </button>
                        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-bold text-paper backdrop-blur">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── LANGKAH 6 · TINJAU & KIRIM ─────────────────────────── */}
            {step === 5 && (
              <div>
                <StepTitle kicker="Langkah 6 dari 6" title="Tinjau & mulai analisis" desc="Pastikan ringkasan di bawah benar sebelum AI bekerja." />
                <div className="mt-7 space-y-4">
                  <div className="rounded-2xl border border-ink/8 bg-parchment/60 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pine/60">Desa yang Dianalisis</p>
                    <p className="mt-1.5 font-display text-2xl font-semibold text-ink">{villageName || "—"}</p>
                    <p className="text-sm text-ink/55">{district}, {city}, {province}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReviewLine label="Jenis atraksi terpilih" value={`${attractions.length} jenis`} />
                    <ReviewLine label="Atraksi unggulan" value={mainAttraction || "—"} />
                    <ReviewLine label="Kunjungan saat ini" value={VISITOR_TIERS.find((t) => t.key === monthlyVisitorsTier)?.label ?? "—"} />
                    <ReviewLine label="Karcis" value={ticketType === "paid" ? `Rp ${Number(ticketPrice).toLocaleString("id-ID")}` : "Gratis"} />
                    <ReviewLine label="Fasilitas tercentang" value={`${amenities.length} dari ${AMENITIES.length}`} />
                    <ReviewLine label="Foto diunggah" value={`${photos.length} foto`} />
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/8 p-5">
                    <PartyPopper className="mt-0.5 size-5 shrink-0 text-gold" />
                    <p className="text-[13px] leading-relaxed text-ink/70">
                      Setelah dianalisis, Anda menerima <strong>9 keluaran strategis</strong>: skor kesiapan, analisis 6A, SWOT,
                      analisis visual foto, simulasi pendapatan, branding & target pasar, prioritas, roadmap, dan rekomendasi.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Galat */}
        {error && (
          <div className="flex items-start gap-2.5 border-t border-rust/20 bg-rust/8 px-6 py-3.5 text-[13px] font-semibold text-rust sm:px-9">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Navigasi bawah */}
        <div className="flex items-center justify-between gap-4 border-t border-ink/8 bg-parchment/70 px-6 py-4 sm:px-9">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || submitting}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-[13px] font-bold text-ink/60 transition-all hover:border-ink/40 disabled:opacity-0"
          >
            <ArrowLeft className="size-4" /> Kembali
          </button>
          <div className="flex items-center gap-3">
            {!stepValid && <span className="hidden max-w-[220px] text-right text-[11px] font-medium text-rust sm:block">{invalidHint}</span>}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={!stepValid}
                className="inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-[13px] font-bold text-paper transition-all hover:bg-forest disabled:cursor-not-allowed disabled:opacity-30"
              >
                Lanjut <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting || !stepValid}
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[13px] font-bold text-paper transition-all hover:bg-pine disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" /> Menganalisis…
                  </>
                ) : (
                  <>
                    Jalankan Analisis AI <Sparkles className="size-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div>
      <p className="eyebrow text-[10px] font-bold uppercase text-pine/70">{kicker}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/50">{desc}</p>
    </div>
  );
}

function ReviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-paper px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">{label}</p>
      <p className="mt-0.5 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
