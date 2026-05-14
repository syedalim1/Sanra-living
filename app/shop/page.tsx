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
        subtitle: "Engineered for modern spaces.",
        href: "/shop/seating",
        image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80",
    },
    {
        name: "Steel Tables",
        subtitle: "Minimalist surfaces for work and dining.",
        href: "/shop/tables",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80",
    },
    {
        name: "Dining Sets",
        subtitle: "Complete matching dining setups.",
        href: "/shop/commercial",
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
    const waLink = "https://wa.me/8300904920?text=Hi!%20I%20want%20to%20know%20about%20your%20steel%20furniture%20products.";

    return (
        <main className="bg-white min-h-screen">
            <SiteHeader />

            {/* ── HERO HEADER ────────────────── */}
            <section className="relative py-24 md:py-32 lg:py-40 flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=80" 
                        alt="Luxury Modern Living" 
                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />
                </div>
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center mt-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white font-montserrat tracking-tight leading-[1.05] mb-6 drop-shadow-xl">
                        Curated Collections.
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-white/80 font-outfit font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                        Explore our premium engineered steel furniture. Designed for modern living, built to endure.
                    </p>
                </div>
            </section>

            {/* ── CATEGORY GRID ────────────────────────────────────── */}
            <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {collections.map((col) => (
                        <Link
                            key={col.name}
                            href={col.href}
                            className="group block bg-white rounded-2xl overflow-hidden"
                        >
                            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-[#F9F9F9] mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow duration-700 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                                <img
                                    src={col.image}
                                    alt={col.name}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                                />
                                {/* Soft overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </div>

                            <div className="flex flex-col px-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h2 className="text-lg md:text-xl font-black text-black font-montserrat tracking-tight mb-1 transition-colors duration-300">
                                            {col.name}
                                        </h2>
                                        <p className="text-[0.8rem] md:text-sm text-gray-500 font-outfit tracking-wide">
                                            {col.subtitle}
                                        </p>
                                    </div>
                                    <div className="text-xs font-bold uppercase tracking-widest font-montserrat flex items-center gap-2 text-black/60 group-hover:text-black transition-colors duration-300 mt-1">
                                        Explore
                                        <span className="text-lg leading-none transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-24 lg:mt-32 p-10 md:p-16 bg-[#F9F9F9] rounded-2xl text-center flex flex-col items-center">
                    <h3 className="text-2xl md:text-3xl font-black text-black font-montserrat mb-4 tracking-tight">
                        Need Pricing or a Custom Quote?
                    </h3>
                    <p className="text-sm md:text-base text-gray-500 font-outfit font-light mb-8 max-w-xl mx-auto leading-relaxed">
                        Contact us directly for retail pricing, bulk commercial orders, and specialized project requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-bold text-xs tracking-[0.15em] uppercase font-montserrat rounded-xl hover:bg-[#1C1C1C] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            💬 Chat on WhatsApp
                        </a>
                        <Link 
                            href="/bulk-orders" 
                            className="inline-flex items-center justify-center px-8 py-4 border border-black/20 text-black font-bold text-xs tracking-[0.15em] uppercase font-montserrat rounded-xl hover:bg-black/5 transition-all duration-300"
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