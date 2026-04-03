"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Wine, Users, Heart, Compass } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";


const useCases = [
  { key: "cocktailLovers", Icon: Wine, image: "/images/festival-cocktails-duo.webp" },
  { key: "friends", Icon: Users, image: "/images/festival-friends.webp" },
  { key: "dateNight", Icon: Heart, image: "/images/festival-lounge.webp" },
  { key: "explorers", Icon: Compass, image: "/images/festival-bar-scene.webp" },
] as const;

export default function About() {
  const t = useTranslations("about");
  const fw = useTranslations("forWhom");
  const text = useReveal({ delay: 200 });
  const image = useReveal({ delay: 300, direction: "left" });
  const stats = useReveal({ delay: 150 });
  const forWhomCards = useReveal({ delay: 250 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <BlurText
              text={t("headline")}
              tag="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-display text-bone leading-tight"
              delay={80}
              duration={0.7}
            />
            <div
              ref={text.ref}
              style={text.style}
            >
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-body font-bold text-tangerine bg-tangerine/10 px-3 py-1 rounded-full">
                  {t("edition")}
                </span>
                <span className="text-xs font-body font-bold text-bone/65 bg-bone/5 px-3 py-1 rounded-full">
                  {t("visitors")}
                </span>
              </div>
              <p className="mt-4 text-base md:text-lg font-body text-bone/85 leading-relaxed max-w-xl">
                {t("description")}
              </p>
              <a
                href="#tickets"
                className="btn-primary mt-8 inline-block"
              >
                {t("cta")}
              </a>
            </div>
          </div>

          {/* Right: video */}
          <div
            ref={image.ref}
            style={image.style}
            className="relative aspect-[4/3] rounded-2xl bg-jambalaya overflow-hidden group"
          >
            <video
              ref={videoRef}
              src="/videos/highlights.mp4"
              poster="/images/festival-cheers.webp"
              muted
              playsInline
              loop
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <button
              onClick={togglePlay}
              className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
              aria-label={playing ? "Pause" : "Play"}
            >
              {!playing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-tangerine/90 group-hover:bg-tangerine group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                    <svg className="w-7 h-7 md:w-8 md:h-8 text-licorice ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </button>

            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-licorice/70 backdrop-blur-sm flex items-center justify-center hover:bg-licorice/90 transition-colors"
              aria-label={muted ? "Sound einschalten" : "Sound ausschalten"}
            >
              {muted ? (
                <svg className="w-4 h-4 text-bone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-bone" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={stats.ref}
          style={stats.style}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 pt-16 border-t border-bone/10 [&>div]:w-[calc(33%-1.5rem)] [&>div]:sm:w-auto"
        >
          <AnimatedCounter target={58} label={t("bars")} />
          <AnimatedCounter target={18} label={t("days")} />
          <AnimatedCounter target={1} label={t("passport")} />
          <AnimatedCounter target={5000} suffix="+" label={t("expectedGuests")} />
        </div>

        {/* For Whom — integrated */}
        <div className="mt-16 pt-16 border-t border-bone/10">
          <h3 className="text-2xl md:text-3xl font-display text-bone text-center mb-3">
            {fw("headline")}
          </h3>
          <p className="text-center text-sm md:text-base font-body text-bone/80 mb-10">
            {fw("subheadline")}
          </p>

          <div ref={forWhomCards.ref} style={forWhomCards.style} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {useCases.map(({ key, Icon, image: img }) => (
              <div
                key={key}
                className="flex flex-col rounded-2xl border border-bone/10 bg-licorice/50 overflow-hidden
                  transition-all duration-300 ease-out
                  hover:border-bone/25 hover:bg-bone/[0.03] hover:shadow-[0_4px_30px_rgba(245,240,232,0.06)]
                  relative
                  before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-tangerine before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:z-10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img}
                    alt={fw(`${key}.title`)}
                    fill
                    sizes="(max-width: 640px) 45vw, 250px"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-licorice/80 to-transparent" />
                </div>
                <div className="flex flex-col items-center text-center p-4 md:p-6">
                  <div className="w-10 h-10 rounded-full bg-tangerine/10 flex items-center justify-center mb-3 -mt-8 relative z-10 border-2 border-licorice">
                    <Icon className="w-5 h-5 text-tangerine" />
                  </div>
                  <h3 className="text-sm md:text-base font-display text-bone mb-2">
                    {fw(`${key}.title`)}
                  </h3>
                  <p className="text-xs font-body text-bone/80 leading-relaxed">
                    {fw(`${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
