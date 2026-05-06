"use client";

import React from "react";
import Link from "next/link";
import { FM } from "../../shop/ShopComponents";

const categories = [
    {
        name: "Chairs",
        href: "/shop/seating",
        image: "/images/CHAIRS.png",
    },
    {
        name: "Tables",
        href: "/shop/tables",
        image: "/images/TABLES.png",
    },
    {
        name: "Sets",
        href: "/shop/commercial",
        image: "/images/SETS.png",
    },
    {
        name: "Office",
        href: "/shop/workspace",
        image: "/images/OFFICES.png",
    },
    {
        name: "Home",
        href: "/shop/living",
        image: "/images/HOME.png",
    },
    {
        name: "Commercial",
        href: "/shop/commercial",
        image: "/images/COMMERCIAL.png",
    },
];

export default function CategoryGrid() {
    return (
        <section style={{ padding: "2.5rem 1.5rem", background: "#fff", borderBottom: "1px solid #eee" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <h2 style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#111",
                    fontFamily: FM,
                    textAlign: "center",
                    marginBottom: "2.5rem",
                    letterSpacing: "-0.02em"
                }}>
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group relative block w-full aspect-square overflow-hidden rounded-lg bg-gray-100"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/50" />
                            
                            {/* Text */}
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <h3
                                    style={{ fontFamily: FM, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
                                    className="text-white text-center text-lg md:text-xl font-extrabold uppercase tracking-wide transition-transform duration-300 group-hover:scale-105"
                                >
                                    {cat.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
