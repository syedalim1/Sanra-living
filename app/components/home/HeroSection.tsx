"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative bg-[#FAFAFA] pt-4 pb-4 lg:pt-24 lg:pb-32 overflow-hidden flex flex-col items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center relative z-10">
                <div className="max-w-3xl mb-4 lg:mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black font-montserrat leading-[1.05] tracking-tight mb-5">
                        Steel, Refined.
                    </h1>

                    <p className="text-sm md:text-base text-black/40 font-outfit font-light leading-[1.8] max-w-sm mx-auto mb-10">
                        Precision-engineered stainless steel furniture.
                        <br />Made in Coimbatore.
                    </p>

                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href="/shop"
                            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-10 bg-[#111] text-white font-montserrat text-[0.65rem] font-medium tracking-[0.22em] uppercase transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] rounded-full hover:bg-black hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98]"
                        >
                            Explore Collection
                        </Link>
                        <Link
                            href="/shop/living"
                            className="text-[0.6rem] text-black/40 font-montserrat tracking-[0.18em] uppercase hover:text-black transition-colors duration-300"
                        >
                            View Best Sellers →
                        </Link>
                    </div>
                </div>

                {/* Hero Image Focus */}
                <div className="w-full max-w-[1200px] relative group px-0 md:px-6">
                    <div className="relative w-full  aspect-[1/1] md:aspect-[16/9] lg:aspect-[21/9] md:rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.08)] transition-transform duration-1000 ease-out hover:scale-[1.005]">
                        <img 
                            src="/hero-banner.png" 
                            alt="Luxury Steel Furniture"
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Soft overlay gradient to blend bottom edge subtly if needed */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
