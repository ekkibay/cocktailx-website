"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const content = {
  story: {
    de: [
      "Cocktail X wurde aus der Überzeugung geboren, dass München mehr ist als Bier und Brezn. Es ist eine Stadt mit einer pulsierenden, weltoffenen Bar-Kultur, die nur darauf wartet, entdeckt zu werden.",
      "Inspiriert von der goldenen Ära der italienischen Aperitivo-Kultur und dem rauen Charme der Münchner Nächte, entstand 2023 die Idee zu einem Festival, das beides vereint: La Dolce Vita trifft auf bayerische Gemütlichkeit.",
      "Was als kleines Experiment mit 25 Bars begann, ist heute Münchens größtes Cocktail-Festival. Jedes Jahr verwandeln wir die Stadt in eine einzige große Bar-Tour, bei der jeder Drink eine Geschichte erzählt und jede Bar ein neues Kapitel aufschlägt.",
    ],
    en: [
      "Cocktail X was born from the conviction that München is more than beer and pretzels. It's a city with a vibrant, cosmopolitan bar culture just waiting to be discovered.",
      "Inspired by the golden era of Italian aperitivo culture and the raw charm of München nights, the idea for a festival that combines both emerged in 2023: La Dolce Vita meets Bavarian Gemütlichkeit.",
      "What started as a small experiment with 25 bars is now München's biggest cocktail festival. Every year, we transform the city into one grand bar tour, where every drink tells a story and every bar opens a new chapter.",
    ],
  },
  mission: {
    de: "Unsere Mission ist es, die Cocktailkultur Münchens zu feiern, neue Talente zu fördern und Menschen durch die Kunst des Mixens zusammenzubringen. Jeder Schluck soll ein Erlebnis sein.",
    en: "Our mission is to celebrate München's cocktail culture, nurture new talent, and bring people together through the art of mixing. Every sip should be an experience.",
  },
  founder: {
    name: "Jennifer Mindl",
    role: { de: "Gründerin & Geschäftsführerin", en: "Founder & CEO" },
    image: "/images/festival-bartender-pour.webp",
  },
};

function StoryParagraph({ text, index }: { text: string; index: number }) {
  const reveal = useReveal<HTMLParagraphElement>({ delay: index * 100 });
  return (
    <p
      ref={reveal.ref}
      style={reveal.style}
      className="text-base md:text-lg font-body text-bone/85 leading-relaxed"
    >
      {text}
    </p>
  );
}

export default function AboutPage() {
  const locale = useLocale() as "de" | "en";
  const revealStory = useReveal();
  const revealMission = useReveal();
  const revealTeam = useReveal();

  return (
    <main className="section-padding relative">
      {/* CI background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.18 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-200px", right:"-200px", width:"600px", height:"600px", borderRadius:"50%", background:"rgba(243,146,0,0.12)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", top:"30%", left:"-200px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(189,37,110,0.10)", filter:"blur(110px)" }} />
      </div>
      <div className="max-w-4xl mx-auto relative">
        {/* Title */}
        <BlurText
          text="ABOUT US"
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-16"
          delay={80}
          duration={0.7}
        />

        {/* Brand Story */}
        <div
          ref={revealStory.ref}
          style={revealStory.style}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-display text-tangerine mb-8">
            {locale === "de" ? "UNSERE GESCHICHTE" : "OUR STORY"}
          </h2>
          <div className="space-y-6">
            {content.story[locale].map((paragraph, i) => (
              <StoryParagraph key={i} text={paragraph} index={i} />
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div
          ref={revealMission.ref}
          style={revealMission.style}
          className="mb-20 p-8 md:p-12 rounded-2xl bg-jambalaya/20 border border-bone/10 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display text-bone mb-6">
            {locale === "de" ? "UNSERE MISSION" : "OUR MISSION"}
          </h2>
          <p className="text-lg md:text-xl font-body text-bone/80 leading-relaxed italic">
            &ldquo;{content.mission[locale]}&rdquo;
          </p>
        </div>

        {/* Team / Founder */}
        <div
          ref={revealTeam.ref}
          style={revealTeam.style}
        >
          <h2 className="text-2xl md:text-3xl font-display text-tangerine mb-10 text-center">
            {locale === "de" ? "DAS TEAM" : "THE TEAM"}
          </h2>
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden border-2 border-bone/10">
                <Image
                  src={content.founder.image}
                  alt={content.founder.name}
                  fill
                  sizes="(max-width: 768px) 160px, 208px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-display text-bone">
                {content.founder.name}
              </h3>
              <p className="text-sm font-body text-bone/65">
                {content.founder.role[locale]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
