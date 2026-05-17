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
        <section className="bg-white py-16 lg:py-24 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 lg:mb-14">
                    <h2 className="text-2xl md:text-3xl font-light text-black font-montserrat tracking-tight mb-3">
                        Designed for Every Space
                    </h2>
                    <p className="text-black/40 text-sm font-outfit font-light max-w-lg mx-auto leading-[1.8]">
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
                            className="group relative block w-full overflow-hidden rounded-2xl bg-[#F5F5F3] mb-3 transition-all duration-500"
                        >
                            <div className="w-full aspect-[4/3] relative">
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full p-5">
                                    <h3 className="text-lg font-normal text-white font-montserrat mb-0.5 tracking-tight">{space.title}</h3>
                                    <p className="text-[0.7rem] text-white/60 font-outfit tracking-[0.06em]">{space.subtitle}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {/* Remaining two — side by side */}
                    <div className="grid grid-cols-2 gap-3">
                        {spaces.slice(1).map((space) => (
                            <Link
                                key={space.title}
                                href={space.href}
                                className="group relative block overflow-hidden rounded-xl bg-[#F5F5F3] transition-all duration-500"
                            >
                                <div className="w-full aspect-square relative">
                                    <img
                                        src={space.image}
                                        alt={space.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                    <div className="absolute bottom-0 left-0 w-full p-3.5">
                                        <h3 className="text-sm font-normal text-white font-montserrat tracking-tight">{space.title}</h3>
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
                            className={`group relative block w-full overflow-hidden rounded-2xl bg-[#F5F5F3] transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${space.gridClass}`}
                        >
                            <div className={`w-full ${space.aspect} relative`}>
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/8 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8">
                                    <h3 className="text-xl lg:text-2xl font-normal text-white font-montserrat mb-1 tracking-tight">
                                        {space.title}
                                    </h3>
                                    <p className="text-[0.75rem] text-white/65 font-outfit tracking-[0.06em]">
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
