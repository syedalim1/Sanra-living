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
                        <h2 className="text-2xl md:text-3xl font-black text-black font-montserrat tracking-tight mb-2">
                            Shop by Category
                        </h2>
                        <p className="font-outfit text-gray-500 text-sm md:text-base font-light">
                            Explore our engineered steel collections.
                        </p>
                    </div>
                </div>

                <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 lg:gap-8 snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-6 lg:pb-0">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group block w-[75vw] sm:w-[45vw] lg:w-full flex-shrink-0 snap-center lg:snap-align-none text-center"
                        >
                            <div className="w-full aspect-[4/5] bg-[#F9F9F9] rounded-2xl overflow-hidden mb-6 relative shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow duration-500 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                            
                            <h3 className="font-montserrat text-sm md:text-base font-bold text-black tracking-[0.15em] uppercase transition-colors duration-300">
                                {cat.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
