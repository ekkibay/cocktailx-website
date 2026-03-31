"use client";

import Hero from "@/components/sections/Hero";

import About from "@/components/sections/About";
import HowItWorks from "@/components/sections/HowItWorks";
import BarsSlider from "@/components/sections/BarsSlider";
import Testimonials from "@/components/sections/Testimonials";
import FestivalGallery from "@/components/sections/FestivalGallery";
import EventsTimeline from "@/components/sections/EventsTimeline";
import Tickets from "@/components/sections/Tickets";
import MapSection from "@/components/sections/MapSection";
import FoundersBanner from "@/components/sections/FoundersBanner";
import SponsorsMarquee from "@/components/sections/SponsorsMarquee";
import PressQuotes from "@/components/sections/PressQuotes";
import FAQ from "@/components/sections/FAQ";
import SocialFeed from "@/components/sections/SocialFeed";
import Newsletter from "@/components/sections/Newsletter";
import StickyCTA from "@/components/ui/StickyCTA";
import StickyCountdownBanner from "@/components/ui/StickyCountdownBanner";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SponsorsMarquee />
      <About />
      <HowItWorks />
      <BarsSlider />
      <Testimonials />
      <EventsTimeline />
      <Tickets />
      <MapSection />
      <FoundersBanner />
      <FestivalGallery />
      <PressQuotes />
      <FAQ />
      <SocialFeed />
      <Newsletter />
      <StickyCTA />
      <StickyCountdownBanner />
    </main>
  );
}
