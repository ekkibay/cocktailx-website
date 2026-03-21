"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import BarsSlider from "@/components/sections/BarsSlider";
import EventsTimeline from "@/components/sections/EventsTimeline";
import HowItWorks from "@/components/sections/HowItWorks";
import Tickets from "@/components/sections/Tickets";
import FAQ from "@/components/sections/FAQ";
import MapSection from "@/components/sections/MapSection";
// import SponsorsMarquee from "@/components/sections/SponsorsMarquee";
import PressQuotes from "@/components/sections/PressQuotes";
import Newsletter from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <HowItWorks />
      <BarsSlider />
      <Tickets />
      <FAQ />
      <EventsTimeline />
      <MapSection />
      <PressQuotes />
      {/* <SponsorsMarquee /> */}
      <Newsletter />
    </main>
  );
}
