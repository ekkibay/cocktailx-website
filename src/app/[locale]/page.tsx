"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import BarsSlider from "@/components/sections/BarsSlider";
import EventsTimeline from "@/components/sections/EventsTimeline";
import HowItWorks from "@/components/sections/HowItWorks";
import ForWhom from "@/components/sections/ForWhom";
import Testimonials from "@/components/sections/Testimonials";
import Tickets from "@/components/sections/Tickets";
import FAQ from "@/components/sections/FAQ";
import MapSection from "@/components/sections/MapSection";
import SponsorsMarquee from "@/components/sections/SponsorsMarquee";
import PressQuotes from "@/components/sections/PressQuotes";
import Newsletter from "@/components/sections/Newsletter";
import FestivalGallery from "@/components/sections/FestivalGallery";
import SocialFeed from "@/components/sections/SocialFeed";
import StickyCTA from "@/components/ui/StickyCTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <HowItWorks />
      <Tickets />
      <ForWhom />
      <BarsSlider />
      <Testimonials />
      <FestivalGallery />
      <EventsTimeline />
      <MapSection />
      <SponsorsMarquee />
      <PressQuotes />
      <FAQ />
      <SocialFeed />
      <Newsletter />
      <StickyCTA />
    </main>
  );
}
