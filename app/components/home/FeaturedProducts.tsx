"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product, ProductCard, FM, FO } from "../../shop/ShopComponents";

interface FeaturedProductsProps {
    title: string;
    filterBy?: "new" | "bestseller";
    category?: string;
    limit?: number;
}

export default function FeaturedProducts({ title, filterBy, category, limit = 8 }: FeaturedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // Determine endpoint
                let url = `/api/products?limit=${limit}`;
                if (category) url += `&category=${encodeURIComponent(category)}`;
                
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to load");
                
                const json = await res.json();
                let fetchedProducts: Product[] = json.products ?? json ?? [];

                // Filter active
                fetchedProducts = fetchedProducts.filter((p) => p.is_active);

                // Apply custom filter
                if (filterBy === "new") {
                    fetchedProducts = fetchedProducts.filter(p => p.is_new);
                }
                
                // For 'bestseller' we'll just sort by some proxy if available, or just shuffle/take first N
                if (filterBy === "bestseller") {
                    // Placeholder logic: sort by highest stock sold or just random for now
                    fetchedProducts = fetchedProducts.sort((a, b) => a.stock_qty - b.stock_qty); 
                }

                setProducts(fetchedProducts.slice(0, limit));
            } catch (err) {
                console.error("Error fetching featured products:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [filterBy, category, limit]);

    if (loading) {
        return (
            <section style={{ padding: "3rem 1.5rem", background: "#fff" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ height: "2rem", width: "150px", background: "#f0f0f0", marginBottom: "1.5rem", animation: "pulse 1.5s infinite" }} />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ width: "280px", height: "350px", background: "#f0f0f0", flexShrink: 0, animation: "pulse 1.5s infinite" }} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section style={{ padding: "2.5rem 1.5rem", background: "#fff", borderBottom: "1px solid #eee" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            color: "#111",
                            fontFamily: FM,
                            letterSpacing: "-0.01em",
                            margin: 0,
                        }}
                    >
                        {title}
                    </h2>
                    <Link
                        href="/shop"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem 1.25rem",
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: "#111",
                            background: "#f0f0f0",
                            borderRadius: "0.25rem",
                            fontFamily: FM,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#111";
                            e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#f0f0f0";
                            e.currentTarget.style.color = "#111";
                        }}
                    >
                        View All
                    </Link>
                </div>

                <div
                    className="hide-scrollbar"
                    style={{
                        display: "flex",
                        overflowX: "auto",
                        gap: "1.5rem",
                        paddingBottom: "1rem",
                        scrollSnapType: "x mandatory",
                    }}
                >
                    {products.map((p, i) => (
                        <div key={p.id} style={{ width: "min(85vw, 280px)", flexShrink: 0, scrollSnapAlign: "start" }}>
                            <ProductCard 
                                product={p} 
                                index={i} 
                                buttonText="View"
                                badge={filterBy === "bestseller" ? "Best Seller" : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
