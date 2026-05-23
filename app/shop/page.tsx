"use client";

import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import WhatsAppFloat from "../components/WhatsAppFloat";

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

            {/* ── HERO HEADER ─────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-[#1A1917]" style={{ minHeight: "clamp(260px, 40vw, 480px)" }}>
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=80"
                        alt="Luxury Modern Dining Living Setup"
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917] via-[#1A1917]/55 to-black/30" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center"
                    style={{ minHeight: "clamp(260px, 40vw, 480px)", paddingTop: "clamp(80px, 12vw, 140px)", paddingBottom: "clamp(48px, 8vw, 80px)" }}>
                    <p className="text-[0.54rem] tracking-[0.32em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                        SANRA LIVING PORTFOLIO
                    </p>
                    <h1 className="font-light text-white font-montserrat tracking-tight leading-[1.05] mb-4"
                        style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}>
                        Curated Collections.
                    </h1>
                    <p className="text-[0.85rem] text-white/55 font-light max-w-sm mx-auto leading-relaxed">
                        Premium engineered steel furniture — designed for modern living, built to endure.
                    </p>
                </div>
            </section>

            {/* ── CATEGORY GRID ───────────────────────────────────── */}
            <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {collections.map((col) => (
                        <Link
                            key={col.name}
                            href={col.href}
                            className="group block relative overflow-hidden rounded-2xl"
                            style={{ aspectRatio: "4/3" }}
                        >
                            <img
                                src={col.image}
                                alt={col.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/80 via-[#1A1917]/25 to-transparent transition-all duration-500 group-hover:from-[#1A1917]/90" />

                            {/* Labels */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                                <h2 className="text-[0.85rem] sm:text-base md:text-lg font-light text-white font-montserrat tracking-wide leading-tight">
                                    {col.name}
                                </h2>
                                <p className="text-[0.68rem] text-white/60 font-outfit font-light mt-0.5 hidden sm:block">
                                    {col.subtitle}
                                </p>
                            </div>

                            {/* Explore badge on hover */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-400">
                                <span className="text-[0.5rem] font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full bg-white text-[#1A1917] font-montserrat shadow-md">
                                    Explore →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── BOTTOM CTA ─────────────────────────────────── */}
                <div className="mt-14 lg:mt-20 p-8 sm:p-12 md:p-16 bg-white border border-black/[0.04] rounded-3xl text-center flex flex-col items-center shadow-sm">
                    <p className="text-[0.54rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                        TAILORED REQUISITIONS
                    </p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-black font-montserrat mb-3 tracking-tight">
                        Need Pricing or a Custom Quote?
                    </h3>
                    <p className="text-[0.85rem] text-black/45 font-light mb-8 max-w-md mx-auto leading-[1.8]">
                        Contact us for retail pricing, bulk commercial orders, and specialized project requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#1A1917] hover:bg-black text-white text-[0.6rem] font-semibold tracking-[0.22em] uppercase font-montserrat rounded-full hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition-all duration-300 active:scale-[0.97]"
                        >
                            Chat on WhatsApp
                        </a>
                        <Link
                            href="/bulk-orders"
                            className="flex-1 inline-flex items-center justify-center px-7 py-4 border border-[#1A1917]/25 text-[#1A1917] text-[0.6rem] font-semibold tracking-[0.22em] uppercase font-montserrat rounded-full hover:bg-[#1A1917]/5 transition-all duration-300 active:scale-[0.97]"
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