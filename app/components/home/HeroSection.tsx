"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#1A1917]">
            {/* ── MOBILE HERO (full-bleed, immersive) ──────────────── */}
            <div className="relative md:hidden" style={{ height: "100svh", minHeight: 560, maxHeight: 900 }}>
                {/* Background Image */}
                <div className="hero-img-fade absolute inset-0 z-0">
                    <img
                        src="/hero-banner.png"
                        alt="SANRA LIVING — Luxury Steel Furniture Collection"
                        className="w-full h-full object-cover object-center"
                        priority-fetch="high"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917] via-[#1A1917]/40 to-transparent" />
                </div>

                {/* Content pinned to bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 pt-32">
                    <p className="hero-fade-1 text-[0.56rem] tracking-[0.35em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                        SANRA LIVING — SIGNATURE SERIES
                    </p>
                    <h1 className="hero-fade-2 text-[2.6rem] leading-[1.05] font-light text-white font-montserrat tracking-[-0.01em] mb-4">
                        Steel,<br />Refined.
                    </h1>
                    <p className="hero-fade-3 text-[0.82rem] text-white/65 font-outfit font-light leading-[1.75] mb-7 max-w-[280px]">
                        Precision-engineered stainless steel furniture — crafted in Coimbatore.
                    </p>
                    <div className="hero-fade-4 flex flex-col gap-3 w-full max-w-xs">
                        <Link
                            href="/shop"
                            className="flex items-center justify-center h-13 px-8 bg-white text-[#1A1917] font-montserrat text-[0.65rem] font-semibold tracking-[0.22em] uppercase rounded-full transition-all duration-500 active:scale-[0.97] shadow-lg"
                            style={{ height: 52 }}
                        >
                            Explore Collection
                        </Link>
                        <Link
                            href="/shop/seating"
                            className="flex items-center justify-center border border-white/40 text-white font-montserrat text-[0.65rem] font-medium tracking-[0.22em] uppercase rounded-full transition-all duration-500 active:scale-[0.97] hover:bg-white/10"
                            style={{ height: 52 }}
                        >
                            Best Sellers
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── DESKTOP HERO ──────────────────────────────────────── */}
            <div className="hidden md:flex flex-col items-center text-center relative pt-32 pb-0">
                {/* Subtle background noise / gradient */}
                <div className="absolute inset-0 bg-[#FAF9F6] z-0" />

                {/* Text block */}
                <div className="relative z-10 max-w-4xl mx-auto px-8 pb-16 text-center">
                    <p className="hero-fade-1 text-[0.56rem] tracking-[0.38em] uppercase text-[#C5A880] font-montserrat font-medium mb-5">
                        SANRA LIVING — SIGNATURE SERIES
                    </p>
                    <h1 className="hero-fade-2 font-montserrat font-light text-[#111111] tracking-[-0.02em] mb-6 leading-[1.05]"
                        style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
                        Steel, Refined.
                    </h1>
                    <p className="hero-fade-3 text-[0.95rem] text-black/45 font-outfit font-light leading-[1.85] max-w-md mx-auto mb-10">
                        Precision-engineered stainless steel furniture, crafted in Coimbatore. Fusing architectural strength with timeless minimalism.
                    </p>
                    <div className="hero-fade-4 flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center h-12 px-10 bg-[#1A1917] hover:bg-black text-white font-montserrat text-[0.62rem] font-medium tracking-[0.22em] uppercase rounded-full transition-all duration-500 hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)] active:scale-[0.97]"
                        >
                            Explore Collection
                        </Link>
                        <Link
                            href="/shop/seating"
                            className="inline-flex items-center justify-center h-12 px-10 border border-[#1A1917]/25 hover:border-[#1A1917] text-[#1A1917] font-montserrat text-[0.62rem] font-medium tracking-[0.22em] uppercase rounded-full transition-all duration-500 hover:bg-black/5 active:scale-[0.97]"
                        >
                            Best Sellers
                        </Link>
                    </div>
                </div>

                {/* Full-width hero image — cinematic */}
                <div className="hero-img-fade relative w-full max-w-[1300px] mx-auto px-6 lg:px-8">
                    <div className="relative w-full overflow-hidden rounded-t-2xl shadow-[0_-8px_60px_rgba(0,0,0,0.08)] border border-black/[0.02] border-b-0"
                        style={{ aspectRatio: "21/9" }}>
                        <img
                            src="/hero-banner.png"
                            alt="Luxury Steel Furniture Collection on Display"
                            className="w-full h-full object-cover object-center scale-100 hover:scale-[1.02] transition-transform duration-[3000ms] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6]/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
