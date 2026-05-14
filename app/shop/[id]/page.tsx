"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import { optimizeImage } from "@/utils/cloudinary";
import { useCart } from "@/app/context/CartContext";

/* ── FONTS ── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── RESPONSIVE HOOK ── */
function useIsMobile(bp = 768) {
    const [mobile, setMobile] = useState<boolean | null>(null);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`);
        setMobile(mq.matches);
        const h = (e: MediaQueryListEvent) => setMobile(e.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, [bp]);
    return mobile ?? false; 
}

/* ── DB PRODUCT TYPE ── */
interface DbProduct {
    id: string;
    title: string;
    price: number;
    compare_at_price?: number | null;
    category: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    images?: string[];
    video_url?: string;
    video_thumbnail?: string;
    description?: string;
    is_new: boolean;
    is_active: boolean;
    tags?: string[];
    highlights?: string[];
}

/* ── TOAST ── */
interface ToastState {
    message: string;
    type: "success" | "error";
}

const WHATSAPP_NUMBER = "8300904920";

/* ── Accordion Component ── */
function AccordionItem({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div style={{ borderBottom: "1px solid #EAEAEA", padding: "1.25rem 0" }}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {title === "Materials & Finish" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M12 2l9 4-9 4-9-4 9-4z"></path><path d="M12 10l9 4-9 4-9-4 9-4z"></path><path d="M12 18l9 4-9 4-9-4 9-4z"></path></svg>}
                    {title === "Dimensions" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><rect x="3" y="8" width="18" height="8" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line></svg>}
                    {title === "Delivery & Installation" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>}
                    {title === "Warranty" && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>}
                    <span style={{ fontWeight: 800, fontFamily: FM, fontSize: "0.95rem", color: "#111" }}>{title}</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            {isOpen && (
                <div style={{ marginTop: "1rem", color: "#444", fontSize: "0.9rem", fontFamily: FO, lineHeight: 1.6, paddingLeft: "2.5rem" }}>
                    {children}
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
    const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const router = useRouter();
    const { dispatch } = useCart();

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [quantity, setQuantity] = useState(1);

    const isMobile = useIsMobile(768);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(t);
    }, [toast]);

    useEffect(() => {
        const handler = () => setShowStickyBar(window.scrollY > 600);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) {
                    if (!cancelled) setNotFound(true);
                    return;
                }
                const json = await res.json();
                if (!cancelled) {
                    if (json.product?.is_active === false) {
                        setNotFound(true);
                    } else {
                        setDbProduct(json.product);
                    }
                }
            } catch {
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoadingProduct(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    useEffect(() => {
        setSelectedImage(0);
        setQuantity(1);
    }, [dbProduct?.id]);

    const buildImages = useCallback((p: DbProduct): string[] => {
        if (p.images && p.images.length > 0) return p.images;
        const fallback: string[] = [];
        if (p.image_url) fallback.push(p.image_url);
        if (p.hover_image_url && p.hover_image_url !== p.image_url) fallback.push(p.hover_image_url);
        return fallback.length > 0 ? fallback : ["/images/sanra_stool.png", "/images/sanra_stool.png", "/images/sanra_stool.png"];
    }, []);

    const images = dbProduct ? buildImages(dbProduct) : [];
    const safeIndex = Math.min(selectedImage, Math.max(0, images.length - 1));

    const handleWhatsApp = useCallback(() => {
        if (!dbProduct) return;
        const currentUrl = window.location.href;
        const formattedPrice = dbProduct.price ? dbProduct.price.toLocaleString("en-IN") : "N/A";
        const message = `Hi, I'm interested in this product:\n\nProduct: ${dbProduct.title}\nPrice: ₹${formattedPrice}\nLink: ${currentUrl}\n\nPlease share more details.`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    }, [dbProduct]);

    const buildCartPayload = useCallback(() => {
        if (!dbProduct) return null;
        return {
            id: dbProduct.id,
            title: dbProduct.title,
            finish: dbProduct.finish,
            price: dbProduct.price ?? 0,
            image: dbProduct.image_url,
            qty: quantity,
            stockQty: dbProduct.stock_qty ?? 10,
        };
    }, [dbProduct, quantity]);

    const handleAddToCart = useCallback(() => {
        const payload = buildCartPayload();
        if (!payload) return;
        dispatch({ type: "ADD", payload });
        setToast({ message: "Added to cart!", type: "success" });
    }, [buildCartPayload, dispatch]);

    const handleBuyNow = useCallback(() => {
        const payload = buildCartPayload();
        if (!payload) return;
        dispatch({ type: "ADD", payload });
        router.push("/cart");
    }, [buildCartPayload, dispatch, router]);

    if (loadingProduct) {
        return (
            <main style={{ background: "#FAFAFA", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid #E6E6E6", borderTopColor: "#1C1C1C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem" }}>Loading product…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </main>
        );
    }

    if (notFound || !dbProduct) {
        return (
            <main style={{ background: "#FAFAFA", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "60vh", gap: "1rem" }}>
                    <p style={{ color: "#111", fontFamily: FO, fontSize: "1.1rem", fontWeight: 700 }}>Product Not Found</p>
                    <Link href="/shop" style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem", textDecoration: "underline" }}>Back to Products</Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ background: "#FAFAFA", minHeight: "100vh", fontFamily: FO, paddingBottom: showStickyBar ? "80px" : 0 }}>
            {/* Top Bar matching image */}
            <div className="top-banner-scroll" style={{ background: "#0A0A0A", color: "#F59E0B", padding: "0.6rem 1rem", fontSize: "0.75rem", fontFamily: FM, display: "flex", overflowX: "auto", whiteSpace: "nowrap", gap: "2rem", justifyContent: "center", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Jindal Steel</span><span style={{ color: "#333" }}>|</span><span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>3 Year Warranty</span><span style={{ color: "#333" }}>|</span><span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>Made in Coimbatore</span><span style={{ color: "#333" }}>|</span><span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>Pan India Delivery</span>
            </div>

            <SiteHeader />

            {/* TOAST NOTIFICATION */}
            {toast && (
                <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: toast.type === "success" ? "#111" : "#DC2626", color: "#fff", padding: "0.75rem 1.75rem", borderRadius: 6, fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, letterSpacing: "0.06em", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", animation: "toastIn 0.2s ease", whiteSpace: "nowrap" }}>
                    {toast.type === "success" ? "✓ " : "✕ "}{toast.message}
                </div>
            )}

            {/* BREADCRUMB */}
            <div style={{ background: "#FAFAFA", borderBottom: "1px solid #EAEAEA", padding: "1rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: "0.75rem", color: "#666", fontFamily: FO, display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                    <Link href="/" style={{ color: "#666", textDecoration: "none" }}>Home</Link>
                    <span>&gt;</span>
                    <Link href="/shop" style={{ color: "#666", textDecoration: "none" }}>{dbProduct.category}</Link>
                    <span>&gt;</span>
                    <span style={{ color: "#111" }}>{dbProduct.title}</span>
                </div>
            </div>

            {/* PRODUCT SECTION */}
            <section style={{ background: "#FAFAFA", padding: isMobile ? "2rem 0" : "5rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: isMobile ? "3rem" : "5rem", alignItems: "start" }}>

                    {/* LEFT: IMAGE GALLERY */}
                    <div style={{ padding: isMobile ? "0 1rem" : 0 }}>
                        {/* Main Image */}
                        <div style={{ width: "100%", aspectRatio: "4/5", background: "#F2F2F2", borderRadius: "12px", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
                            {/* Bestseller Badge */}
                            <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", background: "#111", color: "#fff", padding: "0.4rem 1rem", fontSize: "0.75rem", fontWeight: 700, fontFamily: FO, borderRadius: "4px", zIndex: 1, letterSpacing: "0.05em" }}>BESTSELLER</div>
                            
                            {/* Heart Icon */}
                            <button style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "#fff", border: "none", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", zIndex: 1 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </button>

                            <img src={optimizeImage(images[safeIndex], 1000)} alt={dbProduct.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
                            {images.slice(0, 5).map((img, i) => (
                                <button key={i} onClick={() => setSelectedImage(i)} style={{ aspectRatio: "1/1", border: safeIndex === i ? "1px solid #111" : "1px solid #EAEAEA", background: "#F2F2F2", cursor: "pointer", padding: 0, overflow: "hidden", borderRadius: "8px", position: "relative", transition: "all 0.2s" }}>
                                    <img src={optimizeImage(img, 200)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    {i === 4 && images.length > 4 && (
                                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO */}
                    <div style={{ paddingTop: isMobile ? 0 : "2rem", padding: isMobile ? "0 1.25rem" : 0 }}>
                        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.5rem)", fontWeight: 500, color: "#111", fontFamily: FM, marginBottom: "0.25rem", lineHeight: 1.1 }}>
                            {dbProduct.title}
                        </h1>
                        <p style={{ fontSize: "1.1rem", color: "#666", fontFamily: FO, marginBottom: "1.5rem", fontWeight: 400 }}>
                            Premium {dbProduct.category} Collection
                        </p>

                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#111", fontFamily: FM, margin: 0 }}>
                                ₹{dbProduct.price?.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "#999", fontFamily: FO, marginBottom: "2.5rem", fontWeight: 400 }}>Inclusive of all taxes</p>

                        {/* Feature Icons Row */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "3rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span style={{ fontSize: "0.7rem", fontFamily: FM, fontWeight: 500, textAlign: "center", color: "#555" }}>Jindal Steel</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span style={{ fontSize: "0.7rem", fontFamily: FM, fontWeight: 500, textAlign: "center", color: "#555" }}>3 Year<br/>Warranty</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                                <span style={{ fontSize: "0.7rem", fontFamily: FM, fontWeight: 500, textAlign: "center", color: "#555" }}>Rust<br/>Resistant</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                <span style={{ fontSize: "0.7rem", fontFamily: FM, fontWeight: 500, textAlign: "center", color: "#555" }}>Pan India<br/>Delivery</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <p style={{ fontSize: "0.75rem", fontWeight: 800, fontFamily: FM, color: "#111", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>QUANTITY</p>
                            <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #EAEAEA", borderRadius: "4px", padding: "0.25rem", background: "#fff" }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "36px", height: "36px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                <span style={{ width: "40px", textAlign: "center", fontSize: "1rem", fontWeight: 700, fontFamily: FO, color: "#111" }}>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} style={{ width: "36px", height: "36px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                            <button onClick={handleAddToCart} disabled={dbProduct.stock_qty === 0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", width: "100%", padding: "1.1rem", background: dbProduct.stock_qty === 0 ? "#ccc" : "#0A0A0A", color: "#fff", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", borderRadius: "6px", cursor: dbProduct.stock_qty === 0 ? "not-allowed" : "pointer", fontFamily: FM, transition: "background 0.2s ease" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                {dbProduct.stock_qty === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                            </button>
                            <button onClick={handleWhatsApp} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", width: "100%", padding: "1.1rem", background: "#3A7D50", color: "#fff", fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: FM, transition: "background 0.2s ease" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                BUY ON WHATSAPP
                            </button>
                        </div>

                        {/* Secure Checkout Trust */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#111" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                            <span style={{ fontSize: "0.9rem", fontWeight: 700, fontFamily: FO }}>Secure Checkout • Easy Returns</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES HIGHLIGHTS BANNER */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 1.5rem 4rem" }}>
                <div style={{ border: "1px solid #EAEAEA", borderRadius: "12px", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", padding: isMobile ? "2rem 1.5rem" : "3rem", gap: "2.5rem", background: "#fff" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: isMobile ? "center" : "flex-start", textAlign: isMobile ? "center" : "left" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <div>
                            <p style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: "0 0 0.5rem" }}>Premium Materials</p>
                            <p style={{ fontSize: "0.8rem", fontFamily: FO, color: "#666", margin: 0, lineHeight: 1.5 }}>High quality steel built to last.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: isMobile ? "center" : "flex-start", textAlign: isMobile ? "center" : "left" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                        <div>
                            <p style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: "0 0 0.5rem" }}>Expertly Crafted</p>
                            <p style={{ fontSize: "0.8rem", fontFamily: FO, color: "#666", margin: 0, lineHeight: 1.5 }}>Precision engineered finish.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: isMobile ? "center" : "flex-start", textAlign: isMobile ? "center" : "left" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <div>
                            <p style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: "0 0 0.5rem" }}>Long Lasting</p>
                            <p style={{ fontSize: "0.8rem", fontFamily: FO, color: "#666", margin: 0, lineHeight: 1.5 }}>Designed for years of use.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: isMobile ? "center" : "flex-start", textAlign: isMobile ? "center" : "left" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
                        <div>
                            <p style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: "0 0 0.5rem" }}>Sustainable</p>
                            <p style={{ fontSize: "0.8rem", fontFamily: FO, color: "#666", margin: 0, lineHeight: 1.5 }}>Eco conscious production.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACCORDION SECTION */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 5rem" }}>
                <div style={{ border: "1px solid #EAEAEA", borderRadius: "12px", background: "#fff", padding: isMobile ? "1.5rem" : "2rem 3rem" }}>
                    
                    <AccordionItem title="Materials & Finish" defaultOpen>
                        <p style={{ margin: 0 }}>Premium stainless steel frame with natural wooden top and matte powder coating.</p>
                    </AccordionItem>
                    
                    <AccordionItem title="Dimensions">
                        <p style={{ margin: 0 }}>Height: 45 cm • Diameter: 35 cm</p>
                    </AccordionItem>
                    
                    <AccordionItem title="Delivery & Installation">
                        <p style={{ margin: 0 }}>Delivery within 5-7 business days. No installation required.</p>
                    </AccordionItem>
                    
                    <AccordionItem title="Warranty">
                        <p style={{ margin: 0 }}>3 Year warranty on frame. 1 Year on wooden top.</p>
                    </AccordionItem>
                    
                </div>
            </section>

            {/* YOU MAY ALSO LIKE */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem 1.5rem 6rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: 0, letterSpacing: "-0.02em" }}>You May Also Like</h2>
                    <Link href="/shop" style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, color: "#111", textDecoration: "underline", textUnderlineOffset: "4px" }}>View All</Link>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "1.5rem" }}>
                    {/* Item 1 */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ background: "#F2F2F2", borderRadius: "12px", aspectRatio: "1/1", position: "relative", marginBottom: "1.25rem", overflow: "hidden" }}>
                            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "#fff", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
                            <img src="/images/sanra_stool.png" alt="SANRA Round Stool" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>SANRA Round Stool</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: FO, color: "#555", margin: 0 }}>₹1,299</p>
                    </div>
                    {/* Item 2 */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ background: "#F2F2F2", borderRadius: "12px", aspectRatio: "1/1", position: "relative", marginBottom: "1.25rem", overflow: "hidden" }}>
                            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "#fff", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
                            <img src="/images/sanra_chair.png" alt="Dining Chair" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>Dining Chair</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: FO, color: "#555", margin: 0 }}>₹1,300</p>
                    </div>
                    {/* Item 3 */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ background: "#F2F2F2", borderRadius: "12px", aspectRatio: "1/1", position: "relative", marginBottom: "1.25rem", overflow: "hidden" }}>
                            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "#fff", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
                            <img src="/images/sanra_chair.png" alt="SANRA Bench" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>SANRA Bench</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: FO, color: "#555", margin: 0 }}>₹4,999</p>
                    </div>
                    {/* Item 4 */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ background: "#F2F2F2", borderRadius: "12px", aspectRatio: "1/1", position: "relative", marginBottom: "1.25rem", overflow: "hidden" }}>
                            <button style={{ position: "absolute", top: "1rem", right: "1rem", background: "#fff", border: "none", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button>
                            <img src="/images/sanra_stool.png" alt="Lounge Chair" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>SANRA Lounge</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: FO, color: "#555", margin: 0 }}>₹6,999</p>
                    </div>
                </div>
            </section>

            {/* DARK TRUST BANNER */}
            <section style={{ maxWidth: 1200, margin: "0 auto 4rem", padding: "0 1.5rem" }}>
                <div style={{ background: "#111", borderRadius: "12px", padding: isMobile ? "2rem" : "2.5rem 2rem", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: "2rem" }}>
                    <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8A17D" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
                        <div>
                            <p style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 800, fontFamily: FM, margin: "0 0 0.25rem" }}>Safe Payments</p>
                            <p style={{ color: "#aaa", fontSize: "0.75rem", fontFamily: FO, margin: 0, lineHeight: 1.4 }}>100% secure<br/>checkout.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8A17D" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <div>
                            <p style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 800, fontFamily: FM, margin: "0 0 0.25rem" }}>Premium Packaging</p>
                            <p style={{ color: "#aaa", fontSize: "0.75rem", fontFamily: FO, margin: 0, lineHeight: 1.4 }}>Safe & damage<br/>free delivery.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8A17D" strokeWidth="1.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path></svg>
                        <div>
                            <p style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 800, fontFamily: FM, margin: "0 0 0.25rem" }}>Easy Returns</p>
                            <p style={{ color: "#aaa", fontSize: "0.75rem", fontFamily: FO, margin: 0, lineHeight: 1.4 }}>Hassle free returns<br/>within 7 days.</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8A17D" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <div>
                            <p style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 800, fontFamily: FM, margin: "0 0 0.25rem" }}>Dedicated Support</p>
                            <p style={{ color: "#aaa", fontSize: "0.75rem", fontFamily: FO, margin: 0, lineHeight: 1.4 }}>We're here to help<br/>you anytime.</p>
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
            
            {/* STICKY ADD TO CART BAR */}
            {showStickyBar && (
                <div style={{
                    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "#fff",
                    borderTop: "1px solid #EAEAEA", boxShadow: "0 -8px 24px rgba(0,0,0,0.06)",
                    padding: isMobile ? "0.75rem 1rem" : "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between",
                    animation: "stickySlideUp 0.25s ease",
                }}>
                    <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                        
                        {/* Product Info - Hidden on Mobile to make room for full width buttons */}
                        {!isMobile && (
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                                <div style={{ width: 48, height: 48, borderRadius: "6px", overflow: "hidden", border: "1px solid #EAEAEA", background: "#F5F5F5", flexShrink: 0 }}>
                                    <img src={optimizeImage(images[safeIndex], 100)} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <p style={{ fontSize: "0.95rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                                        {dbProduct.title}
                                    </p>
                                    <p style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: FO, color: "#555", margin: 0 }}>
                                        ₹{dbProduct.price?.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: isMobile ? "100%" : "auto" }}>
                            <button onClick={handleAddToCart} disabled={dbProduct.stock_qty === 0} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: isMobile ? "0.85rem 0.5rem" : "0.85rem 1.5rem", background: dbProduct.stock_qty === 0 ? "#ccc" : "#111", color: "#fff", fontWeight: 600, fontSize: isMobile ? "0.75rem" : "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", borderRadius: "6px", cursor: dbProduct.stock_qty === 0 ? "not-allowed" : "pointer", fontFamily: FM, whiteSpace: "nowrap" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                {dbProduct.stock_qty === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                            </button>
                            <button onClick={handleWhatsApp} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: isMobile ? "0.85rem 0.5rem" : "0.85rem 1.5rem", background: "#3A7D50", color: "#fff", fontWeight: 600, fontSize: isMobile ? "0.75rem" : "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: FM, whiteSpace: "nowrap" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                WHATSAPP
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes stickySlideUp {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
                @keyframes toastIn {
                    from { opacity: 0; transform: translate(-50%, -12px); }
                    to   { opacity: 1; transform: translate(-50%, 0); }
                }
                .top-banner-scroll::-webkit-scrollbar { display: none; }
                .top-banner-scroll { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
