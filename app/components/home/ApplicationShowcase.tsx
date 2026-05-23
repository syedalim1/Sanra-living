"use client";

import React from "react";
import Link from "next/link";

const spaces = [
    {
        title: "Modern Living",
        subtitle: "Minimalist steel for contemporary homes.",
        image: "/large-feature.png",
        href: "/shop",
        span: "large",
    },
    {
        title: "Workspace",
        subtitle: "Engineered for focus.",
        image: "/small-workspace.png",
        href: "/shop/workspace",
        span: "small",
    },
    {
        title: "Commercial",
        subtitle: "Durable seating for cafes.",
        image: "/small-commercial.png",
        href: "/shop/commercial",
        span: "small",
    },
];

export default function ApplicationShowcase() {
    return (
        <section className="bg-[#FAF9F6] py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 lg:mb-14">
                    <p className="text-[0.56rem] tracking-[0.32em] uppercase text-[#C5A880] font-montserrat font-medium mb-2">
                        CURATED SPACES
                    </p>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#111111] font-montserrat tracking-tight mb-3">
                        Designed for Every Space
                    </h2>
                    <p className="text-black/45 text-[0.85rem] font-outfit font-light max-w-md mx-auto leading-[1.8]">
                        From intimate homes to commercial environments — SANRA steel adapts to your aesthetic.
                    </p>
                </div>

                {/* ── MOBILE: stacked layout ─────────────────────── */}
                <div className="flex flex-col gap-3 md:hidden">
                    {/* Large feature tile */}
                    <Link
                        href={spaces[0].href}
                        className="group relative block w-full overflow-hidden rounded-2xl"
                        style={{ aspectRatio: "4/3" }}
                    >
                        <img
                            src={spaces[0].image}
                            alt={spaces[0].title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/80 via-[#1A1917]/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full p-5">
                            <div className="inline-block text-[0.52rem] tracking-[0.2em] uppercase text-[#C5A880] font-montserrat font-medium mb-1.5 px-2.5 py-1 border border-[#C5A880]/40 rounded-full">
                                Featured
                            </div>
                            <h3 className="text-lg font-light text-white font-montserrat tracking-wide uppercase">{spaces[0].title}</h3>
                            <p className="text-[0.72rem] text-white/65 font-outfit font-light">{spaces[0].subtitle}</p>
                        </div>
                    </Link>

                    {/* Two small tiles side by side */}
                    <div className="grid grid-cols-2 gap-3">
                        {spaces.slice(1).map((space) => (
                            <Link
                                key={space.title}
                                href={space.href}
                                className="group relative block overflow-hidden rounded-xl"
                                style={{ aspectRatio: "1/1" }}
                            >
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/80 via-[#1A1917]/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h3 className="text-[0.78rem] font-medium text-white font-montserrat tracking-wider uppercase">{space.title}</h3>
                                    <p className="text-[0.65rem] text-white/60 font-outfit font-light mt-0.5">{space.subtitle}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── DESKTOP: asymmetric grid ───────────────────── */}
                <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-5 lg:gap-6" style={{ height: "clamp(400px, 55vw, 680px)" }}>
                    {/* Large tile — 2 cols, 2 rows */}
                    <Link
                        href={spaces[0].href}
                        className="group relative block col-span-2 row-span-2 overflow-hidden rounded-2xl"
                    >
                        <img
                            src={spaces[0].image}
                            alt={spaces[0].title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/80 via-[#1A1917]/15 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-10">
                            <div className="inline-block text-[0.52rem] tracking-[0.2em] uppercase text-[#C5A880] font-montserrat font-medium mb-3 px-3 py-1 border border-[#C5A880]/40 rounded-full">
                                Featured Collection
                            </div>
                            <h3 className="text-2xl lg:text-3xl font-light text-white font-montserrat mb-1.5 tracking-wide uppercase">
                                {spaces[0].title}
                            </h3>
                            <p className="text-[0.8rem] text-white/65 font-outfit font-light tracking-[0.05em]">
                                {spaces[0].subtitle}
                            </p>
                        </div>
                    </Link>

                    {/* Small tiles — 1 col each */}
                    {spaces.slice(1).map((space) => (
                        <Link
                            key={space.title}
                            href={space.href}
                            className="group relative block col-span-1 row-span-1 overflow-hidden rounded-2xl"
                        >
                            <img
                                src={space.image}
                                alt={space.title}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/80 via-[#1A1917]/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-full p-5 lg:p-6">
                                <h3 className="text-base lg:text-lg font-light text-white font-montserrat tracking-wide uppercase">
                                    {space.title}
                                </h3>
                                <p className="text-[0.72rem] text-white/65 font-outfit font-light mt-0.5">{space.subtitle}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
