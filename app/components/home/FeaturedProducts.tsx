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
            <section className="bg-white py-16 lg:py-20 px-6 lg:px-8 border-b border-black/5">
                <div className="max-w-7xl mx-auto">
                    <div className="h-8 w-40 bg-gray-100 rounded-md mb-8 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-full aspect-[4/5] bg-gray-100 rounded-2xl flex-shrink-0 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="bg-white py-16 lg:py-20 px-6 lg:px-8 border-b border-black/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl md:text-3xl font-light text-black font-montserrat tracking-tight m-0">
                        {title}
                    </h2>
                    <Link
                        href="/shop"
                        className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-[0.58rem] font-medium text-black/60 bg-transparent border border-black/10 rounded-full font-montserrat uppercase tracking-[0.18em] transition-all duration-300 hover:border-black/25 hover:text-black"
                    >
                        View All
                    </Link>
                </div>

                {/* Mobile: horizontal scroll carousel | Desktop: 3-column grid */}
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 gap-4 lg:hidden pb-4">
                    {products.map((p, i) => (
                        <div key={p.id} className="flex-shrink-0 w-[80vw] snap-start">
                            <ProductCard 
                                product={p} 
                                index={i} 
                                buttonText="View"
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
