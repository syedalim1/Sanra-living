"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { optimizeImage } from "@/utils/cloudinary";

/* ── Razorpay type declaration ── */
declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => {
            open: () => void;
            on: (event: string, handler: (response: Record<string, unknown>) => void) => void;
        };
    }
}

export default function CheckoutPage() {
    const { items, subtotal, dispatch } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    /* ── Form state ── */
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");

    useEffect(() => {
        setMounted(true);
    }, []);

    /* ── Load Razorpay script ── */
    useEffect(() => {
        if (typeof window !== "undefined" && !document.getElementById("razorpay-script")) {
            const s = document.createElement("script");
            s.id = "razorpay-script";
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.async = true;
            document.body.appendChild(s);
        }
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="bg-[#FCFCFC] min-h-screen font-outfit flex flex-col">
                <SiteHeader />
                <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-black tracking-tight font-montserrat mb-4">
                        Your Cart is Empty.
                    </h1>
                    <p className="text-base text-gray-500 font-light mb-10 leading-relaxed">
                        Discover premium steel furniture crafted for modern living.
                    </p>
                    <Link 
                        href="/shop" 
                        className="inline-flex justify-center items-center px-10 py-4 bg-black text-white font-bold text-xs tracking-[0.2em] uppercase font-montserrat rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Explore Collection
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    /* ── Place Order Flow ── */
    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setProcessing(true);

        try {
            const codAdvance = paymentMethod === "cod" ? Math.round(subtotal * 0.2) : 0;
            const amountPayableNow = paymentMethod === "cod" ? codAdvance : subtotal;

            const res = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((i) => ({ id: i.id, title: i.title, qty: i.qty, price: i.price })),
                    subtotal,
                    codAdvance,
                    totalPayable: subtotal,
                    amountPayableNow,
                    paymentMethod,
                    shipping: {
                        name: form.name,
                        phone: form.phone,
                        email: form.email,
                        address1: form.address,
                        address2: "",
                        city: form.city,
                        state: form.state,
                        pincode: form.pincode,
                    },
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to create order. Please try again.");
            }

            const data = await res.json();

            if (!window.Razorpay) {
                throw new Error("Payment gateway is loading. Please try again in a moment.");
            }

            const options: Record<string, unknown> = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "SANRA LIVING",
                description: `Order ${data.orderNumber}`,
                order_id: data.rzpOrderId,
                prefill: {
                    name: form.name,
                    contact: form.phone,
                },
                theme: { color: "#111111" },
                handler: async function (response: Record<string, unknown>) {
                    try {
                        const verifyRes = await fetch("/api/razorpay/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                dbOrderId: data.dbOrderId,
                                items: items.map((i) => ({ id: i.id, qty: i.qty })),
                            }),
                        });

                        if (!verifyRes.ok) throw new Error("Payment verification failed");

                        dispatch({ type: "CLEAR" });
                        router.push(`/order-confirmation?order=${data.orderNumber}`);
                    } catch {
                        setError("Payment was received but verification failed. Please contact support with your order number: " + data.orderNumber);
                        setProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                        setError("Payment was cancelled. Your order is saved — you can try again.");
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function () {
                setError("Payment failed. Please check your payment details and try again.");
                setProcessing(false);
            });
            rzp.open();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setError(message);
            setProcessing(false);
        }
    };

    return (
        <div className="bg-[#FCFCFC] min-h-screen font-outfit flex flex-col">
            <SiteHeader />
            
            <main className="flex-1 pt-8 pb-16 lg:pt-12 lg:pb-24 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                    
                    {/* ── LEFT: CHECKOUT FORM ──────────────────────────── */}
                    <div className="w-full lg:flex-1">
                        
                        <div className="mb-8 lg:mb-10">
                            <h1 className="text-3xl lg:text-4xl font-black text-black tracking-tight font-montserrat mb-3">
                                Secure Checkout
                            </h1>
                            
                            {/* Premium Trust Badges */}
                            <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-4">
                                {[
                                    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Secure Payment" },
                                    { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Fast Processing" },
                                    { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", text: "Safe Packaging" }
                                ].map((trust, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="text-gray-400">
                                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d={trust.icon} />
                                            </svg>
                                        </div>
                                        <span className="text-[0.7rem] font-medium uppercase tracking-[0.1em] font-montserrat text-gray-500">{trust.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 lg:p-5 mb-8 flex items-start gap-4 shadow-sm">
                                <span className="text-xl shrink-0 mt-0.5">⚠️</span>
                                <div>
                                    <p className="text-sm font-semibold text-[#991B1B] font-montserrat leading-relaxed m-0">{error}</p>
                                    <button onClick={() => setError("")} className="text-xs font-semibold text-[#DC2626] uppercase tracking-widest mt-2 hover:underline underline-offset-4">Dismiss</button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-6 md:p-8 lg:p-10 border border-black/5 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col gap-8">
                            
                            {/* Shipping Details */}
                            <div>
                                <h3 className="text-sm font-black text-black tracking-[0.2em] uppercase font-montserrat mb-6">Shipping Details</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest font-montserrat ml-1">Full Name</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required 
                                            className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-black/10 rounded-xl font-outfit text-sm text-black outline-none focus:border-black/30 focus:bg-white focus:shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all placeholder:text-gray-400"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest font-montserrat ml-1">Phone Number</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required 
                                            className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-black/10 rounded-xl font-outfit text-sm text-black outline-none focus:border-black/30 focus:bg-white focus:shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all placeholder:text-gray-400"
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-5">
                                    <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest font-montserrat ml-1">Email Address</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required 
                                        className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-black/10 rounded-xl font-outfit text-sm text-black outline-none focus:border-black/30 focus:bg-white focus:shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all placeholder:text-gray-400"
                                        placeholder="Enter your email for order updates"
                                    />
                                </div>
                                
                                <div className="flex flex-col gap-2 mb-5">
                                    <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest font-montserrat ml-1">Delivery Address</label>
                                    <textarea name="address" value={form.address} onChange={handleChange} required rows={3} 
                                        className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-black/10 rounded-xl font-outfit text-sm text-black outline-none focus:border-black/30 focus:bg-white focus:shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all resize-none placeholder:text-gray-400"
                                        placeholder="Flat/House No, Floor, Building, Street, Area"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest font-montserrat ml-1">City</label>
                                        <input type="text" name="city" value={form.city} onChange={handleChange} required 
                                            className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-black/10 rounded-xl font-outfit text-sm text-black outline-none focus:border-black/30 focus:bg-white focus:shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all placeholder:text-gray-400"
                                            placeholder="Enter your city"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest font-montserrat ml-1">Pincode</label>
                                        <input type="text" name="pincode" value={form.pincode} onChange={handleChange} required 
                                            className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-black/10 rounded-xl font-outfit text-sm text-black outline-none focus:border-black/30 focus:bg-white focus:shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all placeholder:text-gray-400"
                                            placeholder="6-digit pincode"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[0.75rem] font-semibold text-gray-500 uppercase tracking-widest font-montserrat ml-1">State</label>
                                    <input type="text" name="state" value={form.state} onChange={handleChange} required 
                                        className="w-full px-4 py-3.5 bg-[#FAFAFA] border border-black/10 rounded-xl font-outfit text-sm text-black outline-none focus:border-black/30 focus:bg-white focus:shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all placeholder:text-gray-400"
                                        placeholder="Enter your state"
                                    />
                                </div>
                            </div>

                            <hr className="border-t border-black/5" />

                            {/* Payment Details */}
                            <div>
                                <h3 className="text-sm font-black text-black tracking-[0.2em] uppercase font-montserrat mb-6">Payment Method</h3>
                                
                                <div className="flex flex-col gap-4 mb-6">
                                    {/* Prepaid Option */}
                                    <label 
                                        onClick={() => setPaymentMethod("prepaid")}
                                        className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${paymentMethod === "prepaid" ? "border-black bg-[#FAFAFA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]" : "border-[#E5E5E5] bg-white hover:border-black/30"}`}
                                    >
                                        <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${paymentMethod === "prepaid" ? "border-black" : "border-gray-300"}`}>
                                            {paymentMethod === "prepaid" && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <span className="block text-[0.95rem] font-bold text-black font-montserrat tracking-tight mb-1">Prepaid / Full Amount</span>
                                            <p className="text-xs text-gray-500 font-outfit leading-relaxed">Pay securely now via UPI, Credit Card, Debit Card, or Net Banking.</p>
                                        </div>
                                    </label>
                                    
                                    {/* COD Option */}
                                    <label 
                                        onClick={() => setPaymentMethod("cod")}
                                        className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${paymentMethod === "cod" ? "border-black bg-[#FAFAFA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]" : "border-[#E5E5E5] bg-white hover:border-black/30"}`}
                                    >
                                        <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${paymentMethod === "cod" ? "border-black" : "border-gray-300"}`}>
                                            {paymentMethod === "cod" && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <span className="block text-[0.95rem] font-bold text-black font-montserrat tracking-tight mb-1">Cash on Delivery (20% Advance)</span>
                                            <p className="text-xs text-gray-500 font-outfit leading-relaxed">Pay 20% advance now to confirm order. Pay the remaining balance upon delivery.</p>
                                        </div>
                                    </label>
                                </div>

                                {/* COD notice */}
                                {paymentMethod === "cod" && (
                                    <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-4 lg:p-5 flex items-start gap-3">
                                        <svg className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                        </svg>
                                        <p className="text-[0.8rem] font-outfit text-gray-600 leading-relaxed m-0">
                                            <strong className="text-black font-semibold font-montserrat tracking-tight block mb-1">Advance Payment Required</strong>
                                            ₹{Math.round(subtotal * 0.2).toLocaleString("en-IN")} will be charged now. The remaining ₹{Math.round(subtotal * 0.8).toLocaleString("en-IN")} is due on delivery.
                                        </p>
                                    </div>
                                )}
                            </div>

                        </form>
                    </div>

                    {/* ── RIGHT: ORDER SUMMARY ──────────────────────────── */}
                    <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-28">
                        <div className="bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
                            <h2 className="text-sm font-black text-black tracking-[0.2em] uppercase font-montserrat mb-8">
                                Order Summary
                            </h2>

                            {/* Products List */}
                            <div className="flex flex-col gap-6 mb-8 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.finish}`} className="flex items-start gap-4">
                                        <div className="w-[72px] h-[90px] shrink-0 bg-[#F9F9F9] rounded-xl overflow-hidden relative border border-black/5">
                                            <img src={optimizeImage(item.image, 150) || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&q=80"} alt={item.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                                            <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md text-white text-[0.6rem] font-bold w-5 h-5 flex items-center justify-center font-montserrat rounded-bl-lg">
                                                {item.qty}
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col pt-1">
                                            <h4 className="text-[0.85rem] font-bold text-black font-montserrat tracking-tight mb-1 line-clamp-2 leading-snug">{item.title}</h4>
                                            <p className="text-[0.65rem] text-gray-500 font-outfit uppercase tracking-[0.1em] mb-2">Finish: {item.finish}</p>
                                            <div className="text-[0.9rem] font-bold text-black font-montserrat tracking-tight mt-auto">
                                                ₹{(item.price * item.qty).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-t border-black/5 mb-6" />

                            {/* Totals */}
                            <div className="flex flex-col gap-5 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-light font-outfit">Subtotal</span>
                                    <span className="font-semibold text-black font-montserrat tracking-tight">₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-light font-outfit">Shipping</span>
                                    <span className="text-[0.75rem] text-gray-400 font-medium uppercase tracking-widest font-montserrat">Free</span>
                                </div>
                                
                                {paymentMethod === "cod" && (
                                    <>
                                        <div className="flex justify-between items-center text-sm pt-2">
                                            <span className="text-gray-900 font-semibold font-outfit">Advance Payable (20%)</span>
                                            <span className="font-bold text-black font-montserrat tracking-tight">₹{Math.round(subtotal * 0.2).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[0.8rem]">
                                            <span className="text-gray-500 font-light font-outfit">Due on Delivery</span>
                                            <span className="text-gray-600 font-medium font-montserrat tracking-tight">₹{Math.round(subtotal * 0.8).toLocaleString("en-IN")}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            <div className="pt-8 border-t border-black/10 mb-8 flex justify-between items-end">
                                <span className="text-sm font-bold text-black uppercase tracking-widest font-montserrat">Total</span>
                                <span className="text-3xl lg:text-4xl font-black text-black font-montserrat tracking-tight leading-none">
                                    ₹{subtotal.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={processing}
                                className="w-full inline-flex justify-center items-center py-4 sm:py-5 bg-black text-white font-bold text-xs tracking-[0.2em] uppercase font-montserrat rounded-xl hover:bg-[#1A1A1A] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:translate-y-0 disabled:hover:shadow-none"
                            >
                                {processing ? "PROCESSING..." : paymentMethod === "cod" ? `PAY ₹${Math.round(subtotal * 0.2).toLocaleString("en-IN")} NOW` : "PLACE ORDER"}
                            </button>
                            
                            <p className="text-center text-[0.65rem] text-gray-400 font-outfit uppercase tracking-widest mt-6 font-medium">
                                🔒 Encrypted & Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
