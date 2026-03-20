"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl md:text-7xl lg:text-8xl font-display text-tangerine"
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span className="text-xs font-body text-bone/60 uppercase tracking-widest mt-2">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ onTick }: { onTick?: () => void }) {
  const t = useTranslations("hero");
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    setMounted(true);

    function calcTime() {
      const now = new Date().getTime();
      const diff = FESTIVAL_DATE.getTime() - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    setTimeLeft(calcTime());
    const interval = setInterval(() => {
      setTimeLeft(calcTime());
      onTickRef.current?.();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="h-32" />;
  }

  return (
    <div className="flex items-center gap-3 md:gap-8">
      <CountdownUnit value={timeLeft.days} label={t("days")} />
      <span className="text-2xl md:text-5xl font-display text-bone/30 -mt-6">:</span>
      <CountdownUnit value={timeLeft.hours} label={t("hours")} />
      <span className="text-2xl md:text-5xl font-display text-bone/30 -mt-6">:</span>
      <CountdownUnit value={timeLeft.minutes} label={t("minutes")} />
      <span className="text-2xl md:text-5xl font-display text-bone/30 -mt-6">:</span>
      <CountdownUnit value={timeLeft.seconds} label={t("seconds")} />
    </div>
  );
}
