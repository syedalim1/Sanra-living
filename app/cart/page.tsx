"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { optimizeImage } from "@/utils/cloudinary";

export default function CartPage() {
    const { items, subtotal, dispatch } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        // Fetch real products for 'You May Also Like'
        fetch('/api/products?limit=10')
            .then(res => res.json())
            .then(data => {
                const products = data.products || data || [];
                setRelatedProducts(products.filter((p: any) => p.is_active).slice(0, 4));
            })
            .catch(() => {});
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="bg-white min-h-screen font-outfit flex flex-col">
                <SiteHeader />
                <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
                    {/* Empty Cart Illustration */}
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-black tracking-tight font-montserrat mb-4">
                        Your Cart Awaits.
                    </h1>
                    <p className="text-base text-gray-500 font-light mb-10 leading-relaxed">
                        Discover premium steel furniture crafted for modern living.
                    </p>
                    <Link 
                        href="/shop" 
                        className="inline-flex justify-center items-center px-10 py-4 bg-black text-white font-bold text-xs tracking-[0.2em] uppercase font-montserrat rounded-xl hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Explore Collection
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div className="bg-[#FCFCFC] min-h-screen font-outfit flex flex-col">
            <SiteHeader />
            
            <main className="flex-1 pt-12 pb-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    {/* ── PAGE HEADER ──────────────────────────── */}
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight font-montserrat mb-3">
                            Your Selections
                        </h1>
                        <p className="text-sm md:text-base text-gray-500 font-light">
                            Premium furniture curated for modern living.
                        </p>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        
                        {/* ── CART ITEMS LIST ──────────────────────────── */}
                        <div className="flex-1 w-full space-y-6">
                            {items.map((item) => (
                                <div 
                                    key={`${item.id}-${item.finish}`} 
                                    className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl p-4 sm:p-6 flex flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 group"
                                >
                                    
                                    {/* Image */}
                                    <div className="w-[80px] h-[100px] sm:w-[130px] sm:h-[130px] shrink-0 bg-white rounded-xl overflow-hidden relative cursor-pointer" onClick={() => router.push(`/shop/${item.id}`)}>
                                        <img 
                                            src={optimizeImage(item.image, 300) || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80"} 
                                            alt={item.title} 
                                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                                        />
                                    </div>
                                    
                                    {/* Details */}
                                    <div className="flex-1 w-full flex flex-col h-full justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link href={`/shop/${item.id}`} className="text-sm sm:text-lg font-bold text-black font-montserrat tracking-tight hover:text-gray-600 transition-colors line-clamp-2 leading-snug mb-1">
                                                    {item.title}
                                                </Link>
                                                <p className="text-[0.65rem] sm:text-[0.7rem] text-gray-500 font-outfit uppercase tracking-[0.15em]">
                                                    Finish: {item.finish}
                                                </p>
                                            </div>
                                            
                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => dispatch({ type: "REMOVE", payload: { id: item.id, finish: item.finish } })}
                                                className="text-gray-300 hover:text-red-400 transition-colors p-2 -mr-2 -mt-2 shrink-0"
                                                title="Remove Item"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 6L6 18M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center mt-3 sm:mt-6 w-full">
                                            {/* Quantity Stepper (Luxury Circular) */}
                                            <div className="flex items-center gap-2 sm:gap-4 bg-white border border-[#E5E5E5] rounded-full px-1 py-1 sm:px-1.5 sm:py-1.5 shadow-sm">
                                                <button 
                                                    onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, finish: item.finish, qty: item.qty - 1 } })}
                                                    className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-500 rounded-full hover:text-black hover:bg-gray-100 transition-colors font-outfit text-sm sm:text-base"
                                                >−</button>
                                                <span className="w-3 sm:w-4 text-center text-[0.65rem] sm:text-xs font-semibold text-black font-montserrat">{item.qty}</span>
                                                <button 
                                                    onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, finish: item.finish, qty: item.qty + 1 } })}
                                                    className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-500 rounded-full hover:text-black hover:bg-gray-100 transition-colors font-outfit text-sm sm:text-base"
                                                >+</button>
                                            </div>
                                            
                                            {/* Item Total */}
                                            <div className="text-right">
                                                <span className="text-xs sm:text-sm font-bold text-black font-montserrat tracking-tight">
                                                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8 pb-4">
                                <Link href="/shop" className="inline-flex items-center gap-2 text-[0.75rem] font-semibold text-gray-500 font-montserrat tracking-[0.15em] hover:text-black hover:underline underline-offset-4 transition-all uppercase">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* ── ORDER SUMMARY & CTA ──────────────────────────── */}
                        <div className="w-full lg:w-[380px] shrink-0 sticky top-28">
                            <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] mb-6">
                                <h2 className="text-sm font-black text-black tracking-[0.2em] uppercase font-montserrat mb-6">Summary</h2>
                                
                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-light">Subtotal</span>
                                        <span className="font-semibold text-black font-montserrat tracking-tight">₹{subtotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-light">Shipping</span>
                                        <span className="text-[0.75rem] text-gray-400 font-light italic">Calculated at checkout</span>
                                    </div>
                                </div>
                                
                                <div className="pt-8 border-t border-black/5 mb-10 flex justify-between items-end">
                                    <span className="text-sm font-bold text-black uppercase tracking-widest font-montserrat">Total</span>
                                    <span className="text-3xl lg:text-4xl font-black text-black font-montserrat tracking-tight leading-none">
                                        ₹{subtotal.toLocaleString("en-IN")}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => router.push("/checkout")}
                                    className="w-full inline-flex justify-center items-center py-4 sm:py-5 bg-black text-white font-bold text-xs tracking-[0.2em] uppercase font-montserrat rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>

                            {/* Trust Row */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 px-2">
                                {[
                                    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Secure Checkout" },
                                    { icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", text: "Fast Delivery" },
                                    { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", text: "Safe Packaging" },
                                    { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", text: "GST Invoice" }
                                ].map((trust, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-500">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={trust.icon} />
                                        </svg>
                                        <span className="text-[0.65rem] font-medium uppercase tracking-wider font-outfit">{trust.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* ── RELATED PRODUCTS ──────────────────────────── */}
            {relatedProducts.length > 0 && (
                <section className="bg-white py-24 lg:py-32 border-t border-black/5 mt-auto">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="mb-12">
                            <h3 className="text-base lg:text-lg font-bold text-gray-900 tracking-wide font-montserrat">
                                You May Also Like
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                            {relatedProducts.map((product) => (
                                <Link href={`/shop/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col h-full">
                                    <div className="aspect-[4/5] rounded-xl bg-[#F9F9F9] overflow-hidden mb-4 relative">
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                        <img 
                                            src={optimizeImage(product.image_url, 400) || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"} 
                                            alt={product.title} 
                                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" }}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 pt-1">
                                        <h4 className="text-[0.8rem] font-medium text-black font-montserrat tracking-tight mb-1.5 line-clamp-2 leading-relaxed">{product.title}</h4>
                                        <p className="text-[0.75rem] text-gray-500 font-outfit mt-auto pt-1">₹{product.price.toLocaleString("en-IN")}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <SiteFooter />
        </div>
    );
}
