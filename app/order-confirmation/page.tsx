"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SiteHeader from "@/app/components/SiteHeader";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order") || "#SL12345678";
    
    // Hardcoded items based on the reference design
    const items = [
        { id: 1, name: "SANRA Round Stool with Wooden Top", qty: 1, price: 1299, image: "/images/sanra_stool.png" },
        { id: 2, name: "Dining Chair with Back Support", qty: 1, price: 1300, image: "/images/sanra_chair.png" }
    ];
    
    return (
        <div style={{ background: "#FAFAFA", minHeight: "100vh", fontFamily: FO, display: "flex", flexDirection: "column" }}>
            
            {/* Top Bar */}
            <div className="top-banner-scroll" style={{ background: "#0A0A0A", color: "#F59E0B", padding: "0.6rem 1rem", fontSize: "0.75rem", fontFamily: FM, display: "flex", overflowX: "auto", whiteSpace: "nowrap", gap: "2rem", justifyContent: "center", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Jindal Steel
                </span>
                <span style={{ color: "#333" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    3 Year Warranty
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Made in Coimbatore
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    Pan India Delivery
                </span>
            </div>

            <SiteHeader />

            <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 1.5rem", position: "relative", overflowX: "hidden" }}>
                
                {/* Confetti Background Shapes */}
                <div style={{ position: "absolute", top: "40px", left: "0", right: "0", height: "200px", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "10%", left: "15%", width: 8, height: 8, background: "#E5E7EB", transform: "rotate(45deg)" }} />
                    <div style={{ position: "absolute", top: "40%", left: "28%", width: 6, height: 6, background: "#D1D5DB", transform: "rotate(15deg)" }} />
                    <div style={{ position: "absolute", top: "70%", left: "20%", width: 10, height: 10, background: "#E8D9C0", transform: "rotate(60deg)" }} />
                    <div style={{ position: "absolute", top: "15%", left: "40%", width: 7, height: 7, background: "#E8D9C0", transform: "rotate(30deg)" }} />
                    <div style={{ position: "absolute", top: "10%", right: "30%", width: 8, height: 8, background: "#E5E7EB", transform: "rotate(45deg)" }} />
                    <div style={{ position: "absolute", top: "35%", right: "15%", width: 6, height: 6, background: "#D1D5DB", transform: "rotate(15deg)" }} />
                    <div style={{ position: "absolute", top: "65%", right: "22%", width: 8, height: 8, background: "#D1D5DB", transform: "rotate(45deg)" }} />
                    <div style={{ position: "absolute", top: "25%", right: "35%", width: 6, height: 6, background: "#E8D9C0", transform: "rotate(60deg)" }} />
                </div>

                <div style={{ maxWidth: 720, width: "100%", zIndex: 1, paddingBottom: "80px" }}>
                    
                    {/* Success Icon */}
                    <div style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: "#E8F5EE",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 1.5rem",
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h1 style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: FM, color: "#111", textAlign: "center", marginBottom: "0.5rem" }}>
                        Thank You!
                    </h1>
                    <p style={{ fontSize: "1.05rem", color: "#111", textAlign: "center", marginBottom: "0.25rem", fontWeight: 600 }}>
                        Your order has been placed successfully.
                    </p>
                    <p style={{ fontSize: "1rem", color: "#555", textAlign: "center", marginBottom: "3rem" }}>
                        We've received your order and will process it soon.
                    </p>

                    {/* Order Meta Info Card */}
                    <div style={{
                        background: "#fff", borderRadius: "8px", padding: "1.5rem 2rem",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)", border: "1px solid #EAEAEA",
                        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem",
                        flexWrap: "wrap", gap: "1.5rem"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F4F9F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.25rem", fontFamily: FO }}>Order Number</p>
                                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#228B22", margin: 0, fontFamily: FM }}>{orderNumber}</p>
                            </div>
                        </div>

                        <div style={{ width: "1px", height: "40px", background: "#EAEAEA", display: "none" }} className="divider-desktop"></div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F4F9F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.25rem", fontFamily: FO }}>Order Date</p>
                                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", margin: 0, fontFamily: FM }}>25 May 2025</p>
                            </div>
                        </div>

                        <div style={{ width: "1px", height: "40px", background: "#EAEAEA", display: "none" }} className="divider-desktop"></div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F4F9F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.25rem", fontFamily: FO }}>Payment Method</p>
                                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", margin: 0, fontFamily: FM }}>Online Payment</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                        <p style={{ fontSize: "0.9rem", color: "#555", fontFamily: FO }}>
                            We have sent an order confirmation email to<br/>
                            <strong style={{ color: "#111", fontFamily: FM, fontSize: "0.95rem" }}>example@gmail.com</strong>
                        </p>
                    </div>

                    {/* Order Details */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                        <div style={{ background: "#FAFAFA", position: "relative", zIndex: 2, padding: "0 0.5rem", fontSize: "0.95rem", fontWeight: 700, fontFamily: FM, color: "#111", alignSelf: "flex-start", transform: "translateY(50%)", marginLeft: "1.5rem" }}>
                            Order Details
                        </div>
                    </div>

                    {/* Order Details Card */}
                    <div style={{
                        background: "#fff", borderRadius: "8px", border: "1px solid #EAEAEA", marginBottom: "3.5rem", overflow: "hidden"
                    }}>
                        <div style={{ paddingTop: "1rem" }}>
                            {items.map((item, index) => (
                                <div key={item.id} style={{
                                    display: "flex", padding: "1.25rem", alignItems: "center", gap: "1.25rem",
                                    borderBottom: index < items.length - 1 ? "1px solid #F5F5F5" : "none"
                                }}>
                                    <div style={{ width: 64, height: 64, background: "#F9F9F9", borderRadius: "4px", border: "1px solid #EAEAEA", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                                        <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", margin: "0 0 0.25rem", fontFamily: FM }}>{item.name}</p>
                                        <p style={{ fontSize: "0.85rem", color: "#666", margin: 0, fontFamily: FO }}>Qty: {item.qty}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111", margin: 0, fontFamily: FM }}>₹{item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ padding: "1.25rem", borderTop: "1px solid #EAEAEA", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff" }}>
                            <div>
                                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", margin: "0 0 0.25rem", fontFamily: FM }}>Total Amount</p>
                                <p style={{ fontSize: "0.8rem", color: "#666", margin: 0, fontFamily: FO }}>(Inclusive of all taxes)</p>
                            </div>
                            <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "#228B22", margin: 0, fontFamily: FM }}>₹3,067</p>
                        </div>
                    </div>

                    {/* What's Next Timeline */}
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: FM, color: "#111", marginBottom: "2.5rem", textAlign: "center" }}>
                        What's Next?
                    </h2>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3.5rem", position: "relative" }}>
                        {/* Connecting Line */}
                        <div style={{ position: "absolute", top: "24px", left: "15%", right: "15%", height: "2px", borderTop: "2px dashed #D1D5DB", zIndex: 0 }}></div>
                        
                        {/* Step 1 */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#E8F5EE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            </div>
                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111", fontFamily: FM, textAlign: "center", marginBottom: "0.3rem" }}>Order Confirmed</p>
                            <p style={{ fontSize: "0.75rem", color: "#666", textAlign: "center", maxWidth: "120px", fontFamily: FO, lineHeight: 1.4 }}>We've received<br/>your order.</p>
                        </div>

                        {/* Step 2 */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            </div>
                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111", fontFamily: FM, textAlign: "center", marginBottom: "0.3rem" }}>Order Processing</p>
                            <p style={{ fontSize: "0.75rem", color: "#666", textAlign: "center", maxWidth: "120px", fontFamily: FO, lineHeight: 1.4 }}>We are preparing<br/>your order.</p>
                        </div>

                        {/* Step 3 */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#228B22" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            </div>
                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111", fontFamily: FM, textAlign: "center", marginBottom: "0.3rem" }}>Out for Delivery</p>
                            <p style={{ fontSize: "0.75rem", color: "#666", textAlign: "center", maxWidth: "120px", fontFamily: FO, lineHeight: 1.4 }}>Your order will be<br/>delivered soon.</p>
                        </div>
                    </div>

                    {/* Promo Banner */}
                    <div style={{
                        background: "linear-gradient(to right, #F5EAE1, #F9F0E7)", borderRadius: "8px",
                        position: "relative", overflow: "hidden", marginBottom: "1.5rem",
                        display: "flex", alignItems: "center", minHeight: "180px"
                    }}>
                        <div style={{ padding: "2rem", position: "relative", zIndex: 1, flex: 1, maxWidth: "60%" }}>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, fontFamily: FM, color: "#111", marginBottom: "1.25rem", lineHeight: 1.3 }}>
                                Transform Your Space<br/>with Premium Steel Furniture
                            </h3>
                            <Link href="/shop" style={{
                                display: "inline-block", background: "#000", color: "#fff",
                                padding: "0.75rem 1.5rem", fontSize: "0.75rem", fontWeight: 700, fontFamily: FM,
                                textTransform: "uppercase", textDecoration: "none", borderRadius: "4px", letterSpacing: "0.05em"
                            }}>
                                SHOP NOW
                            </Link>
                        </div>
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%" }}>
                            {/* Mask overlay for smooth gradient fade from image to background */}
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #F5EAE1, transparent 40%)", zIndex: 1 }}></div>
                            <Image src="/images/sanra_banner.png" alt="Premium Steel Furniture" fill style={{ objectFit: "cover", objectPosition: "left center" }} />
                        </div>
                    </div>

                    {/* Need Help Card */}
                    <div style={{
                        background: "#F9F6F0", borderRadius: "8px", padding: "1.5rem",
                        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111", margin: "0 0 0.25rem", fontFamily: FM }}>Need Help?</p>
                                <p style={{ fontSize: "0.9rem", color: "#555", margin: 0, fontFamily: FO }}>We've here for you.</p>
                            </div>
                        </div>
                        <a href="mailto:hello@sanraliving.com" style={{
                            padding: "0.8rem 1.5rem", border: "1px solid #111", color: "#111",
                            fontSize: "0.8rem", fontWeight: 700, fontFamily: FM, textTransform: "uppercase",
                            textDecoration: "none", borderRadius: "4px", background: "transparent", letterSpacing: "0.05em"
                        }}>
                            CONTACT US
                        </a>
                    </div>

                </div>
            </main>

            {/* Bottom Mobile Navigation (Visible on mobile, styling hidden on desktop) */}
            <div className="mobile-bottom-nav" style={{
                position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #EAEAEA",
                display: "flex", justifyContent: "space-around", padding: "0.75rem 0", zIndex: 100,
            }}>
                <Link href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", gap: "0.3rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, fontFamily: FM }}>HOME</span>
                </Link>
                <Link href="/shop" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", gap: "0.3rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, fontFamily: FM }}>SHOP</span>
                </Link>
                <Link href="/cart" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", gap: "0.3rem", position: "relative" }}>
                    <div style={{ position: "relative" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        <span style={{ position: "absolute", top: -5, right: -8, background: "#111", color: "#fff", fontSize: "0.6rem", fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FM }}>2</span>
                    </div>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, fontFamily: FM }}>CART</span>
                </Link>
                <Link href="/orders" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#C0A080", gap: "0.3rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, fontFamily: FM }}>ORDERS</span>
                </Link>
                <Link href="/account" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", gap: "0.3rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, fontFamily: FM }}>ACCOUNT</span>
                </Link>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .divider-desktop { display: block !important; }
                    .mobile-bottom-nav { display: none !important; }
                }
                .top-banner-scroll::-webkit-scrollbar { display: none; }
                .top-banner-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading...</p>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
