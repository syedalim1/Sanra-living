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
                    fetchedProducts = fetchedProducts.filter(p => p.is_new);
                }
                
                if (filterBy === "bestseller") {
                    // Sorting to simulate best seller based on lowest stock quantity or similar logic
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
            <section className="bg-[#FAF9F6] py-20 lg:py-24 px-6 lg:px-8 border-b border-black/[0.03]">
                <div className="max-w-7xl mx-auto">
                    <div className="h-6 w-48 bg-black/[0.03] rounded mb-10 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-full aspect-[4/5] bg-black/[0.02] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="bg-[#FAF9F6] py-20 lg:py-24 px-6 lg:px-8 border-b border-black/[0.03]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 lg:mb-16">
                    <div>
                        <p className="text-[0.58rem] tracking-[0.3em] uppercase text-[#C5A880] font-montserrat font-medium mb-3">
                            {filterBy === "bestseller" ? "PATRONS' CHOICE" : "FRESH INCEPTION"}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-light text-[#111111] font-montserrat tracking-tight m-0">
                            {title}
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="text-[0.62rem] text-black/55 font-montserrat tracking-[0.2em] uppercase hover:text-black transition-colors duration-300 border-b border-black/15 pb-1 w-fit"
                    >
                        View Collection →
                    </Link>
                </div>

                {/* Mobile: horizontal scroll carousel | Desktop: 3-column grid */}
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 gap-6 lg:hidden pb-6">
                    {products.map((p, i) => (
                        <div key={p.id} className="flex-shrink-0 w-[78vw] sm:w-[48vw] snap-start">
                            <ProductCard 
                                product={p} 
                                index={i} 
                                buttonText="View Detail"
                                badge={filterBy === "bestseller" ? "Best Seller" : undefined}
                            />
                        </div>
                    ))}
                </div>

                <div className="hidden lg:grid grid-cols-3 gap-10 lg:gap-12">
                    {products.map((p, i) => (
                        <div key={p.id} className="w-full">
                            <ProductCard 
                                product={p} 
                                index={i} 
                                buttonText="View Detail"
                                badge={filterBy === "bestseller" ? "Best Seller" : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
