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
    <main>
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
                ? "Cocktail X Catering bringt die Magie des Festivals direkt zu Ihrem Event. Unser Team aus erfahrenen Mixologen kreiert massgeschneiderte Cocktail-Erlebnisse fuer private Feiern, Firmenveranstaltungen und besondere Anlaesse jeder Groesse."
                : "Cocktail X Catering brings the magic of the festival directly to your event. Our team of experienced mixologists creates bespoke cocktail experiences for private celebrations, corporate events, and special occasions of any size."}
            </p>
            <p>
              {locale === "de"
                ? "Von intimen Dinner-Partys bis hin zu grossen Firmenevents -- wir bieten ein umfassendes Catering-Erlebnis, das Ihre Gaeste begeistern wird. Unsere mobilen Bars sind mit allem ausgestattet, was man fuer erstklassige Cocktails benoetigt."
                : "From intimate dinner parties to large corporate events -- we offer a comprehensive catering experience that will delight your guests. Our mobile bars are equipped with everything needed for first-class cocktails."}
            </p>
            <p>
              {locale === "de"
                ? "Jedes Catering-Paket wird individuell auf Ihre Wuensche abgestimmt. Wir arbeiten eng mit Ihnen zusammen, um ein Cocktailmenue zu entwickeln, das perfekt zu Ihrem Anlass passt -- von klassischen Cocktails bis hin zu kreativen Eigenkreationen."
                : "Each catering package is individually tailored to your wishes. We work closely with you to develop a cocktail menu that perfectly suits your occasion -- from classic cocktails to creative original creations."}
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
