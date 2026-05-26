"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeImage } from "@/utils/cloudinary";
import { useCart } from "@/app/context/CartContext";

/* ── FONTS ─────────────────────────────────────────────────── */
export const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";
export const FO = "var(--font-outfit), Outfit, Inter, sans-serif";

/* ── TOKENS ────────────────────────────────────────────────── */
export const C = {
    black: "#111111",
    dark: "#1A1917",
    mid: "#4E4E4C",
    muted: "#8A8A87",
    border: "rgba(17, 17, 17, 0.05)",
    bg: "#FAF9F6",
    white: "#FFFFFF",
    gold: "#C5A880",
};

/* ── TYPES ─────────────────────────────────────────────────── */
export interface Product {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    category: string;
    finish: string;
    stock_status: string;
    stock_qty: number;
    image_url: string;
    hover_image_url: string;
    is_new: boolean;
    is_active: boolean;
    // Database schema columns for category page filtering & extra context
    sub_category?: string;
    product_type?: string;
    material?: string;
    pipe_type?: string;
    dimensions?: string;
    weight_kg?: number;
    tags?: string[];
    compare_at_price?: number | null;
    display_order?: number;
    color?: string;
    badge?: string;
}

/* ── SORT OPTIONS ──────────────────────────────────────────── */
export const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

/* ── STOCK BADGE ───────────────────────────────────────────── */
export function StockBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; bg: string; color: string }> = {
        "In Stock": { label: "Ships Fast", bg: "#1A1917", color: "#FFFFFF" },
        "Only 12 Left": { label: "Selling Fast", bg: "#1A1917", color: "#FFFFFF" },
        "Only 3 Left": { label: "Only 3 Left", bg: "#8E7557", color: "#FFFFFF" },
        "New Arrival": { label: "New Arrival", bg: "#1A1917", color: "#FFFFFF" },
        "Best Seller": { label: "Best Seller", bg: "#1A1917", color: "#FFFFFF" },
        New: { label: "New Arrival", bg: "#1A1917", color: "#FFFFFF" },
        Limited: { label: "Best Seller", bg: "#1A1917", color: "#FFFFFF" },
    };
    const cfg = map[status] ?? { label: status, bg: "#1A1917", color: "#FFFFFF" };

    return (
        <span
            className="absolute top-3 left-3 z-10 text-[0.5rem] font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full font-montserrat shadow-md"
            style={{ background: cfg.bg, color: cfg.color }}
        >
            {cfg.label}
        </span>
    );
}

/* ── PRODUCT CARD ──────────────────────────────────────────── */
export function ProductCard({
    product,
    index,
    badge,
    buttonText = "View Detail",
    onQuickViewClick,
}: {
    product: Product;
    index: number;
    badge?: string;
    buttonText?: string;
    onQuickViewClick?: (product: Product) => void;
}) {
    const priceDisplay = `₹${product.price.toLocaleString("en-IN")}`;
    const originalMrp = product.compare_at_price && product.compare_at_price > product.price 
        ? product.compare_at_price 
        : Math.floor(product.price * 1.35);
    const mrpDisplay = `₹${originalMrp.toLocaleString("en-IN")}`;
    const discountPercent = Math.round(((originalMrp - product.price) / originalMrp) * 100);
    const router = useRouter();
    const [imgError, setImgError] = useState(false);

    const handleCardClick = () => router.push(`/shop/${product.id}`);

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (buttonText.toLowerCase() === "view detail") {
            handleCardClick();
        } else {
            e.stopPropagation();
            const event = new CustomEvent("add-to-cart", { detail: product });
            window.dispatchEvent(event);
        }
    };

    const primaryImg =
        !imgError
            ? optimizeImage(product.image_url, 600) ||
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80"
            : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80";

    const hoverImg =
        optimizeImage(product.hover_image_url, 600) ||
        optimizeImage(product.image_url, 600) ||
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleCardClick}
            className="group flex flex-col cursor-pointer bg-transparent h-full transition-all duration-500 hover:translate-y-[-2px]"
        >
            {/* ── IMAGE AREA ─────────────────────────────────────── */}
            <div
                className="sl-product-img-wrap relative w-full overflow-hidden"
                style={{ aspectRatio: "3/4", borderRadius: 14, background: "#F5F4F0" }}
            >
                {/* Stock Badge */}
                {badge ? <StockBadge status={badge} /> : <StockBadge status={product.stock_status} />}

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <span
                        className="absolute left-3 z-10 text-[0.45rem] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full font-montserrat shadow-md bg-[#C5A880] text-white"
                        style={{ top: "45px" }}
                    >
                        {discountPercent}% OFF
                    </span>
                )}

                {/* Wishlist */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md text-[#1A1917]/50 hover:text-red-500 hover:bg-white transition-all shadow-sm duration-300 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100"
                    aria-label="Add to wishlist"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Quick View Button */}
                {onQuickViewClick && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickViewClick(product);
                        }}
                        className="absolute right-3 z-10 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md text-[#1A1917]/50 hover:text-[#C5A880] hover:bg-white transition-all shadow-sm duration-300 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100"
                        style={{ top: "46px" }}
                        aria-label="Quick view"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                )}

                {/* Primary Image */}
                <img
                    src={primaryImg}
                    alt={product.title}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    className="sl-product-img-primary"
                />

                {/* Hover Image */}
                <img
                    src={hoverImg}
                    alt=""
                    loading="lazy"
                    className="sl-product-img-hover"
                />

                {/* Desktop hover CTA bar */}
                <div className="absolute bottom-3 left-3 right-3 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] hidden md:block">
                    <button
                        onClick={handleButtonClick}
                        className="w-full py-3 bg-[#1A1917] hover:bg-black text-white text-[0.58rem] font-semibold tracking-[0.22em] uppercase font-montserrat rounded-full shadow-lg transition-all duration-300 border-none cursor-pointer"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* ── CARD BODY ──────────────────────────────────────── */}
            <div className="flex flex-col flex-1 pt-3.5 pb-1 px-0.5">
                {/* Category & finish */}
                <p className="text-[0.52rem] font-montserrat mb-1.5 uppercase tracking-[0.2em] font-medium text-black/45 flex items-center gap-1.5 truncate">
                    <span className="text-black/45 truncate">{product.category}</span>
                    {product.finish && (
                        <>
                            <span className="text-black/15 flex-shrink-0">•</span>
                            <span className="text-black/35 normal-case font-normal truncate">{product.finish}</span>
                        </>
                    )}
                </p>

                {/* Title */}
                <h3
                    className="text-[0.82rem] sm:text-[0.88rem] font-light text-[#111111] font-montserrat mb-2.5 leading-snug tracking-tight group-hover:text-[#C5A880] transition-colors duration-400"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                    {product.title}
                </h3>

                {/* Price row */}
                <div className="mt-auto flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[0.88rem] sm:text-[0.95rem] font-medium text-[#111] font-montserrat tracking-tight">
                            {priceDisplay}
                        </span>
                        {discountPercent > 0 && (
                            <span className="text-[0.72rem] text-black/30 font-outfit font-light line-through">
                                {mrpDisplay}
                            </span>
                        )}
                    </div>

                    {/* Colour swatches */}
                    <div className="flex gap-1.5 items-center flex-shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1A1917] border border-black/10 shadow-sm transition-transform duration-300 hover:scale-110" title="Carbon Matte" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8A8A87] border border-black/10 shadow-sm transition-transform duration-300 hover:scale-110" title="Satin Stainless" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] border border-black/10 shadow-sm transition-transform duration-300 hover:scale-110" title="Champagne Gold" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ── FILTER SECTION ────────────────────────────────────────── */
export function FilterSection({
    title,
    options,
    selected,
    onSelect,
    counts,
}: {
    title: string;
    options: string[];
    selected: string;
    onSelect: (v: string) => void;
    counts?: Record<string, number>;
}) {
    const [isOpen, setIsOpen] = useState(true); // Open by default for better UX!

    return (
        <div className="border-b border-black/[0.035] py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer p-0 group"
            >
                <span className="font-medium font-montserrat text-[0.62rem] tracking-[0.18em] uppercase text-[#111]/80 group-hover:text-black/55 transition-colors duration-300">
                    {title}
                </span>
                <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className={`text-black/40 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-180" : "rotate-0"}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div
                className="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <div className={`flex flex-col gap-1 transition-all duration-400 ${isOpen ? "mt-3.5 pb-1" : "mt-0"}`}>
                        {options.map((opt) => {
                            const active = selected === opt;
                            const count = counts ? counts[opt] : undefined;
                            
                            return (
                                <button
                                    key={opt}
                                    onClick={() => onSelect(opt)}
                                    className={`w-full text-left py-1.5 text-[0.78rem] font-outfit cursor-pointer border-none flex items-center gap-2.5 transition-all duration-200
                                        ${active ? "text-[#111]" : "text-black/45 hover:text-black/75 bg-transparent"}`}
                                    style={{ background: "transparent" }}
                                >
                                    <span className={`inline-flex w-[4px] h-[4px] rounded-full flex-shrink-0 border transition-all duration-300 ${active ? "bg-[#C5A880] border-[#C5A880] scale-125" : "bg-transparent border-black/15"}`} />
                                    <span className={`leading-[1.3] ${active ? "font-medium" : "font-light"}`}>
                                        {opt}
                                        {count !== undefined && (
                                            <span className="ml-1 text-[0.68rem] text-black/35 font-normal">({count})</span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   QUICK VIEW MODAL COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function QuickViewModal({
    product,
    onClose,
    onAddToCart,
}: {
    product: Product;
    onClose: () => void;
    onAddToCart: (p: Product, qty: number) => void;
}) {
    const [activeImg, setActiveImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const images = [
        product.image_url,
        product.hover_image_url,
    ].filter(Boolean) as string[];

    const originalMrp = product.compare_at_price && product.compare_at_price > product.price 
        ? product.compare_at_price 
        : Math.floor(product.price * 1.35);
    const discountPercent = Math.round(((originalMrp - product.price) / originalMrp) * 100);

    const handleAddToCartClick = () => {
        onAddToCart(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleWhatsAppClick = () => {
        const msg = `Hi, I want to inquire about:\n*${product.title}*\nPrice: ₹${product.price.toLocaleString("en-IN")}\nCategory: ${product.category}\nLink: ${window.location.origin}/shop/${product.id}`;
        window.open(`https://wa.me/918300904920?text=${encodeURIComponent(msg)}`, "_blank");
    };

    // Close on ESC key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/45 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="relative bg-white/95 backdrop-blur-2xl border border-black/5 rounded-3xl w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[640px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col md:grid md:grid-cols-2"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-9 h-9 bg-[#FAF9F6] border border-black/5 hover:border-black/10 rounded-full flex items-center justify-center text-black/55 hover:text-black shadow-sm transition-all active:scale-95 cursor-pointer"
                    aria-label="Close details"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Left side: Gallery */}
                <div className="bg-[#F5F4F0] p-6 md:p-8 flex flex-col justify-center items-center relative aspect-square md:aspect-auto md:h-full min-h-[260px]">
                    <div className="relative w-full h-[80%] max-h-[360px] flex items-center justify-center">
                        <img
                            src={optimizeImage(images[activeImg], 600)}
                            alt={product.title}
                            className="object-contain max-w-full max-h-full transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    {/* Thumbnail navigation */}
                    {images.length > 1 && (
                        <div className="flex gap-2.5 mt-6">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImg(idx)}
                                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 bg-white transition-all p-1
                                        ${activeImg === idx ? "border-[#C5A880] scale-105" : "border-black/5 hover:border-black/15"}`}
                                >
                                    <img src={optimizeImage(img, 100)} alt="" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right side: Product Information */}
                <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto no-scrollbar justify-between">
                    <div>
                        {/* Meta Category & Finish */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[0.52rem] font-semibold tracking-[0.2em] uppercase text-[#C5A880] font-montserrat">
                                {product.category}
                            </span>
                            <span className="text-black/15 text-[0.6rem]">•</span>
                            <span className="text-[0.52rem] font-medium tracking-[0.15em] uppercase text-black/45 font-montserrat">
                                {product.finish}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-light font-montserrat text-[#111] leading-tight mb-2">
                            {product.title}
                        </h2>

                        {product.subtitle && (
                            <p className="text-[0.78rem] text-black/45 font-light leading-relaxed mb-4">
                                {product.subtitle}
                            </p>
                        )}

                        {/* Prices */}
                        <div className="flex items-baseline gap-2.5 py-4 border-y border-black/[0.035] mb-5">
                            <span className="text-xl font-medium font-montserrat text-black tracking-tight">
                                ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[0.8rem] text-black/30 font-outfit font-light line-through">
                                ₹{originalMrp.toLocaleString("en-IN")}
                            </span>
                            {discountPercent > 0 && (
                                <span className="text-[0.5rem] font-montserrat font-bold uppercase tracking-[0.2em] text-[#C5A880] bg-[#C5A880]/10 px-2 py-1 rounded-full">
                                    {discountPercent}% OFF
                                </span>
                            )}
                        </div>

                        {/* Specs overview */}
                        <div className="flex flex-col gap-2.5 mb-6 text-[0.75rem] font-outfit text-black/60 font-light">
                            {product.material && (
                                <div className="flex justify-between border-b border-black/[0.02] pb-1.5">
                                    <span className="font-medium text-black/80">Material:</span>
                                    <span>{product.material}</span>
                                </div>
                            )}
                            {product.dimensions && (
                                <div className="flex justify-between border-b border-black/[0.02] pb-1.5">
                                    <span className="font-medium text-black/80">Dimensions:</span>
                                    <span>{product.dimensions}</span>
                                </div>
                            )}
                            {product.weight_kg && (
                                <div className="flex justify-between border-b border-black/[0.02] pb-1.5">
                                    <span className="font-medium text-black/80">Weight:</span>
                                    <span>{product.weight_kg} kg</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="mt-auto pt-4 border-t border-black/[0.035]">
                        <div className="flex gap-3.5 mb-3.5">
                            {/* Quantity selection */}
                            <div className="flex items-center border border-black/10 rounded-full bg-transparent p-0.5 w-[100px] shrink-0">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="flex-1 h-9 bg-transparent border-none text-sm text-black/40 hover:text-black cursor-pointer active:scale-90 transition-all focus:outline-none"
                                >
                                    −
                                </button>
                                <span className="flex-1 text-center text-xs font-semibold font-outfit text-black">
                                    {qty}
                                </span>
                                <button
                                    onClick={() => setQty(qty + 1)}
                                    className="flex-1 h-9 bg-transparent border-none text-sm text-black/40 hover:text-black cursor-pointer active:scale-90 transition-all focus:outline-none"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to cart */}
                            <button
                                onClick={handleAddToCartClick}
                                className={`flex-1 h-10 border-none rounded-full text-[0.58rem] font-semibold font-montserrat uppercase tracking-[0.2em] cursor-pointer shadow-sm active:scale-[0.98] transition-all duration-300
                                    ${added 
                                        ? "bg-emerald-600 text-white" 
                                        : "bg-[#1A1917] hover:bg-black text-white"}`}
                            >
                                {added ? "Added ✓" : "Add to Cart"}
                            </button>
                        </div>

                        {/* WhatsApp / Full Details Button */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleWhatsAppClick}
                                className="flex-1 h-10 bg-transparent hover:bg-black/5 text-[#1A1917] border border-[#1A1917]/25 rounded-full text-[0.58rem] font-semibold font-montserrat uppercase tracking-[0.18em] cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-300"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </button>
                            <Link
                                href={`/shop/${product.id}`}
                                className="flex-1 h-10 bg-transparent border border-black/10 rounded-full text-[0.58rem] font-semibold font-montserrat uppercase tracking-[0.18em] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all active:scale-[0.98]"
                            >
                                Details →
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
