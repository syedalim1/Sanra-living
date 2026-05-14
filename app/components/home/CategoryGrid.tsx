"use client";

import React from "react";
import Link from "next/link";
import { FM, FO } from "../../shop/ShopComponents";

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
        <section style={{ padding: "8rem 1.5rem", background: "#fff" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
                    <div>
                        <h2 style={{
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: "#111",
                            fontFamily: FM,
                            letterSpacing: "-0.02em",
                            marginBottom: "0.5rem"
                        }}>
                            Shop by Category
                        </h2>
                        <p style={{ fontFamily: FO, color: "#666", fontSize: "1.05rem" }}>
                            Explore our engineered steel collections.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group block w-full text-center"
                            style={{ textDecoration: "none" }}
                        >
                            <div 
                                style={{
                                    width: "100%",
                                    aspectRatio: "1/1",
                                    background: "#F5F5F5",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    marginBottom: "1.25rem",
                                    position: "relative",
                                }}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    loading="lazy"
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                    }}
                                    className="group-hover:scale-105"
                                />
                            </div>
                            
                            <h3
                                style={{ 
                                    fontFamily: FM, 
                                    fontSize: "0.95rem",
                                    fontWeight: 700,
                                    color: "#111",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    transition: "color 0.2s ease"
                                }}
                            >
                                {cat.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
