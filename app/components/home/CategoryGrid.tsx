"use client";

import React from "react";
import Link from "next/link";

const categories = [
    {
        name: "Dining Series",
        description: "Elegant chairs and dining tables.",
        href: "/shop/dining-furniture",
        image: "/dining.png",
    },
    {
        name: "Seating Series",
        description: "Ergonomic designs and lounge seating.",
        href: "/shop/seating",
        image: "/living.png", // Using living.png for seating series since it displays seating well
    },
    {
        name: "Workspace Series",
        description: "Minimalist study desks and chairs.",
        href: "/shop/workspace",
        image: "/workspace.png",
    },
    {
        name: "Commercial Series",
        description: "High-grade setups for hospitality.",
        href: "/shop/commercial",
        image: "/commercial.png",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-20 lg:py-28 bg-[#FAF9F6] border-b border-black/[0.03] px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 lg:mb-16">
                    <div>
                        <p className="text-[0.58rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                            SPACE SELECTIONS
                        </p>
                        <h2 className="text-3xl md:text-4xl font-light text-[#111111] font-montserrat tracking-tight">
                            Shop by Collection
                        </h2>
                    </div>
                    <Link 
                        href="/shop" 
                        className="text-[0.62rem] text-black/55 font-montserrat tracking-[0.2em] uppercase hover:text-black transition-colors duration-300 mt-4 md:mt-0 border-b border-black/15 pb-1 w-fit"
                    >
                        View All Collections →
                    </Link>
                </div>

                <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 lg:gap-8 snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-6 lg:pb-0">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group block w-[75vw] sm:w-[45vw] lg:w-full flex-shrink-0 snap-start lg:snap-align-none"
                        >
                            <div className="w-full aspect-[4/5] bg-black/[0.02] rounded-2xl overflow-hidden mb-5 relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] border border-black/[0.015]">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-contain object-center scale-[0.93] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[0.98]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.015] transition-colors duration-1000" />
                            </div>
                            
                            <div className="pl-1">
                                <h3 className="font-montserrat text-[0.72rem] font-medium text-[#111] tracking-[0.12em] uppercase transition-colors duration-300 mb-1">
                                    {cat.name}
                                </h3>
                                <p className="text-[0.78rem] text-black/45 font-outfit font-light leading-normal">{cat.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
