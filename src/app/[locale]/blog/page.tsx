"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "next-intl";
import { blogPosts } from "@/data/blog-posts";

export default function BlogPage() {
  const locale = useLocale() as "de" | "en";
  const [email, setEmail] = useState("");

  const featuredPost = blogPosts.find((p) => p.featured);
  const otherPosts = blogPosts.filter((p) => !p.featured);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <main>
      {/* Hero */}
      <section className="section-padding text-center min-h-[30vh] flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display text-bone"
        >
          BLOG
        </motion.h1>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="section-padding pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
                <p className="text-bone/60 font-body mb-4">
                  {featuredPost.excerpt[locale]}
                </p>
                <p className="text-bone/40 font-body text-sm">
                  {featuredPost.date}
                </p>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Posts Grid */}
      {otherPosts.length > 0 && (
        <section className="section-padding pt-0">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group block bg-bone/5 border border-bone/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title[locale]}
                      fill
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
                    <p className="text-bone/50 font-body text-sm mb-3 line-clamp-2">
                      {post.excerpt[locale]}
                    </p>
                    <p className="text-bone/30 font-body text-xs">{post.date}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="section-padding">
        <div className="max-w-xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-display text-bone mb-8"
          >
            {locale === "de" ? "NEWSLETTER ABONNIEREN" : "SUBSCRIBE TO NEWSLETTER"}
          </motion.h2>
          <motion.form
            onSubmit={handleNewsletter}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
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
          </motion.form>
        </div>
      </section>
    </main>
  );
}
