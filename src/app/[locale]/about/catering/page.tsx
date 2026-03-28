"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

export default function CateringPage() {
  const locale = useLocale() as "de" | "en";
  const revealImage = useReveal();
  const revealContent = useReveal({ delay: 150 });
  const revealCta = useReveal({ delay: 300 });

  return (
    <main className="relative">
      {/* CI background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.18 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-200px", right:"-200px", width:"600px", height:"600px", borderRadius:"50%", background:"rgba(243,146,0,0.12)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", top:"30%", left:"-200px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(189,37,110,0.10)", filter:"blur(110px)" }} />
      </div>
      {/* Hero */}
      <section className="section-padding min-h-[50vh] flex flex-col items-center justify-center text-center">
        <BlurText
          text="COCKTAIL X CATERING"
          tag="h1"
          className="text-5xl md:text-7xl font-display text-bone mb-8"
          delay={80}
          duration={0.7}
        />
      </section>

      {/* Content */}
      <section className="section-padding pt-0">
        <div className="max-w-3xl mx-auto">
          {/* Hero Image */}
          <div
            ref={revealImage.ref}
            style={revealImage.style}
            className="relative aspect-video rounded-2xl overflow-hidden border border-bone/10 mb-12"
          >
            <Image
              src="/images/festival-bar-life.webp"
              alt="Cocktail X Catering"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              loading="lazy"
              className="object-cover"
            />
          </div>

          <div
            ref={revealContent.ref}
            style={revealContent.style}
            className="text-bone/80 font-body text-lg leading-relaxed space-y-6"
          >
            <p>
              {locale === "de"
                ? "Cocktail X Catering bringt die Magie des Festivals direkt zu Ihrem Event. Unser Team aus erfahrenen Mixologen kreiert maßgeschneiderte Cocktail-Erlebnisse für private Feiern, Firmenveranstaltungen und besondere Anlässe jeder Größe."
                : "Cocktail X Catering brings the magic of the festival directly to your event. Our team of experienced mixologists creates bespoke cocktail experiences for private celebrations, corporate events, and special occasions of any size."}
            </p>
            <p>
              {locale === "de"
                ? "Von intimen Dinner-Partys bis hin zu großen Firmenevents – wir bieten ein umfassendes Catering-Erlebnis, das Ihre Gäste begeistern wird. Unsere mobilen Bars sind mit allem ausgestattet, was man für erstklassige Cocktails benötigt."
                : "From intimate dinner parties to large corporate events – we offer a comprehensive catering experience that will delight your guests. Our mobile bars are equipped with everything needed for first-class cocktails."}
            </p>
            <p>
              {locale === "de"
                ? "Jedes Catering-Paket wird individuell auf Ihre Wünsche abgestimmt. Wir arbeiten eng mit Ihnen zusammen, um ein Cocktailmenü zu entwickeln, das perfekt zu Ihrem Anlass passt – von klassischen Cocktails bis hin zu kreativen Eigenkreationen."
                : "Each catering package is individually tailored to your wishes. We work closely with you to develop a cocktail menu that perfectly suits your occasion – from classic cocktails to creative original creations."}
            </p>
          </div>

          {/* CTA */}
          <div
            ref={revealCta.ref}
            style={revealCta.style}
            className="mt-12 text-center"
          >
            <Link href={`/${locale}/about/contact`} className="btn-primary text-lg">
              {locale === "de" ? "KONTAKTIEREN SIE UNS" : "CONTACT US"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
