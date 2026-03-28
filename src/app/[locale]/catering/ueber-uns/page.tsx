"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function UeberUnsPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat" }} />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #004369 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-40 pb-24">
        <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-green mb-4">
          {locale === "de" ? "Unser Team" : "Our Team"}
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-ct-cream mb-16">
          {locale === "de" ? "ÜBER UNS" : "ABOUT US"}
        </h1>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          <div>
            <h2 className="font-display text-3xl text-ct-cream mb-6">
              {locale === "de" ? "DIE GESCHICHTE" : "THE STORY"}
            </h2>
            <div className="space-y-4 font-body text-ct-cream/75 leading-relaxed">
              {locale === "de" ? (
                <>
                  <p>
                    Cocktail X Catering entstand aus einer einfachen Überzeugung: Gute Cocktails gehören nicht nur ins Restaurant — sie gehören zu jedem außergewöhnlichen Event.
                  </p>
                  <p>
                    Was als Idee von Ekkehard Bay und Vincent Kerger begann, hat sich zu einem der profiliertesten Cocktail-Catering-Unternehmen Münchens entwickelt. Die Erfahrung aus dem Betrieb des Cocktail X Festivals — mit bis zu 58 Bars gleichzeitig — fließt direkt in jeden Catering-Auftrag ein.
                  </p>
                  <p>
                    Wir glauben: Ein unvergessliches Event beginnt mit dem ersten Drink. Deshalb gehen wir keine Kompromisse bei Qualität, Kreativität und Service ein.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Cocktail X Catering was born from a simple conviction: great cocktails don&apos;t belong only in restaurants — they belong at every extraordinary event.
                  </p>
                  <p>
                    What started as an idea by Ekkehard Bay and Vincent Kerger has grown into one of Munich&apos;s most distinguished cocktail catering companies. The experience from operating the Cocktail X Festival — with up to 58 bars simultaneously — feeds directly into every catering engagement.
                  </p>
                  <p>
                    We believe: an unforgettable event begins with the first drink. That&apos;s why we make no compromises on quality, creativity, and service.
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
            <Image
              src="/images/founders.jpg"
              alt="Ekkehard Bay & Vincent Kerger — Cocktail X"
              fill
              className="object-cover object-top opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display text-ct-cream text-lg mb-1">Ekkehard Bay · Vincent Kerger</p>
              <p className="font-body text-sm text-ct-green">
                {locale === "de" ? "Gründer, Cocktail X" : "Founders, Cocktail X"}
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-display text-3xl text-ct-cream mb-10">
            {locale === "de" ? "UNSERE WERTE" : "OUR VALUES"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "◈",
                de: { title: "Qualität", text: "Nur die besten Spirituosen, frischesten Zutaten, professionellsten Bartender. Kein Kompromiss." },
                en: { title: "Quality", text: "Only the finest spirits, freshest ingredients, most professional bartenders. No compromise." },
              },
              {
                icon: "◇",
                de: { title: "Kreativität", text: "Jede Karte ist eine Geschichte. Wir entwickeln Cocktails, die euer Event widerspiegeln." },
                en: { title: "Creativity", text: "Every menu is a story. We develop cocktails that reflect your event." },
              },
              {
                icon: "◉",
                de: { title: "Verlässlichkeit", text: "Pünktlich, professionell, perfekt vorbereitet. Ihr könnt euch auf uns verlassen — immer." },
                en: { title: "Reliability", text: "On time, professional, perfectly prepared. You can count on us — always." },
              },
            ].map((value, i) => (
              <div key={i} className="p-6 rounded-2xl border border-ct-green/15 bg-ct-green/[0.03]">
                <span className="font-display text-2xl text-ct-green block mb-4">{value.icon}</span>
                <h3 className="font-display text-xl text-ct-cream mb-3">
                  {locale === "de" ? value.de.title : value.en.title}
                </h3>
                <p className="font-body text-sm text-ct-cream/65 leading-relaxed">
                  {locale === "de" ? value.de.text : value.en.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl border border-ct-green/20" style={{ background: "linear-gradient(135deg, #001a15 0%, #000000 100%)" }}>
          <h2 className="font-display text-3xl text-ct-cream mb-4">
            {locale === "de" ? "BEREIT FÜR IHR EVENT?" : "READY FOR YOUR EVENT?"}
          </h2>
          <Link
            href={`/${locale}/catering/kontakt`}
            className="inline-block px-10 py-4 rounded-full bg-ct-green text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-green/80 transition-all duration-200"
          >
            {locale === "de" ? "Jetzt anfragen" : "Enquire Now"}
          </Link>
        </div>
      </div>
    </main>
  );
}
