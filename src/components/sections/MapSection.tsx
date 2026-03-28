"use client";

import { useLocale, useTranslations } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

// 50+ Bar-Positionen verteilt über Münchner Stadtteile
// Koordinaten relativ zum SVG viewBox (0-800, 0-600)
const BAR_PINS = [
  // Altstadt-Lehel (Zentrum)
  { x: 400, y: 280 }, { x: 415, y: 295 }, { x: 385, y: 270 },
  { x: 420, y: 265 }, { x: 395, y: 300 }, { x: 410, y: 250 },
  { x: 430, y: 285 }, { x: 375, y: 290 }, { x: 405, y: 310 },
  // Maxvorstadt (Nordwest vom Zentrum)
  { x: 340, y: 220 }, { x: 360, y: 230 }, { x: 325, y: 240 },
  { x: 350, y: 210 }, { x: 370, y: 245 }, { x: 335, y: 255 },
  { x: 355, y: 195 },
  // Schwabing (Norden)
  { x: 380, y: 160 }, { x: 395, y: 145 }, { x: 365, y: 170 },
  { x: 410, y: 155 }, { x: 350, y: 150 }, { x: 390, y: 130 },
  { x: 375, y: 180 }, { x: 405, y: 170 },
  // Glockenbachviertel (Süd-Zentrum)
  { x: 380, y: 330 }, { x: 395, y: 345 }, { x: 365, y: 340 },
  { x: 410, y: 335 }, { x: 385, y: 355 }, { x: 370, y: 320 },
  // Haidhausen (Ost)
  { x: 470, y: 300 }, { x: 485, y: 315 }, { x: 460, y: 285 },
  { x: 495, y: 295 }, { x: 475, y: 325 }, { x: 490, y: 270 },
  { x: 465, y: 310 },
  // Sendling (Süden)
  { x: 350, y: 390 }, { x: 370, y: 400 }, { x: 340, y: 380 },
  { x: 385, y: 395 }, { x: 355, y: 410 },
  // Westend / Schwanthalerhöhe
  { x: 300, y: 300 }, { x: 315, y: 315 }, { x: 290, y: 285 },
  { x: 305, y: 330 },
  // Neuhausen-Nymphenburg (Westen)
  { x: 250, y: 230 }, { x: 265, y: 245 }, { x: 240, y: 260 },
  { x: 275, y: 220 },
  // Au (Südost)
  { x: 440, y: 340 }, { x: 455, y: 355 }, { x: 445, y: 365 },
  // Bogenhausen (Nordost)
  { x: 490, y: 210 }, { x: 505, y: 225 }, { x: 480, y: 195 },
];

function MunichMapSVG() {
  return (
    <svg
      viewBox="170 80 460 440"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow-Effekt für Pins */}
        <filter id="pin-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Puls-Animation */}
        <radialGradient id="pin-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f39200" stopOpacity="1" />
          <stop offset="100%" stopColor="#f39200" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Hintergrund */}
      <rect width="800" height="600" fill="#1A120B" />

      {/* München Stadtgrenze (nur subtiler Stroke) */}
      <path
        d="M400 60 C480 55, 560 80, 610 130 C660 180, 680 250, 670 320 C660 390, 630 440, 580 475 C530 510, 460 530, 400 535 C340 530, 270 510, 220 475 C170 440, 140 390, 130 320 C120 250, 140 180, 190 130 C240 80, 320 55, 400 60Z"
        fill="none"
        stroke="#e4d6c5"
        strokeWidth="0.5"
        strokeOpacity="0.08"
      />

      {/* Englischer Garten (großer grüner Bereich im Nordosten) */}
      <path
        d="M420 80 C440 85, 460 100, 470 130 C480 160, 475 200, 465 240 C455 270, 440 290, 430 280 C420 260, 425 220, 430 180 C435 140, 425 100, 420 80Z"
        fill="#1a3a1a"
        fillOpacity="0.3"
      />

      {/* Olympiapark (Nordwesten) */}
      <ellipse cx="300" cy="140" rx="35" ry="25" fill="#1a3a1a" fillOpacity="0.25" />

      {/* Isar (Fluss) - mit Fade an den Enden */}
      <defs>
        <linearGradient id="isar-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a5a" stopOpacity="0" />
          <stop offset="15%" stopColor="#1a3a5a" stopOpacity="0.4" />
          <stop offset="75%" stopColor="#1a3a5a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1a3a5a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="isar-highlight-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a5a8a" stopOpacity="0" />
          <stop offset="15%" stopColor="#2a5a8a" stopOpacity="0.3" />
          <stop offset="75%" stopColor="#2a5a8a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2a5a8a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M445 100 C440 140, 435 180, 438 220 C441 260, 435 300, 430 340 C425 380, 428 400, 425 430"
        fill="none"
        stroke="url(#isar-fade)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M445 100 C440 140, 435 180, 438 220 C441 260, 435 300, 430 340 C425 380, 428 400, 425 430"
        fill="none"
        stroke="url(#isar-highlight-fade)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Hauptbahnhof Bereich */}
      <rect x="310" y="270" width="20" height="15" rx="2" fill="#3a2a1a" fillOpacity="0.4" />

      {/* Ring-Straßen (Altstadtring) */}
      <ellipse
        cx="395"
        cy="280"
        rx="55"
        ry="45"
        fill="none"
        stroke="#e4d6c5"
        strokeWidth="0.8"
        strokeOpacity="0.1"
        strokeDasharray="4 3"
      />
      {/* Mittlerer Ring */}
      <ellipse
        cx="395"
        cy="290"
        rx="130"
        ry="120"
        fill="none"
        stroke="#e4d6c5"
        strokeWidth="0.6"
        strokeOpacity="0.07"
        strokeDasharray="6 4"
      />

      {/* Stadtteil-Labels */}
      <text x="395" y="278" textAnchor="middle" fill="#e4d6c5" fontSize="9" opacity="0.25" fontFamily="sans-serif" fontWeight="600" letterSpacing="2">ALTSTADT</text>
      <text x="340" y="215" textAnchor="middle" fill="#e4d6c5" fontSize="8" opacity="0.2" fontFamily="sans-serif" letterSpacing="1.5">MAXVORSTADT</text>
      <text x="385" y="125" textAnchor="middle" fill="#e4d6c5" fontSize="8" opacity="0.2" fontFamily="sans-serif" letterSpacing="1.5">SCHWABING</text>
      <text x="380" y="360" textAnchor="middle" fill="#e4d6c5" fontSize="7" opacity="0.2" fontFamily="sans-serif" letterSpacing="1.5">GLOCKENBACH</text>
      <text x="480" y="305" textAnchor="middle" fill="#e4d6c5" fontSize="8" opacity="0.2" fontFamily="sans-serif" letterSpacing="1.5">HAIDHAUSEN</text>
      <text x="355" y="405" textAnchor="middle" fill="#e4d6c5" fontSize="8" opacity="0.2" fontFamily="sans-serif" letterSpacing="1.5">SENDLING</text>
      <text x="255" y="248" textAnchor="middle" fill="#e4d6c5" fontSize="7" opacity="0.2" fontFamily="sans-serif" letterSpacing="1">NEUHAUSEN</text>
      <text x="495" y="215" textAnchor="middle" fill="#e4d6c5" fontSize="7" opacity="0.2" fontFamily="sans-serif" letterSpacing="1">BOGENHAUSEN</text>

      {/* Marienplatz Stern (Zentrum) */}
      <path
        d="M397 275 C398 270, 399 270, 400 265 C401 270, 402 270, 403 275 C402 276, 402 277, 405 278 C402 279, 402 280, 403 283 C402 280, 401 280, 400 285 C399 280, 398 280, 397 283 C398 280, 398 279, 395 278 C398 277, 398 276, 397 275Z"
        fill="#f39200"
        opacity="0.6"
      />

      {/* 50+ Bar-Pins mit Puls-Animation */}
      {BAR_PINS.map((pin, i) => (
        <g key={i}>
          {/* Äußerer Puls-Ring */}
          <circle
            cx={pin.x}
            cy={pin.y}
            r="6"
            fill="none"
            stroke="#f39200"
            strokeWidth="1"
            opacity="0"
          >
            <animate
              attributeName="r"
              values="3;8"
              dur={`${2 + (i % 5) * 0.3}s`}
              begin={`${(i % 8) * 0.25}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6;0"
              dur={`${2 + (i % 5) * 0.3}s`}
              begin={`${(i % 8) * 0.25}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* Pin-Punkt */}
          <circle
            cx={pin.x}
            cy={pin.y}
            r="3"
            fill="#f39200"
            opacity={0.6 + (i % 3) * 0.15}
            filter="url(#pin-glow)"
          />
        </g>
      ))}

      {/* "MÜNCHEN" Label */}
      <text x="400" y="565" textAnchor="middle" fill="#e4d6c5" fontSize="12" opacity="0.3" fontFamily="sans-serif" fontWeight="700" letterSpacing="6">MÜNCHEN</text>
    </svg>
  );
}

export default function MapSection() {
  const t = useTranslations("map");
  const locale = useLocale();
  const subtitle = useReveal<HTMLParagraphElement>({ delay: 150 });
  const map = useReveal({ delay: 250, scale: 0.97 });
  const cta = useReveal<HTMLAnchorElement>({ delay: 350 });

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-tangerine animate-pulse" />
          <span className="text-xs font-body font-bold text-tangerine uppercase tracking-widest">50+ Bars</span>
        </div>
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-3xl md:text-4xl font-display text-bone mb-4 text-center"
          delay={70}
          duration={0.7}
        />

        <p
          ref={subtitle.ref}
          style={subtitle.style}
          className="text-sm md:text-base font-body text-bone/80 mb-12"
        >
          {t("subtitle")}
        </p>

        <div ref={map.ref} style={map.style} className="relative mx-[-4rem] md:mx-0">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              maskImage: "radial-gradient(ellipse 70% 65% at center, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 65% at center, black 40%, transparent 100%)",
            }}
          >
            <MunichMapSVG />
          </div>

          {/* Button über dem Fade-Bereich */}
          <div className="absolute bottom-4 md:bottom-16 left-0 right-0 flex justify-center z-10">
            <a
              ref={cta.ref}
              style={cta.style}
              href={`/${locale}/festival/bars`}
              className="btn-secondary inline-block"
            >
              {t("cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
