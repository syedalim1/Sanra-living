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
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-2xl md:text-3xl font-black text-black font-montserrat tracking-tight m-0">
                        {title}
                    </h2>
                    <Link
                        href="/shop"
                        className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-black bg-transparent border border-black/20 rounded-lg font-montserrat uppercase tracking-widest transition-all duration-300 hover:bg-black hover:text-white hover:border-black"
                    >
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
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
