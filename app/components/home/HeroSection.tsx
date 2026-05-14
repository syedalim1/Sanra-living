"use client";

import React from "react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative bg-[#FAFAFA] pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden flex flex-col items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center relative z-10">
                <div className="max-w-3xl mb-12 lg:mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black font-montserrat leading-[1.05] tracking-tight mb-6">
                        Masterpiece in Steel.
                    </h1>

                    <p className="text-lg md:text-xl lg:text-2xl text-gray-500 font-outfit font-light leading-relaxed max-w-xl mx-auto mb-10 opacity-90">
                        Engineered for modern spaces. <br className="hidden md:block" />
                        Built to last generations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/shop"
                            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-black text-white font-montserrat text-xs md:text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-xl hover:bg-[#1C1C1C] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/shop/living"
                            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 bg-transparent text-black border border-black/20 font-montserrat text-xs md:text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-xl hover:bg-black/5 hover:border-black/30"
                        >
                            View Best Sellers
                        </Link>
                    </div>
                </div>

                {/* Hero Image Focus */}
                <div className="w-full max-w-[1200px] relative group px-0 md:px-6">
                    <div className="relative w-full aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] md:rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-transform duration-1000 ease-out hover:scale-[1.01]">
                        <img 
                            src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=2000&q=80" 
                            alt="Luxury Steel Furniture"
                            className="w-full h-full object-cover object-center scale-105"
                        />
                        {/* Soft overlay gradient to blend bottom edge subtly if needed */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
