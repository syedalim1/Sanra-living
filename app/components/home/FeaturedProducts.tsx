"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product, ProductCard } from "../../shop/ShopComponents";

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
                let url = `/api/products?limit=${limit}`;
                if (category) url += `&category=${encodeURIComponent(category)}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to load");

                const json = await res.json();
                let fetchedProducts: Product[] = json.products ?? json ?? [];

                fetchedProducts = fetchedProducts.filter((p) => p.is_active);

                if (filterBy === "new") {
                    fetchedProducts = fetchedProducts.filter((p) => p.is_new);
                }

                if (filterBy === "bestseller") {
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
            <section className="bg-[#FAF9F6] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-black/[0.03]">
                <div className="max-w-7xl mx-auto">
                    <div className="h-5 w-44 sl-skeleton mb-10" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="w-full sl-skeleton" style={{ aspectRatio: "3/4" }} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="bg-[#FAF9F6] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-black/[0.03]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-8 lg:mb-14 gap-4">
                    <div>
                        <p className="text-[0.56rem] tracking-[0.32em] uppercase text-[#C5A880] font-montserrat font-medium mb-2">
                            {filterBy === "bestseller" ? "PATRONS' CHOICE" : "FRESH INCEPTION"}
                        </p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#111111] font-montserrat tracking-tight m-0">
                            {title}
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="shrink-0 text-[0.6rem] text-black/55 font-montserrat tracking-[0.2em] uppercase hover:text-black transition-colors duration-300 border-b border-black/15 pb-0.5 w-fit"
                    >
                        View Collection →
                    </Link>
                </div>

                {/* ── 2-column on mobile, 3-column on desktop — NO overflow scroll ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
                    {products.map((p, i) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            index={i}
                            buttonText="View Detail"
                            badge={filterBy === "bestseller" ? "Best Seller" : undefined}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
