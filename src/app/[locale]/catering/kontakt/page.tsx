"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

export default function KontaktPage() {
  const locale = useLocale() as "de" | "en";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((value, key) => params.append(key, value.toString()));

    // TODO: Replace endpoint with real Formspree form ID (e.g. f/xyzabc12)
    fetch("https://formspree.io/f/xpwzodkp", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: params,
    })
      .then((res) => {
        if (res.ok) {
          setSubmitted(true);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat" }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.10]" style={{ background: "radial-gradient(circle, #00674F 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pt-40 pb-24">
        <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-green mb-4">
          {locale === "de" ? "Wir freuen uns auf euch" : "We look forward to hearing from you"}
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-ct-cream mb-6">
          {locale === "de" ? "ANFRAGE" : "ENQUIRY"}
        </h1>
        <p className="font-body text-ct-cream/65 mb-12 text-lg">
          {locale === "de"
            ? "Erzählt uns von eurem Event — wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot."
            : "Tell us about your event — we'll get back to you within 24 hours with a non-binding quote."}
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-ct-wine/40 bg-ct-wine/10 text-sm font-body text-ct-cream/80">
            {locale === "de"
              ? "Etwas ist schiefgelaufen. Bitte schreib uns direkt an catering@cocktail-x.com."
              : "Something went wrong. Please write to us directly at catering@cocktail-x.com."}
          </div>
        )}
        {submitted ? (
          <div className="text-center p-12 rounded-2xl border border-ct-green/30 bg-ct-green/[0.06]">
            <span className="font-display text-5xl text-ct-green block mb-4">✦</span>
            <h2 className="font-display text-3xl text-ct-cream mb-3">
              {locale === "de" ? "DANKE!" : "THANK YOU!"}
            </h2>
            <p className="font-body text-ct-cream/65">
              {locale === "de"
                ? "Wir haben eure Anfrage erhalten und melden uns bald."
                : "We've received your enquiry and will be in touch soon."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                  {locale === "de" ? "Name *" : "Name *"}
                </label>
                <input
                  name="name"
                  required
                  className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream placeholder-ct-cream/30 focus:outline-none focus:border-ct-green/50 transition-colors"
                  placeholder={locale === "de" ? "Euer Name" : "Your name"}
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                  {locale === "de" ? "Unternehmen" : "Company"}
                </label>
                <input
                  name="company"
                  className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream placeholder-ct-cream/30 focus:outline-none focus:border-ct-green/50 transition-colors"
                  placeholder={locale === "de" ? "Firmenname (optional)" : "Company name (optional)"}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                  {locale === "de" ? "E-Mail *" : "Email *"}
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream placeholder-ct-cream/30 focus:outline-none focus:border-ct-green/50 transition-colors"
                  placeholder="hello@example.com"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                  {locale === "de" ? "Telefon" : "Phone"}
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream placeholder-ct-cream/30 focus:outline-none focus:border-ct-green/50 transition-colors"
                  placeholder="+49 89 ..."
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                  {locale === "de" ? "Event-Art *" : "Event Type *"}
                </label>
                <select
                  name="eventType"
                  required
                  className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream focus:outline-none focus:border-ct-green/50 transition-colors"
                >
                  <option value="" className="bg-black">{locale === "de" ? "Bitte wählen" : "Please select"}</option>
                  <option value="corporate" className="bg-black">{locale === "de" ? "Firmenevent" : "Corporate Event"}</option>
                  <option value="wedding" className="bg-black">{locale === "de" ? "Hochzeit" : "Wedding"}</option>
                  <option value="birthday" className="bg-black">{locale === "de" ? "Geburtstag / Jubiläum" : "Birthday / Anniversary"}</option>
                  <option value="festival" className="bg-black">{locale === "de" ? "Festival / Outdoor" : "Festival / Outdoor"}</option>
                  <option value="other" className="bg-black">{locale === "de" ? "Sonstiges" : "Other"}</option>
                </select>
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                  {locale === "de" ? "Gästeanzahl" : "Guest Count"}
                </label>
                <select
                  name="guestCount"
                  className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream focus:outline-none focus:border-ct-green/50 transition-colors"
                >
                  <option value="" className="bg-black">{locale === "de" ? "Ca. Anzahl" : "Approx. number"}</option>
                  <option value="50-100" className="bg-black">50 – 100</option>
                  <option value="100-250" className="bg-black">100 – 250</option>
                  <option value="250-500" className="bg-black">250 – 500</option>
                  <option value="500+" className="bg-black">500+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                {locale === "de" ? "Event-Datum" : "Event Date"}
              </label>
              <input
                name="date"
                type="date"
                className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream focus:outline-none focus:border-ct-green/50 transition-colors"
              />
            </div>

            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-ct-cream/55 mb-2">
                {locale === "de" ? "Nachricht" : "Message"}
              </label>
              <textarea
                name="message"
                rows={5}
                className="w-full bg-ct-green/[0.05] border border-ct-green/20 rounded-xl px-4 py-3 font-body text-ct-cream placeholder-ct-cream/30 focus:outline-none focus:border-ct-green/50 transition-colors resize-none"
                placeholder={locale === "de"
                  ? "Erzählt uns mehr über euer Event, Location, besondere Wünsche..."
                  : "Tell us more about your event, venue, special requests..."}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-ct-green text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-green/80 transition-all duration-200"
            >
              {locale === "de" ? "Anfrage senden" : "Send Enquiry"}
            </button>

            <p className="text-xs font-body text-ct-cream/40 text-center">
              {locale === "de"
                ? "Mit dem Absenden stimmt ihr unserer Datenschutzerklärung zu."
                : "By submitting you agree to our privacy policy."}
            </p>
          </form>
        )}

        {/* Direct contact */}
        <div className="mt-12 pt-10 border-t border-ct-green/10">
          <p className="font-body text-sm text-ct-cream/55 text-center mb-4">
            {locale === "de" ? "Oder direkt:" : "Or directly:"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-center">
            <a href="mailto:catering@cocktail-x.com" className="font-body text-ct-green hover:text-ct-green/80 transition-colors text-sm">
              catering@cocktail-x.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
