"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CateringHeader from "./CateringHeader";
import CateringFooter from "./CateringFooter";
import PageTransition from "./PageTransition";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCatering = pathname.includes("/catering");

  if (isCatering) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#000000" }}>
        <CateringHeader />
        <PageTransition>{children}</PageTransition>
        <CateringFooter />
      </div>
    );
  }

  return (
    <>
      <Header />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </>
  );
}
