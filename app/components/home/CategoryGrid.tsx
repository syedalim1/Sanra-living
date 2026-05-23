"use client";

import React from "react";
import Link from "next/link";

const categories = [
    {
        name: "Dining Series",
        description: "Chairs & dining tables",
        href: "/shop/dining-furniture",
        image: "/dining.png",
    },
    {
        name: "Seating Series",
        description: "Lounge & ergonomic designs",
        href: "/shop/seating",
        image: "/living.png",
    },
    {
        name: "Workspace Series",
        description: "Study desks & chairs",
        href: "/shop/workspace",
        image: "/workspace.png",
    },
    {
        name: "Commercial Series",
        description: "High-grade hospitality",
        href: "/shop/commercial",
        image: "/commercial.png",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-16 lg:py-24 bg-[#FAF9F6] border-b border-black/[0.03] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 lg:mb-12 gap-3">
                    <div>
                        <p className="text-[0.56rem] tracking-[0.32em] uppercase text-[#C5A880] font-montserrat font-medium mb-2">
                            SPACE SELECTIONS
                        </p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#111111] font-montserrat tracking-tight">
                            Shop by Collection
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="text-[0.6rem] text-black/55 font-montserrat tracking-[0.2em] uppercase hover:text-black transition-colors duration-300 border-b border-black/15 pb-0.5 w-fit shrink-0"
                    >
                        View All →
                    </Link>
                </div>

                {/* 2×2 grid on mobile, 4 columns on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group block sl-cat-tile"
                            style={{ aspectRatio: "3/4" }}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                                style={{ position: "absolute", inset: 0 }}
                            />
                            <div className="sl-cat-overlay" />

                            {/* Shop Now badge on hover */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10">
                                <span className="text-[0.5rem] font-semibold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-white text-[#1A1917] font-montserrat shadow-md">
                                    Shop →
                                </span>
                            </div>

                            <div className="sl-cat-label z-10">
                                <h3 className="font-montserrat text-[0.72rem] sm:text-[0.78rem] font-semibold text-white tracking-[0.1em] uppercase mb-0.5 leading-tight">
                                    {cat.name}
                                </h3>
                                <p className="text-[0.68rem] text-white/70 font-outfit font-light hidden sm:block">
                                    {cat.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
