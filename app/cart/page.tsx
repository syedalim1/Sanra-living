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

export default function CartPage() {
    const { items, subtotal, dispatch } = useCart();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO, display: "flex", flexDirection: "column" }}>
                <SiteHeader />
                <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: FM, color: "#111", marginBottom: "1rem", letterSpacing: "-0.02em" }}>Your Cart is Empty</h1>
                    <p style={{ color: "#666", marginBottom: "2rem", fontSize: "1.1rem" }}>Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/shop" style={{ padding: "1.25rem 2.5rem", background: "#111", color: "#fff", textDecoration: "none", fontWeight: 800, letterSpacing: "0.05em", fontFamily: FM, borderRadius: "4px", textTransform: "uppercase" }}>
                        CONTINUE SHOPPING
                    </Link>
                </main>
                <SiteFooter />
            </div>
        );
    }

    return (
        <div style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO, display: "flex", flexDirection: "column" }}>
            <SiteHeader />
            
            <main style={{ flex: 1, padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: FM, color: "#111", marginBottom: "2rem", letterSpacing: "-0.02em" }}>Shopping Cart</h1>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        
                        {/* Cart Items List */}
                        <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.finish}`} style={{ display: "flex", alignItems: "center", gap: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #E6E6E6", position: "relative" }}>
                                        
                                        {/* Image */}
                                        <div style={{ width: 100, height: 100, flexShrink: 0, background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                                            <img src={optimizeImage(item.image, 200)} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        
                                        {/* Details */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <div>
                                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: FM, color: "#111", margin: 0 }}>{item.title}</h3>
                                                    <p style={{ fontSize: "0.85rem", color: "#666", margin: "0.25rem 0 0.5rem" }}>Finish: {item.finish}</p>
                                                    <p style={{ fontSize: "1rem", fontWeight: 700, color: "#333", margin: 0 }}>₹{item.price.toLocaleString("en-IN")}</p>
                                                </div>
                                                
                                                {/* Remove Button */}
                                                <button 
                                                    onClick={() => dispatch({ type: "REMOVE", payload: { id: item.id, finish: item.finish } })}
                                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: "0.25rem" }}
                                                    title="Remove Item"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                                                    </svg>
                                                </button>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                                                {/* Quantity */}
                                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #ccc", borderRadius: "4px", padding: "0.25rem" }}>
                                                    <button 
                                                        onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, finish: item.finish, qty: item.qty - 1 } })}
                                                        style={{ width: 28, height: 28, background: "#f5f5f5", border: "none", cursor: "pointer", fontWeight: "bold", fontFamily: FM }}
                                                    >-</button>
                                                    <span style={{ fontSize: "0.95rem", fontWeight: 600, minWidth: "1.5rem", textAlign: "center", fontFamily: FM }}>{item.qty}</span>
                                                    <button 
                                                        onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, finish: item.finish, qty: item.qty + 1 } })}
                                                        style={{ width: 28, height: 28, background: "#f5f5f5", border: "none", cursor: "pointer", fontWeight: "bold", fontFamily: FM }}
                                                    >+</button>
                                                </div>
                                                
                                                {/* Item Total */}
                                                <div>
                                                    <span style={{ fontSize: "1.1rem", fontWeight: 800, fontFamily: FM, color: "#111" }}>
                                                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary & CTA */}
                        <div style={{ background: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                                <span style={{ fontSize: "1.25rem", color: "#555", fontFamily: FO, fontWeight: 500 }}>Total Amount:</span>
                                <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111", fontFamily: FM, letterSpacing: "-0.02em" }}>
                                    ₹{subtotal.toLocaleString("en-IN")}
                                </span>
                            </div>
                            
                            <button 
                                onClick={() => router.push("/checkout")}
                                style={{
                                    width: "100%",
                                    padding: "1.25rem",
                                    background: "#111",
                                    color: "#fff",
                                    fontSize: "1.1rem",
                                    fontWeight: 800,
                                    fontFamily: FM,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#333"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#111"}
                            >
                                PROCEED TO CHECKOUT
                            </button>
                            
                            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#666", fontFamily: FO, marginTop: "1rem", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                                Secure Checkout • Fast Processing
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
