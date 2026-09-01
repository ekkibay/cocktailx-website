"use client";


import { useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import CheckoutButton from "@/components/onice/CheckoutButton";
import { useReveal } from "@/hooks/useReveal";
import { CHECKOUT, EVENT, currentPrice } from "@/config/pricing";

/* ── Farben im Telefon-Mockup ───────────────────────────────────────────
   Die Mockup-Flächen sind Inline-Styles, dort greift keine Tailwind-Klasse.
   Vorher standen hier die warmen Sommerwerte als feste Zahlen drin, Orange
   und Braun. Die haben das Farbklima nicht mitgeschaltet, das Telefon blieb
   warm, während die Seite ringsum längst ON ICE war.
   Diese beiden Helfer lesen dieselben CSS-Variablen wie die Tailwind-Tokens,
   damit die Umschaltung an genau einer Stelle hängt.                       */
const ice = (alpha: number) => `rgb(var(--c-accent) / ${alpha})`;
const text = (alpha: number) => `rgb(var(--c-text) / ${alpha})`;

/* Hibiscus hat als klimafeste Farbe bewusst keine CSS-Variable, deshalb steht
   der Wert hier einmal als Konstante statt viermal im Markup. */
const HIBISCUS_RGB = "189,37,110";

const steps = [
  {
    num: "01",
    title: { de: "Pass sichern", en: "Get your pass" },
    // Vorher stand hier "sofort per E-Mail erhalten". Das ist ein
    // Zustellversprechen, das wir nicht halten können.
    desc: {
      de: "Online kaufen, die Bestätigung kommt per E-Mail.",
      en: "Buy online, your confirmation arrives by email.",
    },
  },
  {
    num: "02",
    title: { de: "App öffnen", en: "Open app" },
    // Vorher "Festival-Code eingeben". Die Anmeldung laeuft ueber das Konto,
    // nicht ueber einen Code, siehe FAQ in src/config/onice.ts.
    desc: {
      de: "App öffnen, mit deiner E-Mail anmelden, der Pass liegt bereit.",
      en: "Open the app, sign in with your email, your pass is waiting.",
    },
  },
  {
    num: "03",
    title: { de: "Bars entdecken", en: "Discover bars" },
    desc: {
      de: "Interaktive Karte, an der Bar den QR-Code scannen.",
      en: "Interactive map, scan the QR code at the bar.",
    },
  },
  {
    num: "04",
    title: { de: "Signature Drink", en: "Signature drink" },
    // Vorher "exklusive Preise gewinnen". Ein Gewinnversprechen ohne
    // Teilnahmebedingungen, das es so nicht gibt.
    desc: {
      de: "In jeder Bar einen Signature Drink freischalten.",
      en: "Unlock one signature drink in every bar.",
    },
  },
];

/* Der Wortlaut folgt HOW_IT_WORKS in src/config/onice.ts. Übernommen wird er
   trotzdem nicht per Import: diese Seite ist zweisprachig, HOW_IT_WORKS ist
   einsprachig deutsch. Einzige bewusste Abweichung ist Schritt 02, dort heisst
   es "App laden", während diese Seite weiter unten zu Recht sagt, dass nichts
   installiert wird. */

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: { de: "Interaktive Bar-Karte", en: "Interactive bar map" },
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M5 14.5h14m-7 0v6.5m-3.5 0h7" />
      </svg>
    ),
    title: { de: "Cocktail-Sammlung", en: "Cocktail collection" },
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    // Vorher "Live Event-Updates". Das versprach eine Funktion, die niemand
    // zugesagt hat. Trails sind belegt und versprechen keine Reservierung.
    title: { de: "Trails und Routenvorschläge", en: "Trails and route suggestions" },
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    // Vorher "Belohnungen & Preise", zweites Gewinnversprechen. Was drin ist,
    // ist der Signature Drink.
    title: { de: "Signature Drink je Bar", en: "One signature drink per bar" },
  },
];

/* Platzhalter für die Bar-Liste im Mockup. Bis das Re-Signing durch ist und
   BARS in src/config/onice.ts gefüllt ist, steht hier kein Name und keine
   Beschreibung, die sich auf genau ein Haus zurückführen lässt. Vorher
   standen drei echte Bars im Klartext im Markup. Rechts steht nie ein Preis,
   der Signature Drink ist im Pass enthalten. */
const mockBars = [
  { name: { de: "Bar im Glockenbachviertel", en: "Bar in Glockenbach" }, tag: "Signature Drink" },
  { name: { de: "Hotelbar in der Altstadt", en: "Hotel bar in the old town" }, tag: "Signature Drink" },
  { name: { de: "Bar in der Maxvorstadt", en: "Bar in Maxvorstadt" }, tag: "Signature Drink" },
];

export default function AppPage() {
  const locale = useLocale() as "de" | "en";
  // Preis nie tippen. So bewegt sich auch das Mockup am 16. Oktober mit,
  // genau wie der Header, und ohne Deployment.
  const price = currentPrice();
  const heroText = useReveal({ delay: 150 });
  const phoneReveal = useReveal({ delay: 300, direction: "left" });
  const stepsReveal = useReveal({ delay: 200 });
  const ctaReveal = useReveal({ delay: 250 });

  return (
    <main>
      {/* Hero, side by side on desktop.
          pt-32 md:pt-40, weil der Header fixed liegt und rund 100px belegt.
          Ohne den Zuschlag lief die H1 unter das Logo. */}
      <section className="section-padding pt-32 md:pt-40 min-h-[80vh] flex items-center">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-[1fr,auto] gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <BlurText
              text={locale === "de" ? "DEIN DIGITALER BEGLEITER FÜR ON ICE" : "YOUR DIGITAL COMPANION FOR ON ICE"}
              tag="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-display text-bone leading-tight mb-6"
              delay={80}
              duration={0.7}
            />
            <div ref={heroText.ref} style={heroText.style}>
              <p className="text-base md:text-lg font-body text-bone/80 mb-4 max-w-lg">
                {locale === "de"
                  ? "Mit der Cocktail X App hast du alle teilnehmenden Bars, Signature Drinks und deinen digitalen Stempelpass immer dabei."
                  : "The Cocktail X App gives you all participating bars, signature drinks, and your digital stamp passport in one place."}
              </p>

              {/* Termin und Ort standen auf der ganzen Seite nirgends. Beide
                  kommen aus der Eventquelle, damit sie nicht auseinanderlaufen. */}
              <p className="text-xs font-body uppercase tracking-[0.16em] text-tangerine mb-8">
                {locale === "en" ? EVENT.dateLabelEn : EVENT.dateLabel},{" "}
                {locale === "en" ? EVENT.cityEn : EVENT.city}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-body text-bone/85 bg-bone/[0.04] border border-bone/[0.08] rounded-full px-3.5 py-2">
                    <span className="text-tangerine">{f.icon}</span>
                    {f.title[locale]}
                  </div>
                ))}
              </div>

              {/* CTA. Der Kauf-Knopf lief vorher als blankes <a> auf drei
                  verschiedene Schreibweisen der Shop-URL und feuerte kein
                  InitiateCheckout. Jetzt CheckoutButton mit dem Ziel aus der
                  Preis-Config, wie ueberall sonst auf der Seite. */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://cocktailx.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-4 text-center"
                >
                  {locale === "de" ? "APP ÖFFNEN" : "OPEN APP"}
                </a>
                <CheckoutButton
                  href={CHECKOUT.single}
                  value={price}
                  contentName="ON ICE Pass (/app)"
                  label={locale === "de" ? "PASS SICHERN" : "GET YOUR PASS"}
                  className="btn-secondary text-base px-8 py-4 text-center"
                />
              </div>

              <p className="text-[11px] font-body text-bone/30 mt-3">
                {locale === "de"
                  ? "Keine Installation nötig, läuft direkt im Browser"
                  : "No installation needed, runs directly in your browser"}
              </p>
            </div>
          </div>

          {/* Right: iPhone mockup */}
          <div ref={phoneReveal.ref} style={phoneReveal.style} className="relative mx-auto md:mx-0 flex-shrink-0">
            {/* Glow behind phone */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 60%, ${ice(0.18)} 0%, transparent 70%)`, filter: "blur(30px)", zIndex: 0 }} />

            {/* iPhone outer shell. Die Grautöne hier sind Gerätefarben,
                kein Markenklima, deshalb bleiben sie fest. */}
            <div style={{
              position: "relative",
              width: "270px",
              borderRadius: "52px",
              background: "linear-gradient(160deg, #3a3a3c 0%, #1c1c1e 40%, #2a2a2c 100%)",
              padding: "3px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)",
              zIndex: 1,
            }}>
              {/* Side buttons, volume */}
              <div style={{ position: "absolute", left: "-3px", top: "110px", width: "3px", height: "34px", background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
              <div style={{ position: "absolute", left: "-3px", top: "154px", width: "3px", height: "34px", background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
              <div style={{ position: "absolute", left: "-3px", top: "80px",  width: "3px", height: "22px", background: "#3a3a3c", borderRadius: "2px 0 0 2px" }} />
              {/* Side button, power */}
              <div style={{ position: "absolute", right: "-3px", top: "130px", width: "3px", height: "60px", background: "#3a3a3c", borderRadius: "0 2px 2px 0" }} />

              {/* Screen bezel */}
              <div style={{
                borderRadius: "50px",
                overflow: "hidden",
                background: "rgb(var(--c-deep))",
                position: "relative",
              }}>
                {/* Dynamic Island */}
                <div style={{
                  position: "absolute",
                  top: "14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "110px",
                  height: "34px",
                  background: "#000",
                  borderRadius: "20px",
                  zIndex: 10,
                }} />

                {/* App screen content.
                    Hier lag vorher das alte Musterbild. Es füllt mit dem
                    Jambalaya-Braun des Sommers und kennt keine CSS-Variablen.
                    Die Datei bleibt für das Catering liegen, das sie legitim
                    nutzt. Statt einer zweiten SVG-Datei steht das Muster jetzt
                    als Verlauf hier: gleiche Anmutung, aber es hängt an
                    denselben Variablen wie der Rest und schaltet mit dem
                    Farbklima um. Abweichung vom Plan, der eine eigene Datei
                    pattern-onice.svg vorsah: die gehört nicht zu dieser Seite
                    und würde sonst als toter Pfad enden. */}
                <div style={{
                  aspectRatio: "9/19.5",
                  display: "flex",
                  flexDirection: "column",
                  backgroundImage: [
                    `radial-gradient(circle at 50% 50%, ${ice(0.16)} 0 34%, transparent 35%)`,
                    `radial-gradient(circle at 50% 50%, rgba(${HIBISCUS_RGB},0.22) 0 34%, transparent 35%)`,
                    "linear-gradient(90deg, rgb(var(--c-deep)) 0 50%, rgb(var(--c-ground)) 50% 100%)",
                  ].join(", "),
                  backgroundSize: "104px 104px, 104px 104px, 104px 104px",
                  backgroundPosition: "0 0, 52px 52px, 0 0",
                  backgroundRepeat: "repeat",
                  position: "relative",
                }}>
                  {/* Dark overlay for readability. Etwas dichter als vorher,
                      weil das kalte Muster heller liest als das braune. */}
                  <div style={{ position: "absolute", inset: 0, background: "rgb(var(--c-ground) / 0.86)" }} />

                  {/* Status bar spacer */}
                  <div style={{ height: "58px", flexShrink: 0 }} />

                  {/* App content */}
                  <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", padding: "0 20px 24px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: text(0.5), letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        {locale === "de" ? "Mein ON ICE" : "My ON ICE"}
                      </span>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: ice(0.15), border: `1px solid ${ice(0.3)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ice(0.9)} strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    </div>

                    {/* Passport card. Die Kennzahlen kamen vorher aus der
                        Sommerausgabe: eine genaue Bar-Zahl, Tage statt Nächte
                        und ein Preis unterhalb der öffentlichen Untergrenze.
                        Jetzt aus der Eventquelle und aus currentPrice(). */}
                    <div style={{ background: `linear-gradient(135deg, ${ice(0.25)} 0%, rgba(${HIBISCUS_RGB},0.15) 100%)`, border: `1px solid ${ice(0.3)}`, borderRadius: "16px", padding: "14px 16px", marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <div>
                          <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: ice(0.8), letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2px" }}>
                            {EVENT.name} {EVENT.edition}
                          </p>
                          <p style={{ fontFamily: "sans-serif", fontSize: "15px", fontWeight: 700, color: "rgb(var(--c-text))", letterSpacing: "-0.01em" }}>
                            {locale === "de" ? "Dein Pass" : "Your Pass"}
                          </p>
                        </div>
                        <svg viewBox="0 0 100 100" width="28" height="28" fill={ice(0.9)}>
                          <path d="M50 0 C52 38,62 48,100 50 C62 52,52 62,50 100 C48 62,38 52,0 50 C38 48,48 38,50 0Z" />
                        </svg>
                      </div>
                      <div style={{ display: "flex", gap: "16px" }}>
                        <div>
                          <p style={{ fontFamily: "sans-serif", fontSize: "8px", color: text(0.4), textTransform: "uppercase", letterSpacing: "0.1em" }}>Bars</p>
                          <p style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: 700, color: "rgb(var(--c-text))" }}>{EVENT.barsLabel}</p>
                        </div>
                        <div>
                          <p style={{ fontFamily: "sans-serif", fontSize: "8px", color: text(0.4), textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {locale === "de" ? "Nächte" : "Nights"}
                          </p>
                          <p style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: 700, color: "rgb(var(--c-text))" }}>{EVENT.nights}</p>
                        </div>
                        <div>
                          <p style={{ fontFamily: "sans-serif", fontSize: "8px", color: text(0.4), textTransform: "uppercase", letterSpacing: "0.1em" }}>Pass</p>
                          <p style={{ fontFamily: "sans-serif", fontSize: "13px", fontWeight: 700, color: "rgb(var(--c-text))" }}>{price} €</p>
                        </div>
                      </div>
                    </div>

                    {/* Stamp row. Zehn Felder liessen den Pass wie einen
                        Zehnerpass aussehen, es sind 12 Nächte. */}
                    <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: text(0.4), textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
                      {locale === "de" ? "Deine Stempel" : "Your Stamps"}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                      {[...Array(EVENT.nights)].map((_, i) => (
                        <div key={i} style={{ width: "22px", height: "22px", borderRadius: "50%", background: i < 3 ? ice(0.9) : text(0.07), border: i < 3 ? "none" : `1px solid ${text(0.12)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {i < 3 && <svg viewBox="0 0 100 100" width="10" height="10" fill="rgb(var(--c-ground))"><path d="M50 0 C52 38,62 48,100 50 C62 52,52 62,50 100 C48 62,38 52,0 50 C38 48,48 38,50 0Z" /></svg>}
                        </div>
                      ))}
                    </div>

                    {/* Bar list mini */}
                    <p style={{ fontFamily: "sans-serif", fontSize: "9px", color: text(0.4), textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
                      {locale === "de" ? "Bars in deiner Nähe" : "Bars near you"}
                    </p>
                    {mockBars.map((bar, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", marginBottom: "5px", background: text(0.04), borderRadius: "10px", border: `1px solid ${text(0.06)}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: ice(0.8), flexShrink: 0 }} />
                          <span style={{ fontFamily: "sans-serif", fontSize: "10px", color: text(0.75) }}>{bar.name[locale]}</span>
                        </div>
                        <span style={{ fontFamily: "sans-serif", fontSize: "9px", color: ice(0.7) }}>{bar.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Damit niemand die Kacheln für eine Teilnehmerliste oder den
                Stempelstand für echt hält. */}
            <p className="text-[10px] font-body text-bone/40 text-center mt-4">
              {locale === "de" ? "Beispielansicht" : "Sample view"}
            </p>
          </div>
        </div>
      </section>

      {/* How it works, compact horizontal */}
      <section className="py-16 md:py-24 bg-jambalaya/40 border-y border-bone/10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-display text-bone text-center mb-4">
            {locale === "de" ? "SO FUNKTIONIERT'S" : "HOW IT WORKS"}
          </h2>
          <p className="text-center text-bone/65 font-body text-sm md:text-base mb-14">
            {locale === "de"
              ? `In 4 Schritten zu ${EVENT.nights} Nächten Cocktail-Kultur`
              : `4 steps to ${EVENT.nights} nights of cocktail culture`}
          </p>

          <div ref={stepsReveal.ref} style={stepsReveal.style} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center bg-licorice/60 border border-bone/10 rounded-2xl p-5 md:p-6">
                <span className="text-4xl md:text-5xl font-display text-tangerine block mb-3">{step.num}</span>
                <h3 className="text-sm md:text-base font-display text-bone mb-2">{step.title[locale]}</h3>
                <p className="text-xs font-body text-bone/75 leading-relaxed">{step.desc[locale]}</p>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-5 -right-3 w-6 h-px bg-bone/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 text-center">
        <div ref={ctaReveal.ref} style={ctaReveal.style} className="max-w-lg mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display text-bone mb-4">
            {locale === "de" ? "BEREIT FÜR ON ICE?" : "READY FOR ON ICE?"}
          </h2>
          <p className="text-sm font-body text-bone/65 mb-8">
            {locale === "de"
              ? "Sichere dir deinen Pass und erlebe 12 Nächte Cocktail-Kultur in Münchens Bars, vom 17. bis 28. November."
              : "Get your pass and experience 12 nights of cocktail culture in Munich's bars, November 17 to 28."}
          </p>
          <CheckoutButton
            href={CHECKOUT.single}
            value={price}
            contentName="ON ICE Pass (/app Footer)"
            label={locale === "de" ? "PASS SICHERN" : "GET YOUR PASS"}
            className="btn-primary text-base px-10 py-4 inline-block"
          />
        </div>
      </section>
    </main>
  );
}
