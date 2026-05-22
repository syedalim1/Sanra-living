"use client";

import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import WhatsAppFloat from "../components/WhatsAppFloat";

/* ═══════════════════════════════════════════════════════════════
   CURATED COLLECTIONS
   ═══════════════════════════════════════════════════════════════ */
const collections = [
    {
        name: "Steel Chairs",
        subtitle: "Engineered seating series.",
        href: "/shop/seating",
        image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80",
    },
    {
        name: "Steel Tables",
        subtitle: "Minimalist dining and study desks.",
        href: "/shop/tables",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80",
    },
    {
        name: "Dining Sets",
        subtitle: "Matching dining series collections.",
        href: "/shop/dining-furniture",
        image: "https://images.unsplash.com/photo-1617806118233-18e1c0945594?w=1200&q=80",
    },
    {
        name: "Commercial",
        subtitle: "Institutional-grade premium furniture.",
        href: "/shop/commercial",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    },
];

export default function ShopPage() {
    const waLink = "https://wa.me/918300904920?text=Hi!%20I'm%20interested%20in%20SANRA%20LIVING%20steel%20furniture%20collections.";

    return (
        <main className="bg-[#FAF9F6] min-h-screen text-[#111111] font-outfit">
            <SiteHeader />

            {/* ── HERO HEADER ────────────────── */}
            <section className="relative py-28 md:py-36 lg:py-44 flex items-center justify-center overflow-hidden bg-[#1A1917]">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 group">
                    <img 
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=80" 
                        alt="Luxury Modern Dining Living Setup" 
                        className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917] via-[#1A1917]/50 to-black/35" />
                </div>
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center mt-10">
                    <p className="text-[0.58rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-3.5">
                        SANRA LIVING PORTFOLIO
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6.5xl lg:text-7.5xl font-light text-white font-montserrat tracking-tight leading-[1.1] mb-6">
                        Curated Collections.
                    </h1>
                    <p className="text-sm md:text-base text-white/55 font-light max-w-xl mx-auto leading-relaxed">
                        Explore our premium engineered steel furniture. Designed for modern living, built to endure.
                    </p>
                </div>
            </section>

            {/* ── CATEGORY GRID ────────────────────────────────────── */}
            <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                    {collections.map((col) => (
                        <Link
                            key={col.name}
                            href={col.href}
                            className="group block bg-transparent"
                        >
                            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-[#F5F4F0] mb-6 border border-black/[0.015] shadow-sm transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] group-hover:bg-[#EFECE6]">
                                <img
                                    src={col.image}
                                    alt={col.name}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-103"
                                />
                                {/* Soft overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-[#1A1917]/[0.02] transition-colors duration-1000" />
                            </div>

                            <div className="flex flex-col px-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h2 className="text-base md:text-lg font-light text-black font-montserrat tracking-wide transition-colors duration-300 group-hover:text-[#C5A880]">
                                            {col.name}
                                        </h2>
                                        <p className="text-[0.78rem] text-black/45 font-light mt-1">
                                            {col.subtitle}
                                        </p>
                                    </div>
                                    <div className="text-[0.58rem] font-medium uppercase tracking-[0.2em] font-montserrat flex items-center gap-2 text-black/60 group-hover:text-black transition-colors duration-300 mt-1 pb-0.5 border-b border-transparent group-hover:border-black/25">
                                        Explore
                                        <span className="text-xs leading-none transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-28 lg:mt-36 p-10 md:p-20 bg-[#FAF9F6] border border-black/[0.035] rounded-3xl text-center flex flex-col items-center">
                    <p className="text-[0.58rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                        TAILORED REQUISITIONS
                    </p>
                    <h3 className="text-2xl md:text-3xl font-light text-black font-montserrat mb-4 tracking-tight">
                        Need Pricing or a Custom Quote?
                    </h3>
                    <p className="text-sm text-black/45 font-light mb-10 max-w-lg mx-auto leading-[1.8]">
                        Contact us directly for retail pricing, bulk commercial orders, and specialized project requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#1A1917] hover:bg-black text-[#C5A880] text-[0.62rem] font-medium tracking-[0.22em] uppercase font-montserrat rounded-full hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
                        >
                            <span>Chat on WhatsApp</span>
                        </a>
                        <Link 
                            href="/bulk-orders" 
                            className="inline-flex items-center justify-center px-8 py-4 border border-[#1A1917]/25 text-[#1A1917] text-[0.62rem] font-medium tracking-[0.22em] uppercase font-montserrat rounded-full hover:bg-[#1A1917]/5 transition-all duration-300"
                        >
                            Bulk Orders
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}