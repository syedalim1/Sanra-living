"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative bg-[#FAF9F6] pt-8 pb-10 lg:pt-24 lg:pb-28 overflow-hidden flex flex-col items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center relative z-10">
                <div className="max-w-3xl mb-12 lg:mb-20">
                    <p className="text-[0.58rem] tracking-[0.35em] uppercase text-[#C5A880] font-montserrat font-medium mb-4 lg:mb-6">
                        SANRA LIVING — SIGNATURE SERIES
                    </p>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#111111] font-montserrat leading-[1.1] tracking-[-0.01em] mb-6">
                        Steel, Refined.
                    </h1>

                    <p className="text-sm md:text-base text-black/45 font-outfit font-light leading-[1.8] max-w-md mx-auto mb-10">
                        Precision-engineered stainless steel furniture, crafted in Coimbatore. Fusing architectural strength with timeless minimalism.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/shop"
                            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-10 bg-[#1A1917] hover:bg-black text-white font-montserrat text-[0.62rem] font-medium tracking-[0.22em] uppercase transition-all duration-500 rounded-full hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] active:scale-[0.97]"
                        >
                            Explore Collection
                        </Link>
                        <Link
                            href="/shop?category=Living"
                            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-10 border border-[#1A1917]/25 hover:border-[#1A1917] text-[#1A1917] font-montserrat text-[0.62rem] font-medium tracking-[0.22em] uppercase transition-all duration-500 rounded-full hover:bg-black/5 active:scale-[0.97]"
                        >
                            Best Sellers
                        </Link>
                    </div>
                </div>

                {/* Hero Image Focus */}
                <div className="w-full max-w-[1200px] relative group px-0 md:px-6">
                    <div className="relative w-full aspect-[1/1] md:aspect-[16/9] lg:aspect-[21/9] md:rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-black/[0.015] transition-transform duration-1000 ease-out hover:scale-[1.005]">
                        <img 
                            src="/hero-banner.png" 
                            alt="Luxury Steel Furniture Collection on Display"
                            className="w-full h-full object-cover object-center scale-100 group-hover:scale-103 transition-transform duration-[4000ms] ease-out"
                        />
                        {/* Soft overlay gradient to blend bottom edge subtly */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
