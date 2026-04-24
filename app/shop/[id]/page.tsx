"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";
import { optimizeImage } from "@/utils/cloudinary";

/* ── FONTS ── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── RESPONSIVE HOOK ── */
function useIsMobile(bp = 768) {
    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`);
        setMobile(mq.matches);
        const h = (e: MediaQueryListEvent) => setMobile(e.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, [bp]);
    return mobile;
}

/* ── DB PRODUCT TYPE ── */
interface DbProduct {
    id: string;
    title: string;
    subtitle: string;
    price: number;
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
}

/* ══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
    const { id } = useParams();

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    const isMobile = useIsMobile(768);

    /* ── Fetch product ── */
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) { setNotFound(true); return; }
                const json = await res.json();
                setDbProduct(json.product);
            } catch {
                setNotFound(true);
            } finally {
                setLoadingProduct(false);
            }
        })();
    }, [id]);

    /* ── Dynamic SEO ── */
    useEffect(() => {
        if (!dbProduct) return;
        document.title = `${dbProduct.title} – ${dbProduct.category} | SANRA LIVING`;
        const descMeta = document.querySelector('meta[name="description"]');
        const descText = `${dbProduct.title} – Premium ${dbProduct.finish} steel ${dbProduct.category.toLowerCase()} by SANRA LIVING. Contact us on WhatsApp for pricing.`;
        if (descMeta) descMeta.setAttribute("content", descText);
        else {
            const m = document.createElement("meta");
            m.name = "description"; m.content = descText;
            document.head.appendChild(m);
        }
    }, [dbProduct]);

    /* ── Build image array ── */
    const buildImages = (p: DbProduct): string[] => {
        if (p.images && p.images.length > 0) return p.images;
        const fallback: string[] = [];
        if (p.image_url) fallback.push(p.image_url);
        if (p.hover_image_url && p.hover_image_url !== p.image_url) fallback.push(p.hover_image_url);
        return fallback.length > 0 ? fallback : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85"];
    };

    const images = dbProduct ? buildImages(dbProduct) : [];

    /* ── WhatsApp handler ── */
    const handleWhatsApp = () => {
        const msg = encodeURIComponent(`Hi! I'm interested in the *${dbProduct?.title}*. Can you share the price and details?`);
        window.open(`https://wa.me/8300904920?text=${msg}`, "_blank");
    };

    /* ── Loading state ── */
    if (loadingProduct) {
        return (
            <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ width: 40, height: 40, border: "3px solid #E6E6E6", borderTopColor: "#1C1C1C", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem" }}>Loading product…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </main>
        );
    }

    /* ── Not Found state ── */
    if (notFound || !dbProduct) {
        return (
            <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "60vh", gap: "1rem" }}>
                    <p style={{ color: "#111", fontFamily: FO, fontSize: "1.1rem", fontWeight: 700 }}>Product Not Found</p>
                    <Link href="/shop" style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem", textDecoration: "underline" }}>Back to Products</Link>
                </div>
            </main>
        );
    }

    /* ── Product bullet points ── */
    const bulletPoints = [
        "✔ Jindal Pipe Steel",
        "✔ Strong Welding",
        "✔ Powder Coated Finish",
        "✔ Long Life – 10 Year Warranty",
        "✔ Bulk Available",
    ];

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── BREADCRUMB ── */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0.875rem 1.5rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", fontSize: "0.72rem", color: "#888", letterSpacing: "0.08em", fontFamily: FM, display: "flex", flexWrap: "wrap", gap: "0.25rem", alignItems: "center" }}>
                    <Link href="/" style={{ color: "#888", textDecoration: "none" }}>Home</Link>
                    <span style={{ margin: "0 0.35rem" }}>/</span>
                    <Link href="/shop" style={{ color: "#888", textDecoration: "none" }}>Products</Link>
                    <span style={{ margin: "0 0.35rem" }}>/</span>
                    <span style={{ color: "#555" }}>{dbProduct.category}</span>
                    <span style={{ margin: "0 0.35rem" }}>/</span>
                    <span style={{ color: "#111", fontWeight: 700 }}>{dbProduct.title}</span>
                </div>
            </div>

            {/* ── PRODUCT SECTION ── */}
            <section style={{ background: "#fff", padding: isMobile ? "2rem 1.25rem 3rem" : "3rem 1.5rem 4rem" }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: isMobile ? "2rem" : "4rem",
                    alignItems: "start",
                }}>

                    {/* ── LEFT: IMAGE GALLERY ── */}
                    <div>
                        {/* Main Image */}
                        <div style={{
                            width: "100%",
                            aspectRatio: "1/1",
                            overflow: "hidden",
                            background: "#E9E9E7",
                            marginBottom: "0.75rem",
                        }}>
                            <img
                                src={optimizeImage(images[selectedImage], 800)}
                                alt={dbProduct.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                {images.slice(0, 5).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        style={{
                                            width: 64, height: 64,
                                            border: selectedImage === i ? "2px solid #1C1C1C" : "1px solid #E6E6E6",
                                            background: "#E9E9E7",
                                            cursor: "pointer",
                                            padding: 0,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img src={optimizeImage(img, 100)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: PRODUCT INFO ── */}
                    <div>
                        {/* Category */}
                        <p style={{
                            fontSize: "0.68rem", fontWeight: 700,
                            letterSpacing: "0.2em", textTransform: "uppercase",
                            color: "#888", fontFamily: FM, marginBottom: "0.75rem",
                        }}>
                            {dbProduct.category}
                        </p>

                        {/* Title */}
                        <h1 style={{
                            fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                            fontWeight: 900, color: "#111",
                            letterSpacing: "-0.02em", lineHeight: 1.15,
                            fontFamily: FM, marginBottom: "0.5rem",
                        }}>
                            {dbProduct.title}
                        </h1>

                        {/* Subtitle */}
                        {dbProduct.subtitle && (
                            <p style={{
                                fontSize: "0.9rem", color: "#666",
                                fontFamily: FO, marginBottom: "1.5rem",
                            }}>
                                {dbProduct.subtitle}
                            </p>
                        )}

                        {/* Divider */}
                        <div style={{ height: 1, background: "#E6E6E6", marginBottom: "1.5rem" }} />

                        {/* Bullet Points */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
                            {bulletPoints.map((point) => (
                                <p key={point} style={{
                                    fontSize: "0.95rem", color: "#333",
                                    fontFamily: FO, fontWeight: 500,
                                    margin: 0, lineHeight: 1.5,
                                }}>
                                    {point}
                                </p>
                            ))}
                        </div>

                        {/* Finish */}
                        <div style={{ marginBottom: "2rem" }}>
                            <p style={{
                                fontSize: "0.72rem", fontWeight: 700,
                                letterSpacing: "0.15em", textTransform: "uppercase",
                                color: "#888", fontFamily: FM, marginBottom: "0.5rem",
                            }}>
                                Finish
                            </p>
                            <span style={{
                                display: "inline-block",
                                padding: "0.5rem 1rem",
                                background: "#F5F5F5",
                                border: "1px solid #E6E6E6",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "#333",
                                fontFamily: FO,
                            }}>
                                {dbProduct.finish}
                            </span>
                        </div>

                        {/* WhatsApp CTA Button */}
                        <button
                            onClick={handleWhatsApp}
                            style={{
                                width: "100%",
                                padding: "1.125rem",
                                background: "#25D366",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontFamily: FM,
                                border: "none",
                                cursor: "pointer",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.625rem",
                                transition: "background 0.2s, transform 0.2s",
                                marginBottom: "1rem",
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Get Price on WhatsApp
                        </button>

                        {/* Contact note */}
                        <p style={{
                            fontSize: "0.78rem", color: "#999",
                            fontFamily: FO, textAlign: "center",
                        }}>
                            📞 Or call: 9585745303 / 8300904920
                        </p>
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section style={{ background: "#1C1C1C", padding: isMobile ? "3.5rem 1.25rem" : "5rem 1.5rem", textAlign: "center" }}>
                <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontFamily: FM }}>Built to Last 10 Years</p>
                    <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em", fontFamily: FM }}>
                        Interested in This Product?
                    </h2>
                    <button
                        onClick={handleWhatsApp}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.9rem 2.5rem",
                            background: "#25D366", color: "#fff",
                            fontWeight: 700, fontSize: "0.82rem",
                            letterSpacing: "0.12em", textTransform: "uppercase",
                            fontFamily: FM, border: "none", cursor: "pointer",
                            borderRadius: 4,
                        }}
                    >
                        💬 Get Price on WhatsApp
                    </button>
                </div>
            </section>

            <SiteFooter />
            <WhatsAppFloat />

            {/* ── MOBILE STICKY BAR ── */}
            {isMobile && (
                <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #E6E6E6", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", zIndex: 50 }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.78rem", color: "#111", fontFamily: FM, fontWeight: 700 }}>{dbProduct.title}</p>
                    </div>
                    <button onClick={handleWhatsApp} style={{
                        flex: 2, padding: "0.875rem",
                        background: "#25D366", color: "#fff",
                        fontWeight: 700, fontSize: "0.82rem",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        border: "none", cursor: "pointer", fontFamily: FM,
                        borderRadius: 4,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    }}>
                        💬 WhatsApp
                    </button>
                </div>
            )}
            {isMobile && <div style={{ height: 72 }} />}
        </main>
    );
}
