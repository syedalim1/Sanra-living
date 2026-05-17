"use client";

import React from "react";
import Link from "next/link";

const categories = [
    {
        name: "Living Room",
        href: "/shop/living",
        image: "/living.png",
    },
    {
        name: "Workspace",
        href: "/shop/workspace",
        image: "/workspace.png",
    },
    {
        name: "Dining",
        href: "/shop/tables",
        image: "/dining.png",
    },
    {
        name: "Commercial",
        href: "/shop/commercial",
        image: "/commercial.png",
    },
];

export default function CategoryGrid() {
    return (
        <section className="py-16 lg:py-24 bg-white border-b border-black/5 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 lg:mb-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-light text-black font-montserrat tracking-tight mb-2">
                            Collections
                        </h2>
                        <p className="font-outfit text-black/40 text-sm font-light">
                            Engineered steel furniture by space.
                        </p>
                    </div>
                </div>

                <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 lg:gap-6 snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-6 lg:pb-0">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group block w-[72vw] sm:w-[42vw] lg:w-full flex-shrink-0 snap-start lg:snap-align-none"
                        >
                            <div className="w-full aspect-[4/5] bg-[#F5F5F3] rounded-2xl overflow-hidden mb-4 relative transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
                            </div>
                            
                            <div className="pl-1">
                                <h3 className="font-montserrat text-[0.78rem] font-medium text-black tracking-[0.08em] uppercase transition-colors duration-300 mb-0.5">
                                    {cat.name}
                                </h3>
                                <p className="text-[0.65rem] text-black/35 font-outfit font-light tracking-[0.05em]">Shop now →</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
