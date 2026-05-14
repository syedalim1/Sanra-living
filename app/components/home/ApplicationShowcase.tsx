"use client";

import React from "react";
import Link from "next/link";

const spaces = [
    {
        title: "Modern Living",
        subtitle: "Minimalist steel furniture for contemporary homes.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        href: "/shop",
        gridClass: "md:col-span-2 md:row-span-2",
        aspect: "aspect-square md:aspect-auto md:h-[600px]",
    },
    {
        title: "Workspace",
        subtitle: "Engineered for focus.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        href: "/shop/workspace",
        gridClass: "md:col-span-1 md:row-span-1",
        aspect: "aspect-square md:h-[288px]",
    },
    {
        title: "Commercial",
        subtitle: "Durable seating for cafes.",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
        href: "/shop/commercial",
        gridClass: "md:col-span-1 md:row-span-1",
        aspect: "aspect-square md:h-[288px]",
    },
];

export default function ApplicationShowcase() {
    return (
        <section className="bg-white py-16 lg:py-24 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-black font-montserrat tracking-tight mb-4">
                        Designed for Every Space
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg font-outfit font-light max-w-2xl mx-auto">
                        From intimate homes to bustling commercial environments, our engineered steel adapts flawlessly to your aesthetic.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {spaces.map((space) => (
                        <Link
                            key={space.title}
                            href={space.href}
                            className={`group relative block w-full overflow-hidden rounded-2xl bg-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${space.gridClass}`}
                        >
                            <div className={`w-full ${space.aspect} relative`}>
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Gradient Overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent mix-blend-multiply" />
                                
                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 flex flex-col justify-end">
                                    <h3 className="text-xl lg:text-2xl font-black text-white font-montserrat mb-1 tracking-tight">
                                        {space.title}
                                    </h3>
                                    <p className="text-sm text-white/80 font-outfit tracking-wide">
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
