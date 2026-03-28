"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

const CONTACT_EMAIL = "info@cocktail-x.com";
const CONTACT_PHONE = "+49 152 55709985";

export default function KontaktPage() {
  const locale = useLocale() as "de" | "en";

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    eventType: "",
    guestCount: "",
    date: "",
    message: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const eventLabels: Record<string, Record<string, string>> = {
    corporate: { de: "Firmenevent / Produktlaunch", en: "Corporate Event / Product Launch" },
    messe: { de: "Messe / Konferenz", en: "Trade Fair / Conference" },
    gala: { de: "Gala / VIP-Empfang", en: "Gala / VIP Reception" },
    networking: { de: "Networking / After-Work", en: "Networking / After-Work" },
    other: { de: "Sonstiges", en: "Other" },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventLabel = form.eventType
      ? eventLabels[form.eventType]?.[locale] || form.eventType
      : "-";

    const subject = encodeURIComponent(
      locale === "de"
        ? `Catering-Anfrage: ${eventLabel}${form.company ? ` — ${form.company}` : ""}`
        : `Catering Enquiry: ${eventLabel}${form.company ? ` — ${form.company}` : ""}`
    );

    const lines = [
      locale === "de" ? "CATERING-ANFRAGE" : "CATERING ENQUIRY",
      "═".repeat(40),
      "",
      `${locale === "de" ? "Name" : "Name"}: ${form.name}`,
      form.company ? `${locale === "de" ? "Unternehmen" : "Company"}: ${form.company}` : "",
      `E-Mail: ${form.email}`,
      form.phone ? `${locale === "de" ? "Telefon" : "Phone"}: ${form.phone}` : "",
      "",
      "─".repeat(40),
      "",
      `${locale === "de" ? "Event-Art" : "Event Type"}: ${eventLabel}`,
      form.guestCount
        ? `${locale === "de" ? "Gästeanzahl" : "Guest Count"}: ${form.guestCount}`
        : "",
      form.date
        ? `${locale === "de" ? "Event-Datum" : "Event Date"}: ${form.date}`
        : "",
      "",
      form.message
        ? `${locale === "de" ? "Nachricht" : "Message"}:\n${form.message}`
        : "",
      "",
      "─".repeat(40),
      locale === "de"
        ? "Gesendet über cocktail-x.com/catering"
        : "Sent via cocktail-x.com/catering",
    ]
      .filter(Boolean)
      .join("\n");

    const body = encodeURIComponent(lines);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const inputClass =
    "w-full bg-white/60 border border-everglade/15 rounded-xl px-4 py-3 font-body text-licorice placeholder-everglade/30 focus:outline-none focus:border-everglade/40 focus:bg-white transition-colors";
  const labelClass =
    "block font-body text-xs uppercase tracking-wider text-everglade/55 mb-2";
  const selectClass =
    "w-full bg-white/60 border border-everglade/15 rounded-xl px-4 py-3 font-body text-licorice focus:outline-none focus:border-everglade/40 focus:bg-white transition-colors";

  return (
    <main className="min-h-screen bg-ct-cream">
      <div className="max-w-5xl mx-auto px-4 pt-40 pb-24">
        <div className="grid lg:grid-cols-[1fr,360px] gap-12 lg:gap-16">
          {/* Left — Form */}
          <div>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-everglade/50 mb-4">
              Cocktail Excellence. Event Precision.
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-licorice mb-4">
              {locale === "de" ? "Angebot anfragen" : "Request a Quote"}
            </h1>
            <p className="font-body text-lg text-everglade/65 mb-10 leading-relaxed">
              {locale === "de"
                ? "Erzählt uns von eurem Event — wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot."
                : "Tell us about your event — we'll respond within 24 hours with a non-binding quote."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    {locale === "de" ? "Name *" : "Name *"}
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass}
                    placeholder={locale === "de" ? "Ihr Name" : "Your name"}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {locale === "de" ? "Unternehmen" : "Company"}
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    className={inputClass}
                    placeholder={locale === "de" ? "Firmenname" : "Company name"}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    {locale === "de" ? "E-Mail *" : "Email *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    placeholder="name@firma.de"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {locale === "de" ? "Telefon" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass}
                    placeholder="+49 ..."
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    {locale === "de" ? "Event-Art *" : "Event Type *"}
                  </label>
                  <select
                    required
                    value={form.eventType}
                    onChange={(e) => update("eventType", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{locale === "de" ? "Bitte wählen" : "Please select"}</option>
                    <option value="corporate">{locale === "de" ? "Firmenevent / Produktlaunch" : "Corporate Event / Product Launch"}</option>
                    <option value="messe">{locale === "de" ? "Messe / Konferenz" : "Trade Fair / Conference"}</option>
                    <option value="gala">{locale === "de" ? "Gala / VIP-Empfang" : "Gala / VIP Reception"}</option>
                    <option value="networking">{locale === "de" ? "Networking / After-Work" : "Networking / After-Work"}</option>
                    <option value="other">{locale === "de" ? "Sonstiges" : "Other"}</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    {locale === "de" ? "Gästeanzahl" : "Guest Count"}
                  </label>
                  <select
                    value={form.guestCount}
                    onChange={(e) => update("guestCount", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{locale === "de" ? "Ca. Anzahl" : "Approx. number"}</option>
                    <option value="50-100">50 – 100</option>
                    <option value="100-250">100 – 250</option>
                    <option value="250-500">250 – 500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  {locale === "de" ? "Event-Datum" : "Event Date"}
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  {locale === "de" ? "Nachricht" : "Message"}
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder={locale === "de"
                    ? "Erzählt uns mehr über euer Event, Location, besondere Wünsche..."
                    : "Tell us more about your event, venue, special requests..."}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-all duration-200 shadow-lg shadow-ct-red/20"
              >
                {locale === "de" ? "Anfrage senden" : "Send Enquiry"}
              </button>

              <p className="text-xs font-body text-everglade/40 text-center">
                {locale === "de"
                  ? "Klickt auf Senden — euer E-Mail-Programm öffnet sich mit den vorausgefüllten Daten."
                  : "Click send — your email client will open with pre-filled details."}
              </p>
            </form>
          </div>

          {/* Right — Contact Info Sidebar */}
          <div className="lg:pt-32">
            <div className="rounded-2xl bg-everglade p-8 text-ct-cream">
              <h2 className="font-display text-xl mb-6">
                {locale === "de" ? "Direkter Kontakt" : "Direct Contact"}
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-body uppercase tracking-wider text-ct-cream/45 mb-1">E-Mail</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-body text-ct-cream hover:text-tangerine transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-body uppercase tracking-wider text-ct-cream/45 mb-1">
                    {locale === "de" ? "Telefon" : "Phone"}
                  </p>
                  <a
                    href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                    className="font-body text-ct-cream hover:text-tangerine transition-colors"
                  >
                    {CONTACT_PHONE}
                  </a>
                </div>

                <div>
                  <p className="text-xs font-body uppercase tracking-wider text-ct-cream/45 mb-1">
                    {locale === "de" ? "Standort" : "Location"}
                  </p>
                  <p className="font-body text-ct-cream/80">
                    {locale === "de" ? "München, Deutschland" : "Munich, Germany"}
                  </p>
                </div>

                <div className="pt-4 border-t border-ct-cream/10">
                  <p className="text-xs font-body uppercase tracking-wider text-ct-cream/45 mb-1">
                    {locale === "de" ? "Antwortzeit" : "Response Time"}
                  </p>
                  <p className="font-body text-ct-cream/80">
                    {locale === "de" ? "Innerhalb von 24 Stunden" : "Within 24 hours"}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-ct-cream/10">
                <p className="font-body text-xs text-ct-cream/50 leading-relaxed">
                  {locale === "de"
                    ? "Cocktail X Catering · Bay und Co. GmbH"
                    : "Cocktail X Catering · Bay und Co. GmbH"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
