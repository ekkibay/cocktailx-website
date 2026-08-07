import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicPackages, weekdayVariants } from "@/lib/pricing/packages";
import {
  DrawLine,
  GridBackdrop,
  LiftCard,
  MaskReveal,
  ParallaxImage,
  Reveal,
  ScrollProgress,
  StaggerGroup,
  StaggerItem,
  WordReveal,
} from "@/components/ui/Motion";
import {
  PRICE_TYPE_SUFFIX,
  formatEuroExact,
  type PackageCategory,
  type PublicPackage,
} from "@/lib/pricing/types";

/**
 * Preisseite. Bewusst schlank: Anlässe, Leistungsumfang, Ablauf und FAQ stehen auf
 * der Landingpage. Hier geht es nur darum, was was kostet.
 */

export const metadata: Metadata = {
  title: "Pakete & Preise für Firmenevents in München",
  description:
    "Alle Preise für Eventcatering transparent: Bar-Pakete ab 36 € pro Gast inkl. Barteam, Glaswerk und Equipment. Dazu Food, Personal und Zusatzleistungen.",
};

const SECTIONS: { category: PackageCategory; eyebrow: string; title: string; accent: string; intro: string }[] = [
  {
    category: "drinks",
    eyebrow: "Die Bar",
    title: "Vier Wege, wie eure Bar aussieht",
    accent: "Barteam, Glaswerk und Equipment inklusive.",
    intro:
      "Ihr wählt nur, wie viel Durchsatz und wie viel Handschrift ihr braucht. Alles andere ist eingerechnet.",
  },
  {
    category: "food",
    eyebrow: "Food",
    title: "Essen, das man im Stehen isst",
    accent: "Kein Finedining. Bewusst.",
    intro:
      "Unsere Gäste stehen, reden und halten ein Glas in der Hand. Genau dafür ist unser Food gebaut.",
  },
  {
    category: "experience",
    eyebrow: "Teamformate",
    title: "Wenn das Team selbst hinter die Bar soll",
    accent: "Anfahrt und Aufbau inklusive.",
    intro:
      "Für Teamtage und Offsites, bei denen nicht serviert, sondern mitgemacht wird. Ohne zusätzliche Grundpauschale.",
  },
];

function priceLabel(pkg: PublicPackage) {
  if (pkg.pricingLabel === "onRequest") return { value: "Auf Anfrage", suffix: "" };
  return {
    value: `${pkg.pricingLabel === "from" ? "ab " : ""}${formatEuroExact(pkg.price)}`,
    suffix: PRICE_TYPE_SUFFIX[pkg.priceType],
  };
}

function constraintLine(pkg: PublicPackage): string | null {
  const out: string[] = [];
  if (pkg.minPersons && pkg.maxPersons) out.push(`${pkg.minPersons} bis ${pkg.maxPersons} Gäste`);
  else if (pkg.minPersons) out.push(`ab ${pkg.minPersons} Gästen`);
  else if (pkg.maxPersons) out.push(`bis ${pkg.maxPersons} Gäste`);
  if (pkg.minQuantityPercent) out.push(`mind. ${pkg.minQuantityPercent} % der Gäste`);
  return out.length ? out.join(" · ") : null;
}

function Check() {
  return (
    <svg className="w-4 h-4 text-ct-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Bildkarte fuer die Hauptpakete. Das Bild laeuft ueber die volle Kartenbreite,
 * der Preis sitzt als eigener Block unten, damit er nicht in der Liste untergeht.
 */
function PackageCard({ pkg, index }: { pkg: PublicPackage; index: number }) {
  const price = priceLabel(pkg);
  const variants = weekdayVariants(pkg);
  const limits = constraintLine(pkg);

  return (
    <LiftCard
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white ${
        pkg.isRecommended ? "ring-1 ring-ct-red/45 shadow-xl shadow-ct-red/5" : "ring-1 ring-everglade/10"
      }`}
    >
      {pkg.image && (
        <div className="relative h-52 overflow-hidden">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={`object-cover ${pkg.imagePosition} transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-licorice/70 via-licorice/10 to-transparent" />
          <span className="absolute top-4 left-4 font-body text-[11px] font-bold tracking-[0.3em] text-white/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          {pkg.isRecommended && (
            <span className="absolute top-4 right-4 rounded-full bg-ct-red px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-white">
              Empfehlung
            </span>
          )}
          <h3 className="absolute bottom-4 left-5 right-5 font-display text-2xl md:text-[26px] text-white leading-tight">
            {pkg.title}
          </h3>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {!pkg.image && <h3 className="font-display text-2xl text-licorice mb-3">{pkg.title}</h3>}
        <p className="font-body text-sm text-everglade/65 leading-relaxed mb-5">{pkg.description}</p>

        <ul className="space-y-2 mb-6">
          {pkg.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2.5 font-body text-[13px] text-everglade/70">
              <Check />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto -mx-6 -mb-6 px-6 py-5 bg-bone/45 border-t border-everglade/10">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div>
              <p className="font-display text-[28px] text-licorice tabular-nums leading-none">{price.value}</p>
              {price.suffix && (
                <p className="font-body text-[11px] text-everglade/50 mt-1">{price.suffix}, netto</p>
              )}
            </div>
            {limits && (
              <p className="font-body text-[11px] text-everglade/45 text-right leading-snug max-w-[45%]">
                {limits}
              </p>
            )}
          </div>
          {variants.length > 0 && (
            <div className="mt-3 pt-3 border-t border-everglade/10 flex flex-wrap gap-x-4 gap-y-1">
              {variants.map((v) => (
                <span key={v.label} className="font-body text-[11px] text-everglade/50">
                  {v.label}{" "}
                  <span className="text-everglade/85 font-bold tabular-nums">{formatEuroExact(v.price)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </LiftCard>
  );
}

export default function PaketePage({ params }: { params: { locale: string } }) {
  const packages = publicPackages();
  const locale = params.locale;
  const extras = packages.filter((p) => p.category === "equipment");

  return (
    <main className="min-h-screen bg-ct-cream">
      <ScrollProgress />

      {/* ══ Kopf ══ */}
      <section className="px-4 pt-32 md:pt-40 pb-6">
        <div className="max-w-6xl mx-auto">
          <Reveal y={10}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.35em] text-ct-red mb-6">
              Pakete & Preise
            </p>
          </Reveal>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] text-licorice leading-[0.88] mb-8 tracking-[-0.02em]">
            <WordReveal text="Alles, was auf" />
            <br />
            <span className="text-everglade/35">
              <WordReveal text="der Bar steht." />
            </span>
          </h1>
          <div className="grid md:grid-cols-12 gap-y-6 gap-x-10 items-end">
            <Reveal delay={0.4} className="md:col-span-7">
              <p className="font-body text-base md:text-lg text-everglade/65 leading-relaxed max-w-xl">
                Preise netto pro Gast, zzgl. 19 % MwSt. Jedes Bar-Paket enthält Barteam, Glaswerk
                und Equipment. Freitag und Samstag mit Aufschlag, Anfahrt innerhalb Münchens
                enthalten.
              </p>
            </Reveal>
            <Reveal delay={0.5} className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
              <Link
                href={`/${locale}/catering/anfrage`}
                className="px-8 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-colors shadow-lg shadow-ct-red/25"
              >
                Richtpreis berechnen
              </Link>
              <Link
                href={`/${locale}/catering`}
                className="px-8 py-4 rounded-full border border-everglade/25 text-everglade font-body font-bold text-sm uppercase tracking-wider hover:border-everglade/50 transition-colors"
              >
                Anlässe & Leistungen
              </Link>
            </Reveal>
          </div>
          <DrawLine className="mt-12" />
        </div>
      </section>

      {/* ══ Pakete ══ */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {SECTIONS.map((section) => {
            const items = packages.filter((p) => p.category === section.category);
            if (!items.length) return null;
            return (
              <div key={section.category} className="mb-16 last:mb-0">
                <Reveal className="mb-8">
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-everglade/40 mb-3">
                    {section.eyebrow}
                  </p>
                  <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-3">
                    <h2 className="font-display text-2xl md:text-3xl text-licorice">{section.title}</h2>
                    <span className="font-body text-[11px] uppercase tracking-wider text-ct-red">
                      {section.accent}
                    </span>
                  </div>
                  <p className="font-body text-sm text-everglade/60 leading-relaxed max-w-2xl">
                    {section.intro}
                  </p>
                  <DrawLine className="mt-6" />
                </Reveal>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {items.map((pkg, i) => (
                    <PackageCard key={pkg.key} pkg={pkg} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ Zusatzleistungen ══ */}
      {extras.length > 0 && (
        <section className="pb-20 md:pb-28 px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-8">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <h2 className="font-display text-2xl md:text-3xl text-licorice">Dazu buchbar</h2>
                <span className="font-body text-[11px] uppercase tracking-wider text-ct-red">
                  Einzeln oder als Ergänzung
                </span>
              </div>
              <DrawLine className="mt-6" />
            </Reveal>
            <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-everglade/12 rounded-2xl overflow-hidden">
              {extras.map((pkg) => {
                const price = priceLabel(pkg);
                return (
                  <StaggerItem key={pkg.key} className="bg-white">
                    <div className="h-full p-6 hover:bg-bone/30 transition-colors duration-300">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-display text-lg text-licorice leading-tight">{pkg.title}</h3>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-lg text-licorice tabular-nums leading-none">
                            {price.value}
                          </p>
                          {price.suffix && (
                            <p className="font-body text-[10px] text-everglade/45 mt-1">{price.suffix}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-body text-[13px] text-everglade/60 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ══ CTA ══ */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <ParallaxImage
          src="/images/catering/ct-bar-kempinski.jpg"
          alt=""
          objectPosition="object-[68%_center]"
        />
        <div className="absolute inset-0 bg-licorice/90" />
        <GridBackdrop className="text-ct-cream" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              Richtpreis in 60 Sekunden
            </p>
          </Reveal>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-ct-cream mb-7 leading-[0.95]">
            <MaskReveal>Zusammenstellen</MaskReveal>
            <br />
            <MaskReveal delay={0.1} className="text-ct-cream/35">
              und Preis sehen.
            </MaskReveal>
          </h2>
          <Reveal delay={0.25}>
            <p className="font-body text-base text-ct-cream/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Anlass, Datum und Gästezahl eingeben, Pakete wählen. Ihr seht den Gesamtpreis sofort,
              inklusive der Bars und Barkeeper, die dafür nötig sind.
            </p>
          </Reveal>
          <Reveal delay={0.35} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/anfrage`}
              className="px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-colors shadow-lg shadow-ct-red/25"
            >
              Anfrage starten
            </Link>
            <Link
              href={`/${locale}/catering/kontakt`}
              className="px-10 py-4 rounded-full border border-white/25 text-white font-body font-bold text-sm uppercase tracking-wider hover:border-white/55 transition-colors"
            >
              Persönlich sprechen
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
