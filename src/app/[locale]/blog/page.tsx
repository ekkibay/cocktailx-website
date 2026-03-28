"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";
import { blogPosts } from "@/data/blog-posts";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

function BlogCard({ post, index, locale }: { post: typeof blogPosts[0]; index: number; locale: "de" | "en" }) {
  const reveal = useReveal({ delay: index * 100 });
  return (
    <div ref={reveal.ref} style={reveal.style}>
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="group block bg-bone/5 border border-bone/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="relative aspect-video">
          <Image
            src={post.image}
            alt={post.title[locale]}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <span className="inline-block bg-hibiscus/20 text-hibiscus text-xs font-body uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            {post.category}
          </span>
          <h3 className="text-xl font-display text-bone mb-2">
            {post.title[locale]}
          </h3>
          <p className="text-bone/65 font-body text-sm mb-3 line-clamp-2">
            {post.excerpt[locale]}
          </p>
          <p className="text-bone/30 font-body text-xs">{post.date}</p>
        </div>
      </Link>
    </div>
  );
}

export default function BlogPage() {
  const locale = useLocale() as "de" | "en";
  const [email, setEmail] = useState("");

  const featuredPost = blogPosts.find((p) => p.featured);
  const otherPosts = blogPosts.filter((p) => !p.featured);

  const revealFeatured = useReveal();
  const revealNewsletterTitle = useReveal();
  const revealNewsletterForm = useReveal<HTMLFormElement>({ delay: 150 });

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

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
      <section className="section-padding text-center min-h-[30vh] flex flex-col items-center justify-center">
        <BlurText
          text="BLOG"
          tag="h1"
          className="text-5xl md:text-7xl lg:text-8xl font-display text-bone"
          delay={80}
          duration={0.7}
        />
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="section-padding pt-0">
          <div
            ref={revealFeatured.ref}
            style={revealFeatured.style}
            className="max-w-6xl mx-auto"
          >
            <Link
              href={`/${locale}/blog/${featuredPost.slug}`}
              className="group grid md:grid-cols-2 gap-0 bg-bone/5 border border-bone/10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative aspect-video md:aspect-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <span className="inline-block bg-tangerine/20 text-tangerine text-xs font-body uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-display text-bone mb-4">
                  {featuredPost.title[locale]}
                </h2>
                <p className="text-bone/80 font-body mb-4">
                  {featuredPost.excerpt[locale]}
                </p>
                <p className="text-bone/55 font-body text-sm">
                  {featuredPost.date}
                </p>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      {otherPosts.length > 0 && (
        <section className="section-padding pt-0">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="section-padding">
        <div className="max-w-xl mx-auto text-center">
          <h2
            ref={revealNewsletterTitle.ref}
            style={revealNewsletterTitle.style}
            className="text-3xl md:text-4xl font-display text-bone mb-8"
          >
            {locale === "de" ? "NEWSLETTER ABONNIEREN" : "SUBSCRIBE TO NEWSLETTER"}
          </h2>
          <form
            onSubmit={handleNewsletter}
            ref={revealNewsletterForm.ref}
            style={revealNewsletterForm.style}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={locale === "de" ? "Deine E-Mail-Adresse" : "Your email address"}
              className="flex-1 bg-transparent border border-bone/20 rounded-lg px-4 py-3 text-bone font-body placeholder:text-bone/30 focus:border-tangerine focus:outline-none transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              {locale === "de" ? "ABONNIEREN" : "SUBSCRIBE"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
