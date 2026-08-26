import { Navbar, Footer } from "@/components/site/chrome";
import { Hero } from "@/components/site/hero";
import {
  FeaturesSection,
  SixASection,
  HowItWorksSection,
  PreviewSection,
  AudienceSection,
  CtaSection,
} from "@/components/site/sections";
import { Marquee } from "@/components/shared";

const MARQUEE_ITEMS = [
  "Analisis 6A Pariwisata",
  "Matriks SWOT",
  "Analisis Visual Foto",
  "Skor Kesiapan Desa",
  "Simulasi Pendapatan",
  "Branding & Target Pasar",
  "Prioritas Pengembangan",
  "Roadmap 3 Fase",
  "Rekomendasi Strategis",
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <Hero />
      <Marquee items={MARQUEE_ITEMS} />
      <FeaturesSection />
      <SixASection />
      <HowItWorksSection />
      <Marquee
        items={["Pemerintah Desa", "BUMDes", "Pokdarwis", "Dinas Pariwisata", "Akademisi", "Konsultan"]}
        dark={false}
      />
      <PreviewSection />
      <AudienceSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
