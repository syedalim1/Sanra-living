"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { optimizeImage } from "@/utils/cloudinary";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order");

    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderNumber) {
            setError("No order number provided.");
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${orderNumber}`);
                if (!res.ok) {
                    throw new Error("Order not found or access denied.");
                }
                const data = await res.json();
                setOrder(data.order);
                setItems(data.items);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="bg-[#FCFCFC] min-h-screen font-outfit flex flex-col">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-gray-500 font-montserrat uppercase tracking-widest">Loading Order...</p>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="bg-[#FCFCFC] min-h-screen font-outfit flex flex-col">
                <SiteHeader />
                <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-black tracking-tight font-montserrat mb-3">
                        Order Not Found
                    </h1>
                    <p className="text-sm text-gray-500 font-light mb-8">
                        We couldn't locate this order. Please verify your order number or contact support.
                    </p>
                    <Link 
                        href="/contact" 
                        className="inline-flex justify-center items-center px-8 py-3.5 bg-black text-white font-bold text-xs tracking-[0.2em] uppercase font-montserrat rounded-xl hover:bg-[#1A1A1A] transition-all"
                    >
                        Contact Support
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }

    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });

    return (
        <div className="bg-[#FAFAFA] min-h-screen font-outfit flex flex-col">
            <SiteHeader />

            <main className="flex-1 px-4 py-12 lg:py-20 flex flex-col items-center">
                <div className="w-full max-w-2xl">
                    
                    {/* ── TOP SUCCESS SECTION ── */}
                    <div className="text-center mb-12">
                        <div className="w-14 h-14 bg-[#F0FDF4] border border-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-black font-montserrat tracking-tight mb-2">
                            Order Confirmed.
                        </h1>
                        <p className="text-[0.95rem] text-gray-500 font-light leading-relaxed max-w-sm mx-auto">
                            Thank you, {order.user_email}. We’re preparing your furniture with care.
                        </p>
                    </div>

                    {/* ── ORDER META INFO ── */}
                    <div className="bg-white border border-black/5 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-[0.65rem] text-gray-400 font-montserrat uppercase tracking-widest mb-0.5">Order Number</p>
                                <p className="text-[0.95rem] font-bold text-black font-montserrat">{order.order_number}</p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-black/5" />

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div>
                                <p className="text-[0.65rem] text-gray-400 font-montserrat uppercase tracking-widest mb-0.5">Date</p>
                                <p className="text-[0.95rem] font-bold text-black font-montserrat">{orderDate}</p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-black/5" />

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            </div>
                            <div>
                                <p className="text-[0.65rem] text-gray-400 font-montserrat uppercase tracking-widest mb-0.5">Payment</p>
                                <p className="text-[0.95rem] font-bold text-black font-montserrat capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── ORDERED PRODUCTS ── */}
                    <div className="bg-white border border-black/5 rounded-2xl overflow-hidden mb-12 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="bg-[#F9F9F9] px-6 py-4 border-b border-black/5">
                            <h2 className="text-[0.75rem] font-bold text-gray-500 tracking-[0.15em] uppercase font-montserrat">Order Summary</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col gap-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-black/5 last:border-0 last:pb-0">
                                        <div className="w-[80px] h-[100px] bg-[#FAFAFA] rounded-xl overflow-hidden relative shrink-0 border border-black/5">
                                            <img src={optimizeImage(item.image, 200)} alt={item.product_name} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md text-white text-[0.6rem] font-bold w-5 h-5 flex items-center justify-center font-montserrat rounded-bl-lg">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <h4 className="text-[0.9rem] font-bold text-black font-montserrat tracking-tight mb-1 line-clamp-2 leading-snug">{item.product_name}</h4>
                                            <div className="flex items-center justify-between mt-3">
                                                <p className="text-[0.7rem] text-gray-500 font-outfit uppercase tracking-[0.1em]">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-black font-montserrat tracking-tight">₹{(item.total_price || (item.unit_price * item.quantity)).toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-[#FAFAFA] px-6 py-5 border-t border-black/5 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[0.8rem] text-gray-500 font-outfit">Subtotal</span>
                                <span className="text-[0.85rem] font-medium text-black font-montserrat">₹{order.total_amount.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[0.8rem] text-gray-500 font-outfit">Shipping</span>
                                <span className="text-[0.7rem] font-semibold text-gray-400 tracking-widest uppercase font-montserrat">Free</span>
                            </div>
                            {order.payment_method === "cod" && (
                                <>
                                    <div className="flex justify-between items-center pt-2 border-t border-black/5">
                                        <span className="text-[0.8rem] text-gray-800 font-medium font-outfit">Advance Paid</span>
                                        <span className="text-[0.85rem] font-medium text-black font-montserrat">₹{(order.advance_paid || 0).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[0.8rem] text-gray-500 font-outfit">Due on Delivery</span>
                                        <span className="text-[0.85rem] font-medium text-gray-600 font-montserrat">₹{(order.remaining_amount || 0).toLocaleString("en-IN")}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between items-end pt-3 border-t border-black/10 mt-1">
                                <span className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-[0.15em] font-montserrat">Total</span>
                                <span className="text-2xl font-black text-black font-montserrat tracking-tight leading-none">₹{order.total_amount.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── WHAT'S NEXT TIMELINE ── */}
                    <div className="mb-12">
                        <h2 className="text-[0.75rem] font-bold text-gray-400 tracking-[0.15em] uppercase font-montserrat mb-8 text-center">
                            What's Next
                        </h2>
                        <div className="flex justify-between relative max-w-lg mx-auto">
                            {/* Connector Line */}
                            <div className="absolute top-[22px] left-[15%] right-[15%] h-[1px] border-t border-dashed border-gray-300 z-0"></div>
                            
                            <div className="flex flex-col items-center flex-1 z-10">
                                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center mb-3 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <span className="text-[0.75rem] font-bold text-black font-montserrat tracking-tight mb-1">Confirmed</span>
                                <span className="text-[0.65rem] text-gray-500 text-center leading-relaxed">Order received</span>
                            </div>

                            <div className="flex flex-col items-center flex-1 z-10">
                                <div className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center mb-3">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                </div>
                                <span className="text-[0.75rem] font-bold text-gray-500 font-montserrat tracking-tight mb-1">Processing</span>
                                <span className="text-[0.65rem] text-gray-400 text-center leading-relaxed">Factory preparation</span>
                            </div>

                            <div className="flex flex-col items-center flex-1 z-10">
                                <div className="w-11 h-11 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center mb-3">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                </div>
                                <span className="text-[0.75rem] font-bold text-gray-500 font-montserrat tracking-tight mb-1">Dispatched</span>
                                <span className="text-[0.65rem] text-gray-400 text-center leading-relaxed">Out for delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* ── SUPPORT CTA ── */}
                    <div className="bg-white border border-black/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0 mx-auto md:mx-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-[0.95rem] font-bold text-black font-montserrat tracking-tight">Need assistance?</h3>
                                <p className="text-[0.8rem] text-gray-500 font-outfit mt-0.5">We're here to help with your order.</p>
                            </div>
                        </div>
                        <a 
                            href="https://wa.me/8300904920" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-6 py-3 bg-[#FAFAFA] hover:bg-black hover:text-white text-black border border-[#E5E5E5] hover:border-black rounded-xl text-[0.7rem] font-bold uppercase tracking-widest font-montserrat transition-colors text-center"
                        >
                            WhatsApp Us
                        </a>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] font-outfit">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
