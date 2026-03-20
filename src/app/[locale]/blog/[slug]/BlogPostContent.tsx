"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useLocale } from "next-intl";
import type { BlogPost } from "@/data/blog-posts";

export default function BlogPostContent({ post }: { post: BlogPost }) {
  const locale = useLocale() as "de" | "en";
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <main>
      {/* Full-width Header Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <Image
          src={post.image}
          alt={post.title[locale]}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/50 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-tangerine/20 text-tangerine text-xs font-body uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-bone mb-4">
            {post.title[locale]}
          </h1>
          <p className="text-bone/40 font-body mb-12">{post.date}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-bone/80 font-body text-lg leading-relaxed space-y-6"
        >
          <p>{post.content[locale]}</p>
        </motion.div>
      </article>

      {/* Newsletter */}
      <section className="section-padding mt-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-display text-bone mb-6">
            {locale === "de" ? "NEWSLETTER ABONNIEREN" : "SUBSCRIBE TO NEWSLETTER"}
          </h2>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
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
