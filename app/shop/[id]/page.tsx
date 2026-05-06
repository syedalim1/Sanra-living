"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";
import WhatsAppFloat from "@/app/components/WhatsAppFloat";
import { optimizeImage } from "@/utils/cloudinary";
import { useCart } from "@/app/context/CartContext";

/* ── FONTS ── */
const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── RESPONSIVE HOOK ── */
// FIX: initial null prevents SSR hydration mismatch
function useIsMobile(bp = 768) {
    const [mobile, setMobile] = useState<boolean | null>(null);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${bp}px)`);
        setMobile(mq.matches);
        const h = (e: MediaQueryListEvent) => setMobile(e.matches);
        mq.addEventListener("change", h);
        return () => mq.removeEventListener("change", h);
    }, [bp]);
    return mobile ?? false; // SSR → false (desktop layout)
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
// FIX: Replace alert() with proper inline toast
interface ToastState {
    message: string;
    type: "success" | "error";
}

const DEFAULT_BULLETS = [
    "Strong Steel Frame",
    "High Load Capacity",
    "Rust Resistant",
    "Comfortable Seating",
    "Low Maintenance",
];

const WHATSAPP_NUMBER = "8300904920";

/* ══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
    // FIX: useParams can return string | string[] — always normalise to string
    const params = useParams();
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    const router = useRouter();
    const { dispatch } = useCart();

    const [dbProduct, setDbProduct] = useState<DbProduct | null>(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [zoomStyle, setZoomStyle] = useState({
        transformOrigin: "center center",
        transform: "scale(1)",
    });
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [aplusBlocks, setAplusBlocks] = useState<
        { title: string; description: string; image_url: string }[]
    >([]);
    // FIX: Inline toast instead of alert()
    const [toast, setToast] = useState<ToastState | null>(null);

    const isMobile = useIsMobile(768);

    /* ── Toast auto-dismiss ── */
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(t);
    }, [toast]);

    /* ── Sticky bar on scroll ── */
    useEffect(() => {
        const handler = () => setShowStickyBar(window.scrollY > 500);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    /* ── Zoom handlers (desktop only) ── */
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setZoomStyle({ transformOrigin: "center center", transform: "scale(1)" });
    }, []);

    /* ── Fetch product ── */
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
                    // FIX: Check is_active — hide unpublished products from public
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

    /* ── Fetch A+ content ── */
    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/aplus?product_id=${id}`);
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) setAplusBlocks(data.blocks ?? []);
            } catch { /* silent — A+ is non-critical */ }
        })();
        return () => { cancelled = true; };
    }, [id]);

    /* ── Reset selected image when product loads ── */
    useEffect(() => {
        setSelectedImage(0);
    }, [dbProduct?.id]);

    /* ── Build image array ── */
    const buildImages = useCallback((p: DbProduct): string[] => {
        if (p.images && p.images.length > 0) return p.images;
        const fallback: string[] = [];
        if (p.image_url) fallback.push(p.image_url);
        if (p.hover_image_url && p.hover_image_url !== p.image_url)
            fallback.push(p.hover_image_url);
        return fallback.length > 0
            ? fallback
            : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85"];
    }, []);

    const images = dbProduct ? buildImages(dbProduct) : [];

    // FIX: Clamp selectedImage in case images array shrinks
    const safeIndex = Math.min(selectedImage, Math.max(0, images.length - 1));

    /* ── WhatsApp handler ── */
    const handleWhatsApp = useCallback(() => {
        if (!dbProduct) return;
        const currentUrl = window.location.href;
        const formattedPrice = dbProduct.price
            ? dbProduct.price.toLocaleString("en-IN")
            : "N/A";
        const message = `Hi, I'm interested in this product:\n\nProduct: ${dbProduct.title}\nPrice: ₹${formattedPrice}\nLink: ${currentUrl}\n\nPlease share more details.`;
        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    }, [dbProduct]);

    /* ── Cart Handlers ── */
    // FIX: Removed "as any" cast — id is already string
    const buildCartPayload = useCallback(() => {
        if (!dbProduct) return null;
        return {
            id: dbProduct.id,
            title: dbProduct.title,
            finish: dbProduct.finish,
            price: dbProduct.price ?? 0,
            image: dbProduct.image_url,
            qty: 1,
            stockQty: dbProduct.stock_qty ?? 10,
        };
    }, [dbProduct]);

    const handleAddToCart = useCallback(() => {
        const payload = buildCartPayload();
        if (!payload) return;
        dispatch({ type: "ADD", payload });
        // FIX: Toast instead of alert()
        setToast({ message: "Added to cart!", type: "success" });
    }, [buildCartPayload, dispatch]);

    const handleBuyNow = useCallback(() => {
        const payload = buildCartPayload();
        if (!payload) return;
        dispatch({ type: "ADD", payload });
        router.push("/cart");
    }, [buildCartPayload, dispatch, router]);

    /* ── Loading state ── */
    if (loadingProduct) {
        return (
            <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
                <SiteHeader />
                <div style={{
                    display: "flex", justifyContent: "center", alignItems: "center",
                    height: "70vh", flexDirection: "column", gap: "1.5rem",
                }}>
                    <div style={{
                        width: 40, height: 40,
                        border: "3px solid #E6E6E6", borderTopColor: "#1C1C1C",
                        borderRadius: "50%", animation: "spin 0.8s linear infinite",
                    }} />
                    <p style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem" }}>
                        Loading product…
                    </p>
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
                <div style={{
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    alignItems: "center", height: "60vh", gap: "1rem",
                }}>
                    <p style={{ color: "#111", fontFamily: FO, fontSize: "1.1rem", fontWeight: 700 }}>
                        Product Not Found
                    </p>
                    <Link
                        href="/shop"
                        style={{ color: "#888", fontFamily: FO, fontSize: "0.875rem", textDecoration: "underline" }}
                    >
                        Back to Products
                    </Link>
                </div>
            </main>
        );
    }

    /* ── Derived values ── */
    const discountPct =
        dbProduct.compare_at_price &&
        dbProduct.compare_at_price > dbProduct.price
            ? Math.round((1 - dbProduct.price / dbProduct.compare_at_price) * 100)
            : null;

    return (
        <main style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FO }}>
            <SiteHeader />

            {/* ── TOAST NOTIFICATION ── */}
            {toast && (
                <div style={{
                    position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
                    zIndex: 9999,
                    background: toast.type === "success" ? "#111" : "#DC2626",
                    color: "#fff",
                    padding: "0.75rem 1.75rem",
                    borderRadius: 6,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    fontFamily: FM,
                    letterSpacing: "0.06em",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    animation: "toastIn 0.2s ease",
                    whiteSpace: "nowrap",
                }}>
                    {toast.type === "success" ? "✓ " : "✕ "}{toast.message}
                </div>
            )}

            {/* ── BREADCRUMB ── */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E6E6E6", padding: "0.875rem 1.5rem" }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto",
                    fontSize: "0.72rem", color: "#888", letterSpacing: "0.08em",
                    fontFamily: FM, display: "flex", flexWrap: "wrap", gap: "0.25rem", alignItems: "center",
                }}>
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
                    gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
                    gap: isMobile ? "2rem" : "4rem",
                    alignItems: "start",
                }}>

                    {/* ── LEFT: IMAGE GALLERY ── */}
                    <div>
                        {/* Main Image */}
                        {/* FIX: Zoom only on desktop (mouse events meaningless on touch) */}
                        <div
                            style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                overflow: "hidden",
                                background: "#E9E9E7",
                                marginBottom: "1rem",
                                cursor: isMobile ? "default" : "zoom-in",
                            }}
                            onMouseMove={isMobile ? undefined : handleMouseMove}
                            onMouseLeave={isMobile ? undefined : handleMouseLeave}
                        >
                            <img
                                src={optimizeImage(images[safeIndex], 1200)}
                                alt={dbProduct.title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    transformOrigin: zoomStyle.transformOrigin,
                                    transform: isMobile ? "scale(1)" : zoomStyle.transform,
                                    transition: "transform 0.1s ease-out",
                                }}
                            />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {images.slice(0, 6).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        style={{
                                            width: 64, height: 64,
                                            border: safeIndex === i
                                                ? "2px solid #1C1C1C"
                                                : "1px solid #E6E6E6",
                                            background: "#E9E9E7",
                                            cursor: "pointer",
                                            padding: 0,
                                            overflow: "hidden",
                                            borderRadius: 4,
                                            transition: "border-color 0.15s",
                                        }}
                                        aria-label={`View image ${i + 1}`}
                                    >
                                        <img
                                            src={optimizeImage(img, 120)}
                                            alt=""
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: PRODUCT INFO ── */}
                    <div>
                        {/* New Badge */}
                        {dbProduct.is_new && (
                            <span style={{
                                display: "inline-block",
                                padding: "0.2rem 0.75rem",
                                background: "#1C1C1C",
                                color: "#fff",
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                fontFamily: FM,
                                borderRadius: 2,
                                marginBottom: "0.75rem",
                            }}>
                                New Arrival
                            </span>
                        )}

                        {/* Title */}
                        <h1 style={{
                            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                            fontWeight: 900, color: "#111",
                            letterSpacing: "-0.02em", lineHeight: 1.15,
                            fontFamily: FM, marginBottom: "0.4rem",
                        }}>
                            {dbProduct.title}
                        </h1>


                        {/* Price row */}
                        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                            <p style={{
                                fontSize: "2.25rem", fontWeight: 900, color: "#111",
                                fontFamily: FM, letterSpacing: "-0.02em", margin: 0,
                            }}>
                                ₹{dbProduct.price?.toLocaleString("en-IN")}
                            </p>
                            {/* FIX: Show compare_at_price with strikethrough */}
                            {dbProduct.compare_at_price && dbProduct.compare_at_price > dbProduct.price && (
                                <p style={{
                                    fontSize: "1.1rem", color: "#999",
                                    fontFamily: FO, margin: 0,
                                    textDecoration: "line-through",
                                }}>
                                    ₹{dbProduct.compare_at_price.toLocaleString("en-IN")}
                                </p>
                            )}
                            {discountPct !== null && (
                                <span style={{
                                    padding: "0.2rem 0.6rem",
                                    background: "#DCFCE7", color: "#15803D",
                                    fontSize: "0.72rem", fontWeight: 800,
                                    fontFamily: FM, borderRadius: 4,
                                    letterSpacing: "0.05em",
                                }}>
                                    {discountPct}% OFF
                                </span>
                            )}
                        </div>

                        {/* Trust line */}
                        <p style={{
                            fontSize: "0.85rem", fontWeight: 700,
                            letterSpacing: "0.15em", color: "#555",
                            textTransform: "uppercase", fontFamily: FM,
                            marginBottom: "1.5rem",
                        }}>
                            Premium Steel • Built to Last
                        </p>

                        {/* Urgency Line */}
                        {dbProduct.stock_qty > 0 && dbProduct.stock_qty <= 12 && (
                            <p style={{
                                fontSize: "0.85rem", fontWeight: 700, color: "#DC2626",
                                fontFamily: FM, marginBottom: "0.5rem",
                                display: "flex", alignItems: "center", gap: "0.4rem",
                            }}>
                                🔥 Only {dbProduct.stock_qty} items left in stock
                            </p>
                        )}

                        {/* Out of stock */}
                        {dbProduct.stock_qty === 0 && (
                            <p style={{
                                fontSize: "0.85rem", fontWeight: 700, color: "#DC2626",
                                fontFamily: FM, marginBottom: "0.5rem",
                            }}>
                                ✕ Currently Out of Stock
                            </p>
                        )}

                        {/* Delivery Line */}
                        <p style={{
                            fontSize: "0.85rem", fontWeight: 600, color: "#10B981",
                            fontFamily: FM, marginBottom: "1.5rem",
                            display: "flex", alignItems: "center", gap: "0.4rem",
                        }}>
                            🚚 Free Delivery Available
                        </p>

                        {/* Divider */}
                        <div style={{ height: 1, background: "#E6E6E6", marginBottom: "1.5rem" }} />

                        {/* Bullet Points */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
                            {DEFAULT_BULLETS.map((point) => (
                                <p key={point} style={{
                                    fontSize: "1rem", color: "#333",
                                    fontFamily: FO, fontWeight: 500,
                                    margin: 0, lineHeight: 1.5,
                                    display: "flex", alignItems: "center", gap: "0.75rem",
                                }}>
                                    <span style={{ color: "#111", fontWeight: 800, fontSize: "1.2rem" }}>•</span> {point}
                                </p>
                            ))}
                        </div>

                        {/* Buy Buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <button
                                onClick={handleAddToCart}
                                disabled={dbProduct.stock_qty === 0}
                                style={{
                                    width: "100%", padding: "1.25rem",
                                    background: dbProduct.stock_qty === 0 ? "#ccc" : "#111",
                                    color: "#fff", fontWeight: 800, fontSize: "1.1rem",
                                    textTransform: "uppercase", letterSpacing: "0.05em",
                                    border: "none", borderRadius: "4px",
                                    cursor: dbProduct.stock_qty === 0 ? "not-allowed" : "pointer",
                                    fontFamily: FM, transition: "background 0.2s ease",
                                }}
                                onMouseEnter={e => { if (dbProduct.stock_qty > 0) e.currentTarget.style.background = "#333"; }}
                                onMouseLeave={e => { if (dbProduct.stock_qty > 0) e.currentTarget.style.background = "#111"; }}
                            >
                                {dbProduct.stock_qty === 0 ? "Out of Stock" : "Add to Cart"}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={dbProduct.stock_qty === 0}
                                style={{
                                    width: "100%", padding: "1.25rem",
                                    background: "#fff", color: "#111",
                                    fontWeight: 800, fontSize: "1.1rem",
                                    textTransform: "uppercase", letterSpacing: "0.05em",
                                    border: "2px solid #111", borderRadius: "4px",
                                    cursor: dbProduct.stock_qty === 0 ? "not-allowed" : "pointer",
                                    fontFamily: FM, transition: "background 0.2s ease",
                                    opacity: dbProduct.stock_qty === 0 ? 0.4 : 1,
                                }}
                                onMouseEnter={e => { if (dbProduct.stock_qty > 0) e.currentTarget.style.background = "#f5f5f5"; }}
                                onMouseLeave={e => { if (dbProduct.stock_qty > 0) e.currentTarget.style.background = "#fff"; }}
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Contact note */}
                        <p style={{
                            fontSize: "0.85rem", color: "#666",
                            fontFamily: FO, textAlign: "center", marginTop: "1.5rem",
                        }}>
                            Need bulk pricing?{" "}
                            <a
                                href="#"
                                onClick={e => { e.preventDefault(); handleWhatsApp(); }}
                                style={{ color: "#111", fontWeight: 700, textDecoration: "underline" }}
                            >
                                Contact us on WhatsApp
                            </a>
                        </p>
                    </div>
                </div>
            </section>

            {/* ── FIX: PRODUCT DESCRIPTION SECTION ── */}
            {dbProduct.description && (
                <section style={{ background: "#FAFAFA", padding: isMobile ? "2.5rem 1.25rem" : "3rem 1.5rem", borderTop: "1px solid #E6E6E6" }}>
                    <div style={{ maxWidth: 760, margin: "0 auto" }}>
                        <p style={{
                            fontSize: "0.65rem", fontWeight: 700,
                            letterSpacing: "0.22em", color: "#999",
                            textTransform: "uppercase", fontFamily: FM,
                            marginBottom: "1rem",
                        }}>
                            Product Details
                        </p>
                        <p style={{
                            fontSize: "1rem", color: "#444",
                            fontFamily: FO, lineHeight: 1.85,
                            whiteSpace: "pre-line",
                        }}>
                            {dbProduct.description}
                        </p>
                    </div>
                </section>
            )}

            {/* ── A+ CONTENT SECTION ── */}
            {aplusBlocks.length > 0 && (
                <section style={{ background: "#fff", padding: "4rem 1.5rem", borderTop: "1px solid #E6E6E6" }}>
                    <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {aplusBlocks.map((block, i) => (
                            <div
                                key={i}
                                style={{
                                    position: "relative", width: "100%",
                                    aspectRatio: i === 0 || i === aplusBlocks.length - 1
                                        ? (isMobile ? "4/3" : "21/9")
                                        : "1/1",
                                    borderRadius: "0.5rem", overflow: "hidden",
                                    background: block.image_url ? "#f0f0f0" : "#fafafa",
                                    border: block.image_url ? "none" : "1px solid #E6E6E6",
                                }}
                            >
                                {block.image_url && (
                                    <img
                                        src={block.image_url}
                                        alt={block.title}
                                        loading="lazy"
                                        style={{
                                            width: "100%", height: "100%",
                                            objectFit: "cover",
                                            position: "absolute", inset: 0,
                                        }}
                                    />
                                )}
                                <div style={{
                                    position: block.image_url ? "absolute" : "relative",
                                    inset: 0,
                                    background: block.image_url
                                        ? "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))"
                                        : "none",
                                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                                    padding: isMobile ? "1.5rem" : "2.5rem",
                                }}>
                                    {block.title && (
                                        <h3 style={{
                                            color: block.image_url ? "#fff" : "#111",
                                            fontSize: "clamp(1.25rem, 3vw, 2rem)",
                                            fontWeight: 900, fontFamily: FM, lineHeight: 1.15,
                                            marginBottom: block.description ? "0.5rem" : 0,
                                        }}>
                                            {block.title}
                                        </h3>
                                    )}
                                    {block.description && (
                                        <p style={{
                                            color: block.image_url ? "rgba(255,255,255,0.85)" : "#555",
                                            fontSize: "0.95rem", fontFamily: FO,
                                            lineHeight: 1.6, maxWidth: 500,
                                        }}>
                                            {block.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── FINAL CTA ── */}
            <section style={{
                background: "#1C1C1C",
                padding: isMobile ? "3.5rem 1.25rem" : "5rem 1.5rem",
                textAlign: "center",
            }}>
                <div style={{
                    maxWidth: 600, margin: "0 auto",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem",
                }}>
                    <p style={{
                        fontSize: "0.65rem", fontWeight: 700,
                        letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)",
                        textTransform: "uppercase", fontFamily: FM,
                    }}>
                        Built to Last 10 Years
                    </p>
                    <h2 style={{
                        fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 900,
                        color: "#fff", lineHeight: 1.2,
                        letterSpacing: "-0.02em", fontFamily: FM,
                    }}>
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

            {/* ── STICKY ADD TO CART BAR ── */}
            {showStickyBar && (
                <div style={{
                    position: "fixed",
                    bottom: 0, left: 0, right: 0,
                    zIndex: 100,
                    background: "#fff",
                    borderTop: "1px solid #E6E6E6",
                    boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
                    padding: isMobile ? "0.75rem 1rem" : "0.75rem 2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "stickySlideUp 0.25s ease",
                }}>
                    <div style={{
                        maxWidth: 800, width: "100%",
                        display: "flex", alignItems: "center",
                        gap: isMobile ? "0.75rem" : "2rem",
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                            <p style={{
                                fontSize: isMobile ? "0.85rem" : "1rem",
                                fontWeight: 800, fontFamily: FM, color: "#111",
                                margin: 0, overflow: "hidden",
                                textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                                {dbProduct.title}
                            </p>
                            <p style={{
                                fontSize: isMobile ? "1rem" : "1.15rem",
                                fontWeight: 900, fontFamily: FM, color: "#111", margin: 0,
                            }}>
                                ₹{dbProduct.price?.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={dbProduct.stock_qty === 0}
                            style={{
                                padding: isMobile ? "0.75rem 1.25rem" : "0.875rem 2rem",
                                background: dbProduct.stock_qty === 0 ? "#ccc" : "#111",
                                color: "#fff",
                                fontWeight: 800, fontSize: isMobile ? "0.8rem" : "0.9rem",
                                letterSpacing: "0.05em", textTransform: "uppercase",
                                border: "none", borderRadius: "4px",
                                cursor: dbProduct.stock_qty === 0 ? "not-allowed" : "pointer",
                                fontFamily: FM, whiteSpace: "nowrap", flexShrink: 0,
                            }}
                        >
                            {dbProduct.stock_qty === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        {!isMobile && (
                            <button
                                onClick={handleBuyNow}
                                disabled={dbProduct.stock_qty === 0}
                                style={{
                                    padding: "0.875rem 2rem",
                                    background: "#fff", color: "#111",
                                    fontWeight: 800, fontSize: "0.9rem",
                                    letterSpacing: "0.05em", textTransform: "uppercase",
                                    border: "2px solid #111", borderRadius: "4px",
                                    cursor: dbProduct.stock_qty === 0 ? "not-allowed" : "pointer",
                                    fontFamily: FM, whiteSpace: "nowrap", flexShrink: 0,
                                    opacity: dbProduct.stock_qty === 0 ? 0.4 : 1,
                                }}
                            >
                                Buy Now
                            </button>
                        )}
                    </div>
                </div>
            )}
            {showStickyBar && <div style={{ height: isMobile ? 72 : 76 }} />}

            <style>{`
                @keyframes stickySlideUp {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
                @keyframes toastIn {
                    from { opacity: 0; transform: translate(-50%, -12px); }
                    to   { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </main>
    );
}
