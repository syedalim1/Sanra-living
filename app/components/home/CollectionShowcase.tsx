"use client";

import React from "react";
import Link from "next/link";

const collections = [
    {
        title: "Budget Picks",
        subtitle: "Under ₹5,000",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        href: "/shop",
    },
    {
        title: "Mid-Range",
        subtitle: "₹5,000 – ₹10,000",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80",
        href: "/shop",
    },
    {
        title: "Premium",
        subtitle: "₹10,000+",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=600&q=80",
        href: "/shop",
    },
];

export default function CollectionShowcase() {
    return (
        <section className="bg-white py-16 lg:py-24 px-6 lg:px-8 border-b border-black/5">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-black font-montserrat tracking-tight mb-10 lg:mb-12">
                    Shop by Price
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {collections.map((col) => (
                        <Link
                            key={col.title}
                            href={col.href}
                            className="group relative block overflow-hidden rounded-2xl aspect-[16/10] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                        >
                            <img
                                src={col.image}
                                alt={col.title}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 lg:p-8 flex flex-col justify-end">
                                <h3 className="text-xl lg:text-2xl font-black text-white font-montserrat mb-1 tracking-tight">
                                    {col.title}
                                </h3>
                                <p className="text-sm text-white/80 font-outfit tracking-wide">
                                    {col.subtitle}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
