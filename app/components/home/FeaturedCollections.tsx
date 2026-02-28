"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { optimizeImage } from "@/utils/cloudinary";

interface Product {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    category: string;
    image_url: string;
    is_active: boolean;
}

export default function FeaturedCollections() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products")
            .then((r) => r.json())
            .then((data: Product[]) => {
                const active = data.filter((p) => p.is_active);
                setProducts(active.slice(0, 6));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <section className="sl-section" style={{ background: "#F5F5F5" }}>
            <div className="sl-container">
                {/* Header */}
                <div
                    className="flex flex-col md:flex-row md:items-end md:justify-between"
                    style={{ marginBottom: "3rem", gap: "1rem" }}
                >
                    <div>
                        <div
                            className="flex items-center"
                            style={{ gap: "0.75rem", marginBottom: "0.75rem" }}
                        >
                            <div
                                style={{ width: "2rem", height: "1.5px", background: "#bbb" }}
                            />
                            <span className="sl-label">Curated Selection</span>
                        </div>
                        <h2 className="sl-heading-lg">Featured Systems</h2>
                    </div>
                    <Link
                        href="/shop"
                        className="sl-btn sl-btn-outline"
                        style={{ fontSize: "0.8rem", alignSelf: "flex-start" }}
                    >
                        View All →
                    </Link>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div
                        className="grid grid-cols-2 md:grid-cols-3"
                        style={{ gap: "1rem" }}
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "#E9E9E7",
                                    aspectRatio: "3/4",
                                    borderRadius: "2px",
                                    animation: "pulse 1.5s ease-in-out infinite",
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-2 md:grid-cols-3"
                        style={{ gap: "1rem" }}
                    >
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/shop/${product.id}`}
                                className="hp-product-card"
                                style={{ textDecoration: "none" }}
                            >
                                <div className="hp-product-img-wrap">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={optimizeImage(product.image_url, 600) || "/images/FEATURED_PRODUCT.png"}
                                        alt={product.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                                <div className="hp-product-info">
                                    <span className="hp-product-category">
                                        {product.category}
                                    </span>
                                    <h3 className="hp-product-title">{product.title}</h3>
                                    <span className="hp-product-price">
                                        ₹{product.price?.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
