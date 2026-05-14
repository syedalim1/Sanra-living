"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SiteFooter from "@/app/components/SiteFooter";
import { optimizeImage } from "@/utils/cloudinary";
import { useCart } from "@/app/context/CartContext";

/* ── FONTS ── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── DB PRODUCT TYPE ── */
interface DbProduct {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    compare_at_price?: number | null;
    category: string;
    product_type?: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    lifestyle_image?: string;
    mobile_thumbnail?: string;
    images?: string[];
    description?: string;
    is_new: boolean;
    is_active: boolean;
    tags?: string[];
    highlights?: string[];
    trust_features?: string[];
    badge?: string;
    material?: string;
    pipe_type?: string;
    color?: string;
    dimensions?: string;
    weight_kg?: number;
    warranty?: string;
    delivery_info?: string;
    whatsapp_link?: string;
    faqs?: { question: string; answer: string }[];
    related_products?: string;
}

const WHATSAPP_NUMBER = "8300904920";

/* ── ACCORDION ── */
function Accordion({ title, children, open = false }: { title: string, children: React.ReactNode, open?: boolean }) {
    const [isOpen, setIsOpen] = useState(open);
    return (
        <div style={{ borderBottom: "1px solid #EAEAEA", padding: "1.2rem 0" }}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
                <span style={{ fontWeight: 600, fontFamily: FM, fontSize: "0.95rem", color: "#111", letterSpacing: "0.02em" }}>{title}</span>
                <span style={{ fontSize: "1.2rem", color: "#111", transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s ease", fontWeight: 300 }}>+</span>
            </button>
            {isOpen && (
                <div style={{ marginTop: "1rem", color: "#555", fontSize: "0.9rem", fontFamily: FO, lineHeight: 1.6 }}>
                    {children}
                </div>
            )}
        </div>
    );
}

/* ── MINIMAL STICKY HEADER ── */
function MinimalHeader({ cartCount }: { cartCount: number }) {
    return (
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,0,0,0.05)", padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Link href="/" style={{ color: "#111" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></Link>
            </div>
            <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 900, fontFamily: FM, color: "#111", textDecoration: "none", letterSpacing: "0.05em" }}>SANRA</Link>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <Link href="/cart" style={{ position: "relative", color: "#111" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    {cartCount > 0 && <span style={{ position: "absolute", top: -8, right: -8, background: "#111", color: "#fff", fontSize: "0.6rem", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cartCount}</span>}
                </Link>
            </div>
        </header>
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
    const { totalItems, dispatch } = useCart();
    const cartCount = totalItems;

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) { if (!cancelled) setNotFound(true); return; }
                const json = await res.json();
                if (!cancelled) {
                    if (json.product?.is_active === false) setNotFound(true);
                    else setDbProduct(json.product);
                }
            } catch {
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
                <div style={{ width: 32, height: 32, border: "2px solid #EAEAEA", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }
    if (notFound || !dbProduct) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FFFFFF", fontFamily: FO }}>
                <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "#111" }}>Product Not Found</p>
                <Link href="/" style={{ marginTop: "1rem", color: "#666", textDecoration: "underline" }}>Back to Home</Link>
            </div>
        );
    }

    const images = [
        dbProduct.image_url,
        dbProduct.hover_image_url,
        dbProduct.lifestyle_image,
        dbProduct.mobile_thumbnail,
        ...(dbProduct.images || [])
    ].filter(Boolean) as string[];

    if (images.length === 0) images.push("/images/sanra_stool.png");

    const trustFeatures = dbProduct.trust_features?.length ? dbProduct.trust_features : [
        "Jindal Steel", "3 Year Warranty", "Rust Resistant", "Pan India Delivery"
    ];

    const highlights = dbProduct.highlights?.length ? dbProduct.highlights : [
        "Premium Materials", "Expert Craftsmanship", "Long Lasting", "Sustainable Design"
    ];

    const handleAddToCart = () => {
        dispatch({ type: "ADD", payload: {
            id: dbProduct.id, title: dbProduct.title, finish: dbProduct.finish || "",
            price: dbProduct.price, image: dbProduct.image_url, qty: quantity, stockQty: dbProduct.stock_qty
        } });
    };

    const handleWhatsApp = () => {
        const link = dbProduct.whatsapp_link;
        if (link && link.includes("wa.me")) {
            window.open(link, "_blank");
            return;
        }
        const msg = `Hi, I want to buy:\n${dbProduct.title}\nPrice: ₹${dbProduct.price}\nLink: ${window.location.href}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const index = Math.round(scrollLeft / width);
        setActiveImg(index);
    };

    return (
        <main style={{ background: "#FFFFFF", minHeight: "100vh", fontFamily: FO }}>
            <MinimalHeader cartCount={cartCount} />

            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", paddingBottom: "4rem" }}>
                    
                    {/* 2. PRODUCT IMAGE SECTION (Mobile First) */}
                    <section style={{ width: "100%", background: "#F9F9F9", position: "relative" }}>
                        {/* Swipe Gallery */}
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", width: "100%", aspectRatio: "4/5" }}
                        >
                            {images.map((img, idx) => (
                                <div key={idx} style={{ flex: "0 0 100%", width: "100%", scrollSnapAlign: "start", position: "relative" }}>
                                    <img src={optimizeImage(img, 800)} alt={dbProduct.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    {/* Watermark Overlay */}
                                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.04, zIndex: 10 }}>
                                        <span style={{ fontSize: "15vw", fontWeight: 900, fontFamily: FM, transform: "rotate(-30deg)", color: "#000", whiteSpace: "nowrap" }}>SANRA LIVING</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Dots */}
                        {images.length > 1 && (
                            <div style={{ position: "absolute", bottom: "1.5rem", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "6px", zIndex: 20 }}>
                                {images.map((_, idx) => (
                                    <div key={idx} style={{ width: activeImg === idx ? 20 : 6, height: 6, borderRadius: 3, background: activeImg === idx ? "#111" : "rgba(0,0,0,0.2)", transition: "all 0.3s ease" }} />
                                ))}
                            </div>
                        )}
                    </section>

                    <div style={{ padding: "1.5rem 1.25rem" }}>
                        
                        {/* 3. PRODUCT TITLE AREA */}
                        <section style={{ marginBottom: "2rem" }}>
                            {dbProduct.badge && (
                                <span style={{ display: "inline-block", background: "#F5F5F5", color: "#111", padding: "0.25rem 0.75rem", fontSize: "0.7rem", fontWeight: 800, fontFamily: FM, letterSpacing: "0.05em", borderRadius: "4px", marginBottom: "0.75rem" }}>
                                    {dbProduct.badge.toUpperCase()}
                                </span>
                            )}
                            <h1 style={{ fontSize: "1.75rem", fontWeight: 500, fontFamily: FM, color: "#111", margin: "0 0 0.25rem", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                                {dbProduct.title}
                            </h1>
                            {dbProduct.subtitle && (
                                <p style={{ fontSize: "0.95rem", color: "#666", margin: "0 0 1rem", fontFamily: FO, lineHeight: 1.4 }}>
                                    {dbProduct.subtitle}
                                </p>
                            )}
                            
                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginTop: "1rem" }}>
                                <span style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: FM, color: "#111" }}>₹{dbProduct.price.toLocaleString("en-IN")}</span>
                                {dbProduct.compare_at_price && (
                                    <span style={{ fontSize: "1rem", color: "#999", textDecoration: "line-through", fontFamily: FO }}>₹{dbProduct.compare_at_price.toLocaleString("en-IN")}</span>
                                )}
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "#999", margin: "0.25rem 0 0", fontFamily: FO }}>Inclusive of all taxes</p>
                        </section>

                        {/* 4. QUICK TRUST ICONS */}
                        <section style={{ display: "flex", justifyContent: "space-between", padding: "1.5rem 0", borderTop: "1px solid #EAEAEA", borderBottom: "1px solid #EAEAEA", marginBottom: "2rem" }}>
                            {trustFeatures.slice(0, 4).map((feat, i) => (
                                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F9F9F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"></path></svg>
                                    </div>
                                    <span style={{ fontSize: "0.65rem", fontFamily: FM, fontWeight: 600, color: "#555", textAlign: "center", lineHeight: 1.2 }}>{feat}</span>
                                </div>
                            ))}
                        </section>

                        {/* 5. QUANTITY + BUY SECTION */}
                        <section style={{ marginBottom: "2rem" }}>
                            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                                {/* Quantity selector */}
                                <div style={{ display: "flex", alignItems: "center", border: "1px solid #EAEAEA", borderRadius: "8px", background: "#F9F9F9", padding: "0.25rem", width: "120px" }}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ flex: 1, height: "44px", background: "none", border: "none", fontSize: "1.2rem", color: "#111" }}>−</button>
                                    <span style={{ flex: 1, textAlign: "center", fontSize: "1rem", fontWeight: 600, fontFamily: FO }}>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} style={{ flex: 1, height: "44px", background: "none", border: "none", fontSize: "1.2rem", color: "#111" }}>+</button>
                                </div>
                                {/* Add to cart */}
                                <button onClick={handleAddToCart} style={{ flex: 1, height: "56px", background: "#111", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, fontFamily: FM, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer" }}>
                                    Add to Cart
                                </button>
                            </div>
                            
                            {/* Buy on WhatsApp */}
                            <button onClick={handleWhatsApp} style={{ width: "100%", height: "56px", background: "#25D366", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, fontFamily: FM, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Buy On WhatsApp
                            </button>

                            {/* 6. TRUST MESSAGE */}
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginTop: "1.25rem" }}>
                                <span style={{ fontSize: "0.75rem", color: "#666", fontFamily: FO, display: "flex", alignItems: "center", gap: "0.25rem" }}>🔒 Secure Checkout</span>
                                <span style={{ color: "#D1D5DB" }}>•</span>
                                <span style={{ fontSize: "0.75rem", color: "#666", fontFamily: FO, display: "flex", alignItems: "center", gap: "0.25rem" }}>🚚 Fast Delivery</span>
                                <span style={{ color: "#D1D5DB" }}>•</span>
                                <span style={{ fontSize: "0.75rem", color: "#666", fontFamily: FO, display: "flex", alignItems: "center", gap: "0.25rem" }}>↩ Easy Returns</span>
                            </div>
                        </section>

                        {/* 7. PREMIUM FEATURE GRID */}
                        <section style={{ margin: "3rem 0" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                {highlights.slice(0, 4).map((highlight, i) => (
                                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        <div style={{ width: 40, height: 40, background: "#F9F9F9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: "0.85rem", fontWeight: 700, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>{highlight}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 8. ACCORDION INFORMATION SECTION */}
                        <section style={{ marginBottom: "3rem", borderTop: "1px solid #EAEAEA" }}>
                            <Accordion title="Materials & Finish" open>
                                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                                    {dbProduct.material && <li style={{ marginBottom: "0.5rem" }}>Material: {dbProduct.material}</li>}
                                    {dbProduct.pipe_type && <li style={{ marginBottom: "0.5rem" }}>Structure: {dbProduct.pipe_type}</li>}
                                    {dbProduct.finish && <li style={{ marginBottom: "0.5rem" }}>Finish: {dbProduct.finish}</li>}
                                    {dbProduct.color && <li style={{ marginBottom: "0.5rem" }}>Color: {dbProduct.color}</li>}
                                    {!dbProduct.material && !dbProduct.finish && <li>Premium stainless steel with expert powder coating.</li>}
                                </ul>
                            </Accordion>
                            
                            <Accordion title="Dimensions">
                                {dbProduct.dimensions ? (
                                    <p style={{ margin: 0 }}>{dbProduct.dimensions}</p>
                                ) : (
                                    <p style={{ margin: 0 }}>Please check product images for detailed dimensions.</p>
                                )}
                                {dbProduct.weight_kg && <p style={{ margin: "0.5rem 0 0" }}>Weight Capacity: {dbProduct.weight_kg}kg</p>}
                            </Accordion>
                            
                            <Accordion title="Delivery & Installation">
                                <p style={{ margin: 0 }}>{dbProduct.delivery_info || "Pan India delivery available within 5-7 business days. No complex installation required."}</p>
                            </Accordion>
                            
                            <Accordion title="Warranty">
                                <p style={{ margin: 0 }}>{dbProduct.warranty || "Standard 3 Year structural warranty included."}</p>
                            </Accordion>
                            
                            <Accordion title="Care Instructions">
                                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                                    <li style={{ marginBottom: "0.5rem" }}>Wipe clean with a damp cloth.</li>
                                    <li style={{ marginBottom: "0.5rem" }}>Avoid using harsh chemicals or abrasives.</li>
                                </ul>
                            </Accordion>
                        </section>

                        {/* 9. RELATED PRODUCTS */}
                        <section style={{ marginBottom: "2rem" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 1.5rem" }}>Related Products</h2>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                {/* Example related product block */}
                                <Link href="/shop" style={{ textDecoration: "none" }}>
                                    <div style={{ background: "#F9F9F9", borderRadius: "8px", aspectRatio: "1/1", marginBottom: "0.75rem", overflow: "hidden" }}>
                                        <img src="/images/sanra_stool.png" alt="Related" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>SANRA Stool</p>
                                    <p style={{ fontSize: "0.85rem", color: "#666", fontFamily: FO, margin: 0 }}>₹1,299</p>
                                </Link>
                                <Link href="/shop" style={{ textDecoration: "none" }}>
                                    <div style={{ background: "#F9F9F9", borderRadius: "8px", aspectRatio: "1/1", marginBottom: "0.75rem", overflow: "hidden" }}>
                                        <img src="/images/sanra_chair.png" alt="Related" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: "0 0 0.25rem" }}>Lounge Chair</p>
                                    <p style={{ fontSize: "0.85rem", color: "#666", fontFamily: FO, margin: 0 }}>₹4,999</p>
                                </Link>
                            </div>
                        </section>

                        {/* 10. SOCIAL PROOF */}
                        <section style={{ padding: "3rem 0", borderTop: "1px solid #EAEAEA", textAlign: "center" }}>
                            <p style={{ fontSize: "1rem", fontWeight: 600, fontFamily: FM, color: "#111", margin: 0 }}>Trusted by 10,000+ customers<br/>across India.</p>
                        </section>

                    </div>
                </div>
            </div>
            
            <SiteFooter />
            
            <style>{`
                ::-webkit-scrollbar { width: 0; background: transparent; }
            `}</style>
        </main>
    );
}
