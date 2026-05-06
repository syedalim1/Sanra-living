"use client";

import React from "react";
import Link from "next/link";
import { FM, FO } from "../../shop/ShopComponents";

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
        <section style={{ padding: "2.5rem 1.5rem", background: "#f9f9f9" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#111",
                        marginBottom: "2rem",
                        fontFamily: FM,
                        letterSpacing: "-0.01em",
                    }}
                >
                    Shop by Price
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {collections.map((col) => (
                        <Link
                            key={col.title}
                            href={col.href}
                            style={{
                                display: "block",
                                textDecoration: "none",
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: "0.5rem",
                                aspectRatio: "16/10",
                            }}
                            className="group"
                        >
                            <img
                                src={col.image}
                                alt={col.title}
                                loading="lazy"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                }}
                                className="group-hover:scale-105"
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    padding: "1.5rem",
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: "1.25rem",
                                        fontWeight: 800,
                                        color: "#fff",
                                        fontFamily: FM,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    {col.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "0.9rem",
                                        color: "rgba(255,255,255,0.8)",
                                        fontFamily: FO,
                                    }}
                                >
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
