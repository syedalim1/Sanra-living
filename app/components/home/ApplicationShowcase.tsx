"use client";

import React from "react";
import Link from "next/link";
import { FM, FO } from "../../shop/ShopComponents";

const spaces = [
    {
        title: "Modern Living",
        subtitle: "Minimalist steel furniture for contemporary homes.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&q=80",
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
        <section style={{ padding: "8rem 1.5rem", background: "#fdfdfd" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h2
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: 800,
                            color: "#111",
                            marginBottom: "1rem",
                            fontFamily: FM,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Designed for Every Space
                    </h2>
                    <p style={{ fontFamily: FO, color: "#666", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
                        From intimate homes to bustling commercial environments, our engineered steel adapts flawlessly to your aesthetic.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {spaces.map((space) => (
                        <Link
                            key={space.title}
                            href={space.href}
                            className={`group relative block w-full overflow-hidden rounded-2xl bg-gray-100 ${space.gridClass}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div className={`w-full ${space.aspect} relative`}>
                                <img
                                    src={space.image}
                                    alt={space.title}
                                    loading="lazy"
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                                    }}
                                    className="group-hover:scale-105"
                                />
                                {/* Gradient Overlay for text readability */}
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)",
                                    }}
                                />
                                
                                {/* Content */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        width: "100%",
                                        padding: "2rem",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "1.25rem",
                                            fontWeight: 700,
                                            color: "#fff",
                                            fontFamily: FM,
                                            letterSpacing: "0.02em",
                                            marginBottom: "0.25rem",
                                            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                                        }}
                                    >
                                        {space.title}
                                    </h3>
                                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", fontFamily: FO }}>
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
