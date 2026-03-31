"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import Image from "next/image";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";
import { INSTAGRAM_POSTS } from "@/data/instagram-posts";

const FALLBACK_IMAGES = [
  { src: "/images/festival-cocktails-duo.webp", alt: "Cocktail art" },
  { src: "/images/festival-friends.webp", alt: "Bar scene" },
  { src: "/images/L1030863_CocktailX_adriancamo.webp", alt: "Signature cocktails" },
  { src: "/images/festival-bar-scene.webp", alt: "Bartenders" },
  { src: "/images/L1030894_CocktailX_adriancamo.webp", alt: "Festival vibes" },
  { src: "/images/festival-lounge.webp", alt: "Bar experience" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.16V11.7a4.84 4.84 0 01-3.77-1.77V6.69h3.77z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Extracts the shortcode from an Instagram URL */
function getShortcode(url: string): string {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  return match?.[1] ?? "";
}

function InstaEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Trigger Instagram embed processing after mount
    const w = window as unknown as { instgrm?: { Embeds: { process: () => void } } };
    w.instgrm?.Embeds?.process();
  }, []);

  const shortcode = getShortcode(url);

  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square overflow-hidden rounded-xl bg-jambalaya block"
    >
      {/* Use Instagram CDN thumbnail — public, no token needed */}
      <img
        src={`https://www.instagram.com/p/${shortcode}/media/?size=m`}
        alt="Instagram post"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          // Hide broken image, fallback handled by parent
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-licorice/0 group-hover:bg-licorice/40 transition-colors duration-300 flex items-center justify-center">
        <InstagramIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </a>
  );
}

export default function SocialFeed() {
  const t = useTranslations("social");
  const grid = useReveal({ delay: 200 });
  const buttons = useReveal({ delay: 300 });

  const hasLivePosts = INSTAGRAM_POSTS.length > 0;

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <BlurText
          text="@cocktailxfestival"
          tag="h2"
          className="text-3xl md:text-5xl lg:text-6xl font-display text-bone text-center"
          delay={80}
          duration={0.7}
        />
        <div ref={buttons.ref} style={buttons.style}>
          <p className="mt-4 text-base md:text-lg font-body text-bone/80">
            {t("subheadline")}
          </p>
        </div>

        {/* Grid */}
        <div
          ref={grid.ref}
          style={grid.style}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 mt-12"
        >
          {hasLivePosts
            ? INSTAGRAM_POSTS.slice(0, 6).map((url) => (
                <InstaEmbed key={url} url={url} />
              ))
            : FALLBACK_IMAGES.map((image, index) => (
                <a
                  key={image.src}
                  href="https://www.instagram.com/cocktailxfestival/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-xl bg-jambalaya"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-licorice/0 group-hover:bg-licorice/40 transition-colors duration-300 flex items-center justify-center">
                    <InstagramIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </a>
              ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <a
            href="https://www.instagram.com/cocktailxfestival/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3 text-base"
          >
            <InstagramIcon className="w-5 h-5" />
            {t("followButton")}
          </a>

          <div className="flex items-center gap-5">
            <a href="https://www.tiktok.com/@cocktailxfestival" target="_blank" rel="noopener noreferrer" className="text-bone/55 hover:text-tangerine transition-colors duration-300" aria-label="TikTok">
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100090270165472" target="_blank" rel="noopener noreferrer" className="text-bone/55 hover:text-tangerine transition-colors duration-300" aria-label="Facebook">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/company/cocktailx" target="_blank" rel="noopener noreferrer" className="text-bone/55 hover:text-tangerine transition-colors duration-300" aria-label="LinkedIn">
              <LinkedInIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
