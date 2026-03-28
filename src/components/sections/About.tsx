"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

export default function About() {
  const t = useTranslations("about");
  const text = useReveal({ delay: 200 });
  const image = useReveal({ delay: 300, direction: "left" });
  const stats = useReveal({ delay: 150 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Fix: React doesn't forward the `muted` attribute to the DOM correctly,
  // so we set it imperatively to ensure autoplay is allowed by the browser.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  // Autoplay when scrolled into view, pause when out
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
                <span className="text-xs font-body font-bold text-bone/50 bg-bone/5 px-3 py-1 rounded-full">
                  {t("visitors")}
                </span>
              </div>
              <p className="mt-4 text-base md:text-lg font-body text-bone/70 leading-relaxed max-w-xl">
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

            {/* Click to play/pause */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
              aria-label={playing ? "Pause" : "Play"}
            >
              {/* Play icon — only shown when paused */}
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

            {/* Mute toggle */}
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
      </div>
    </section>
  );
}
