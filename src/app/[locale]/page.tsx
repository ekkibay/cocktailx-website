"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import BarsSlider from "@/components/sections/BarsSlider";
import EventsTimeline from "@/components/sections/EventsTimeline";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <BarsSlider />
      <EventsTimeline />
    </main>
  );
}
