"use client";

import React from "react";
import Link from "next/link";

const spaces = [
    {
        title: "Modern Living",
        subtitle: "Minimalist steel furniture for contemporary homes.",
        image: "/large-feature.png",
        href: "/shop",
        gridClass: "md:col-span-2 md:row-span-2",
        aspect: "aspect-square md:aspect-auto md:h-[600px]",
    },
    {
        title: "Workspace",
        subtitle: "Engineered for focus.",
        image: "/small-workspace.png",
        href: "/shop/workspace",
        gridClass: "md:col-span-1 md:row-span-1",
        aspect: "aspect-square md:h-[288px]",
    },
    {
        title: "Commercial",
        subtitle: "Durable seating for cafes.",
        image: "/small-commercial.png",
        href: "/shop/commercial",
        gridClass: "md:col-span-1 md:row-span-1",
        aspect: "aspect-square md:h-[288px]",
    },
];

export default function ApplicationShowcase() {
    return (
        <section className="bg-[#FAF9F6] py-20 lg:py-24 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 lg:mb-16">
                    <p className="text-[0.58rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                        CURATED SPACES
                    </p>
                    <h2 className="text-3xl md:text-4xl font-light text-[#111111] font-montserrat tracking-tight mb-3">
                        Designed for Every Space
                    </h2>
                    <p className="text-black/45 text-sm font-outfit font-light max-w-lg mx-auto leading-[1.8]">
                        From intimate homes to commercial environments, SANRA steel adapts to your aesthetic.
                    </p>
                </div>

                {/* Mobile: first full-width tall, then 2 side-by-side | Desktop: asymmetric grid */}
                <div className="block md:hidden">
                    {/* First image — full width, taller */}
                    {spaces.slice(0, 1).map((space) => (
                        <Link
                            key={space.title}
                            href={space.href}
                            className="group relative block w-full overflow-hidden rounded-2xl bg-black/[0.02] mb-4 transition-all duration-500"
                        >
                            <div className="w-full aspect-[4/3] relative">
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/75 via-[#1A1917]/10 to-transparent transition-opacity duration-500" />
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <h3 className="text-base font-normal text-white font-montserrat mb-0.5 tracking-wide uppercase">{space.title}</h3>
                                    <p className="text-[0.7rem] text-white/70 font-outfit font-light tracking-[0.06em]">{space.subtitle}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {/* Remaining two — side by side */}
                    <div className="grid grid-cols-2 gap-4">
                        {spaces.slice(1).map((space) => (
                            <Link
                                key={space.title}
                                href={space.href}
                                className="group relative block overflow-hidden rounded-xl bg-black/[0.02] transition-all duration-500"
                            >
                                <div className="w-full aspect-square relative">
                                    <img
                                        src={space.image}
                                        alt={space.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/75 via-[#1A1917]/15 to-transparent transition-opacity duration-500" />
                                    <div className="absolute bottom-0 left-0 w-full p-4">
                                        <h3 className="text-[0.78rem] font-normal text-white font-montserrat tracking-wider uppercase">{space.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Desktop: original asymmetric grid */}
                <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
                    {spaces.map((space) => (
                        <Link
                            key={space.title}
                            href={space.href}
                            className={`group relative block w-full overflow-hidden rounded-2xl bg-black/[0.02] border border-black/[0.015] transition-all duration-1000 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${space.gridClass}`}
                        >
                            <div className={`w-full ${space.aspect} relative`}>
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1917]/80 via-[#1A1917]/10 to-transparent transition-opacity duration-700" />
                                <div className="absolute bottom-0 left-0 w-full p-8 lg:p-10">
                                    <h3 className="text-xl lg:text-2xl font-light text-white font-montserrat mb-1 tracking-wide uppercase">
                                        {space.title}
                                    </h3>
                                    <p className="text-[0.78rem] text-white/70 font-outfit font-light tracking-[0.06em]">
                                        {space.subtitle}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
