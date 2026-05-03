"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { optimizeImage } from "@/utils/cloudinary";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

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
            <div style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO, display: "flex", flexDirection: "column" }}>
                <SiteHeader />
                <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 900, fontFamily: FM, color: "#111", marginBottom: "1rem" }}>Your Cart is Empty</h1>
                    <Link href="/shop" style={{ padding: "1rem 2rem", background: "#111", color: "#fff", textDecoration: "none", fontWeight: 700, fontFamily: FM, borderRadius: "4px" }}>
                        CONTINUE SHOPPING
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
            // 1. Create Razorpay order via API
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
                        email: "",
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

            // 2. Open Razorpay checkout
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
                    // 3. Verify payment
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

                        if (!verifyRes.ok) {
                            throw new Error("Payment verification failed");
                        }

                        // 4. Success → clear cart and redirect
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
        <div style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO, display: "flex", flexDirection: "column" }}>
            <SiteHeader />
            
            <main style={{ flex: 1, padding: "3rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "3rem", alignItems: "start" }}>
                    
                    {/* LEFT: CHECKOUT FORM */}
                    <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: FM, color: "#111", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                            Secure Checkout
                        </h1>
                        
                        {/* Trust Indicators */}
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                            {["🔒 Secure Payment", "⚡ Fast Processing", "🚚 Reliable Delivery"].map((text) => (
                                <span key={text} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1da851", background: "rgba(37,211,102,0.1)", padding: "0.4rem 1rem", borderRadius: "100px", fontFamily: FM }}>
                                    {text}
                                </span>
                            ))}
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⚠️</span>
                                <div>
                                    <p style={{ margin: 0, fontSize: "0.95rem", color: "#991B1B", fontWeight: 600, fontFamily: FM }}>{error}</p>
                                    <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#DC2626", fontSize: "0.85rem", cursor: "pointer", padding: 0, marginTop: "0.5rem", textDecoration: "underline" }}>Dismiss</button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            
                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: FM, color: "#111", margin: "0.5rem 0 0" }}>Shipping Details</h3>
                            
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>Full Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: "100%", padding: "0.875rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem", fontFamily: FO, outline: "none", boxSizing: "border-box" }} />
                            </div>
                            
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>Phone Number</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required style={{ width: "100%", padding: "0.875rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem", fontFamily: FO, outline: "none", boxSizing: "border-box" }} />
                            </div>
                            
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>Address</label>
                                <textarea name="address" value={form.address} onChange={handleChange} required rows={2} style={{ width: "100%", padding: "0.875rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem", fontFamily: FO, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>City</label>
                                    <input type="text" name="city" value={form.city} onChange={handleChange} required style={{ width: "100%", padding: "0.875rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem", fontFamily: FO, outline: "none", boxSizing: "border-box" }} />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>Pincode</label>
                                    <input type="text" name="pincode" value={form.pincode} onChange={handleChange} required style={{ width: "100%", padding: "0.875rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem", fontFamily: FO, outline: "none", boxSizing: "border-box" }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#555", marginBottom: "0.4rem" }}>State</label>
                                <input type="text" name="state" value={form.state} onChange={handleChange} required style={{ width: "100%", padding: "0.875rem", border: "1px solid #ccc", borderRadius: "4px", fontSize: "1rem", fontFamily: FO, outline: "none", boxSizing: "border-box" }} />
                            </div>

                            <div style={{ height: 1, background: "#E6E6E6", margin: "1.5rem 0" }} />

                            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, fontFamily: FM, color: "#111", margin: 0 }}>Payment Method</h3>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1rem" }}>
                                <label
                                    onClick={() => setPaymentMethod("prepaid")}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem",
                                        border: paymentMethod === "prepaid" ? "2px solid #111" : "1px solid #ccc",
                                        borderRadius: "4px", cursor: "pointer",
                                        background: paymentMethod === "prepaid" ? "#fafafa" : "#fff",
                                    }}
                                >
                                    <input type="radio" name="payment" checked={paymentMethod === "prepaid"} readOnly style={{ width: "1.2rem", height: "1.2rem" }} />
                                    <div>
                                        <span style={{ fontSize: "1rem", fontWeight: 700, color: "#111", fontFamily: FM }}>UPI / Card / Net Banking</span>
                                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#666" }}>Pay full amount now via Razorpay</p>
                                    </div>
                                </label>
                                <label
                                    onClick={() => setPaymentMethod("cod")}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem",
                                        border: paymentMethod === "cod" ? "2px solid #111" : "1px solid #ccc",
                                        borderRadius: "4px", cursor: "pointer",
                                        background: paymentMethod === "cod" ? "#fafafa" : "#fff",
                                    }}
                                >
                                    <input type="radio" name="payment" checked={paymentMethod === "cod"} readOnly style={{ width: "1.2rem", height: "1.2rem" }} />
                                    <div>
                                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "#333", fontFamily: FM }}>Cash on Delivery (COD)</span>
                                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#666" }}>Pay 20% advance now, rest on delivery</p>
                                    </div>
                                </label>
                            </div>

                            {/* COD notice */}
                            {paymentMethod === "cod" && (
                                <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: "6px", padding: "1rem", fontSize: "0.9rem", color: "#9A3412" }}>
                                    <strong>COD Advance:</strong> ₹{Math.round(subtotal * 0.2).toLocaleString("en-IN")} (20% of ₹{subtotal.toLocaleString("en-IN")}) will be charged now. Remaining ₹{Math.round(subtotal * 0.8).toLocaleString("en-IN")} on delivery.
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={processing}
                                style={{
                                    width: "100%",
                                    padding: "1.25rem",
                                    background: processing ? "#666" : "#111",
                                    color: "#fff",
                                    fontSize: "1.2rem",
                                    fontWeight: 900,
                                    fontFamily: FM,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: processing ? "wait" : "pointer",
                                    transition: "background 0.2s",
                                    marginTop: "1rem",
                                    opacity: processing ? 0.7 : 1,
                                }}
                                onMouseEnter={(e) => !processing && (e.currentTarget.style.background = "#333")}
                                onMouseLeave={(e) => !processing && (e.currentTarget.style.background = "#111")}
                            >
                                {processing ? "PROCESSING..." : paymentMethod === "cod" ? `PAY ₹${Math.round(subtotal * 0.2).toLocaleString("en-IN")} ADVANCE` : "PLACE ORDER"}
                            </button>

                            <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666", fontFamily: FO, margin: 0, fontWeight: 500 }}>
                                🔒 100% Secure Payment. No hidden charges.
                            </p>
                        </form>
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div style={{ background: "#fdfdfd", padding: "2.5rem", borderRadius: "8px", border: "1px solid #E6E6E6", position: "sticky", top: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: FM, color: "#111", marginBottom: "1.5rem", borderBottom: "1px solid #E6E6E6", paddingBottom: "1rem" }}>
                            Order Summary
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
                            {items.map((item) => (
                                <div key={`${item.id}-${item.finish}`} style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
                                    <div style={{ width: 64, height: 64, flexShrink: 0, background: "#f0f0f0", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                                        <img src={optimizeImage(item.image, 150)} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <span style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.8)", color: "#fff", fontSize: "0.65rem", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                                            {item.qty}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, fontFamily: FM, color: "#111", margin: "0 0 0.2rem", lineHeight: 1.2 }}>{item.title}</h4>
                                        <p style={{ fontSize: "0.8rem", color: "#666", margin: 0, fontFamily: FO }}>Finish: {item.finish}</p>
                                    </div>
                                    <div style={{ fontWeight: 800, color: "#111", fontFamily: FM, fontSize: "1rem" }}>
                                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: "1px solid #E6E6E6", paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: "1rem", fontFamily: FO }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: "1rem", fontFamily: FO }}>
                                <span>Shipping</span>
                                <span style={{ color: "#1da851", fontWeight: 700 }}>Free</span>
                            </div>
                            {paymentMethod === "cod" && (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#9A3412", fontSize: "0.95rem", fontFamily: FO, fontWeight: 600 }}>
                                        <span>Advance (20%)</span>
                                        <span>₹{Math.round(subtotal * 0.2).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#666", fontSize: "0.95rem", fontFamily: FO }}>
                                        <span>Due on Delivery</span>
                                        <span>₹{Math.round(subtotal * 0.8).toLocaleString("en-IN")}</span>
                                    </div>
                                </>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#111", fontSize: "1.5rem", fontWeight: 900, fontFamily: FM, marginTop: "0.5rem", borderTop: "1px solid #E6E6E6", paddingTop: "1.5rem" }}>
                                <span>Total</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
