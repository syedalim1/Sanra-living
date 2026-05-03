"use client";

import React from "react";
import Link from "next/link";
import { FM } from "../../shop/ShopComponents";

const categories = [
    {
        name: "Chairs",
        href: "/shop/seating",
        image: "https://images.unsplash.com/photo-1506439016147-380d19bdcb55?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Tables",
        href: "/shop/tables",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Sets",
        href: "/shop/commercial",
        image: "https://images.unsplash.com/photo-1554295405-abb8fd54f153?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Office",
        href: "/shop/workspace",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Home",
        href: "/shop/living",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    },
    {
        name: "Commercial",
        href: "/shop/commercial",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    },
];

export default function CategoryGrid() {
    return (
        <section style={{ padding: "4rem 1.5rem", background: "#fff", borderBottom: "1px solid #eee" }}>
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
