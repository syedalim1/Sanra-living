"use client";

import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";

export default function BulkOrdersPage() {
    const waLink = "https://wa.me/8300904920?text=Hi!%20I%20need%20bulk%20order%20pricing%20for%20commercial%20furniture.";

    return (
        <main className="bg-white min-h-screen font-outfit">
            <SiteHeader />

            {/* ── HERO SECTION ──────────────────────────── */}
            <section className="pt-20 pb-10 lg:pt-32 lg:pb-16 px-6 lg:px-8 text-center max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight font-montserrat leading-[1.1] mb-6">
                    Commercial Steel Furniture Solutions
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-500 font-light max-w-3xl mx-auto mb-10 leading-relaxed">
                    For hotels, hostels, offices, institutions, cafés, and large-scale commercial spaces.
                </p>

                {/* Hero CTA */}
                <div className="flex flex-col items-center gap-4 mb-16">
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-bold text-xs tracking-[0.15em] uppercase font-montserrat rounded-xl hover:bg-[#1C1C1C] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Get Bulk Pricing on WhatsApp
                    </a>
                    <p className="text-xs text-gray-400 font-montserrat uppercase tracking-widest font-medium">
                        Direct factory pricing from Coimbatore manufacturer.
                    </p>
                </div>

                {/* Hero Image */}
                <div className="w-full relative aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                    <img 
                        src="https://images.unsplash.com/photo-1577412647305-991150c7d163?w=2000&q=80" 
                        alt="Commercial Furniture Interior" 
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 mix-blend-multiply" />
                </div>
            </section>

            {/* ── TRUST STATS ROW ─────────────────────── */}
            <section className="py-10 border-y border-black/5 bg-[#F9F9F9]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-8 lg:gap-20">
                        {[
                            "10+ Years Experience",
                            "Pan India Delivery",
                            "GST Billing",
                            "Direct Factory Manufacturer"
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-black rounded-full hidden md:block opacity-20" />
                                <span className="text-[0.7rem] lg:text-xs font-bold uppercase tracking-[0.2em] text-black font-montserrat">{stat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BENEFITS SECTION ─────────────────────── */}
            <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-2xl lg:text-3xl font-black text-black tracking-tight font-montserrat">
                        Why Choose SANRA LIVING
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {[
                        { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", title: "Factory Direct Pricing", desc: "No intermediaries. You buy straight from our manufacturing unit." },
                        { icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", title: "Pan India Delivery", desc: "Safe, reliable shipping across all states for large volume orders." },
                        { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", title: "Custom Manufacturing", desc: "Specific size, color, or finish requirements engineered to spec." },
                        { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "GST Business Billing", desc: "Complete B2B tax invoicing provided for all corporate purchases." },
                    ].map((item, i) => (
                        <div key={i} className="bg-white border border-black/5 rounded-2xl p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                            <svg className="w-8 h-8 text-black mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}></path>
                            </svg>
                            <h3 className="text-sm font-bold text-black tracking-wide font-montserrat mb-3">{item.title}</h3>
                            <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHO WE SERVE & PROCESS (SPLIT) ─────────────────────── */}
            <section className="bg-[#F9F9F9] py-20 lg:py-28 px-6 lg:px-8 border-y border-black/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    
                    {/* Who We Serve */}
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight font-montserrat mb-8">
                            Who We Work With
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {[
                                "Hotels", "Hostels", "Offices", "Cafés", 
                                "Schools", "Institutions", "Restaurants", "Commercial Interiors"
                            ].map(tag => (
                                <span key={tag} className="px-5 py-2.5 bg-white border border-black/5 rounded-full text-xs font-bold uppercase tracking-[0.15em] text-black font-montserrat shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div>
                        <h2 className="text-xl lg:text-2xl font-black text-black tracking-tight font-montserrat mb-8">
                            How Bulk Ordering Works
                        </h2>
                        <div className="space-y-8">
                            {[
                                { step: "01", title: "Share Your Requirement", desc: "Send us your quantity, design needs, and timeline via WhatsApp." },
                                { step: "02", title: "Receive Pricing & Customization", desc: "We provide a direct factory quote and confirm manufacturing specs." },
                                { step: "03", title: "Confirm Order & Delivery", desc: "Production begins immediately. We handle secure pan-India shipping." },
                            ].map((item) => (
                                <div key={item.step} className="flex gap-5 items-start">
                                    <span className="text-xs font-black text-gray-400 font-montserrat mt-1">{item.step}</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-black font-montserrat tracking-wide mb-1.5">{item.title}</h3>
                                        <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ── BOTTOM CTA ─────────────────────── */}
            <section className="bg-black py-24 lg:py-32 px-6 lg:px-8 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight font-montserrat mb-6 leading-tight">
                        Ready to Discuss Your Project?
                    </h2>
                    <p className="text-base text-gray-400 font-outfit font-light mb-12">
                        Get factory-direct pricing for commercial and bulk furniture requirements.
                    </p>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-black font-bold text-xs tracking-[0.2em] uppercase font-montserrat rounded-xl hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300"
                    >
                        💬 Chat on WhatsApp
                    </a>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />
        </main>
    );
}
