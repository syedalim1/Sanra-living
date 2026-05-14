"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SiteFooter from "@/app/components/SiteFooter";
import { optimizeImage } from "@/utils/cloudinary";
import { useCart } from "@/app/context/CartContext";

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
        <div className="border-b border-black/5 py-4">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center bg-transparent border-none cursor-pointer p-0"
            >
                <span className="font-semibold font-montserrat text-[0.95rem] text-black tracking-wide text-left">{title}</span>
                <span className={`text-xl text-black font-light transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                    <div className={`text-[#555] text-sm font-outfit leading-relaxed font-light transition-all duration-300 ${isOpen ? 'mt-3 pb-1' : 'mt-0 pb-0'}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── MINIMAL STICKY HEADER ── */
function MinimalHeader({ cartCount }: { cartCount: number }) {
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/5 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href="/" className="text-black"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></Link>
            </div>
            <Link href="/" className="text-xl font-black font-montserrat text-black no-underline tracking-widest">SANRA</Link>
            <div className="flex items-center gap-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <Link href="/cart" className="relative text-black">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-[0.6rem] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
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
    const [relatedProducts, setRelatedProducts] = useState<DbProduct[]>([]);
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
                    else {
                        setDbProduct(json.product);
                        // Fetch related products
                        if (json.product.category) {
                            fetch(`/api/products?category=${encodeURIComponent(json.product.category)}&limit=5`)
                                .then(r => r.json())
                                .then(data => {
                                    if (!cancelled && data.products) {
                                        setRelatedProducts(data.products.filter((p: DbProduct) => p.id !== json.product.id).slice(0, 4));
                                    }
                                }).catch(console.error);
                        }
                    }
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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-[#EAEAEA] border-t-black rounded-full animate-spin" />
            </div>
        );
    }
    if (notFound || !dbProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white font-outfit">
                <p className="text-xl font-semibold text-black">Product Not Found</p>
                <Link href="/" className="mt-4 text-gray-600 underline">Back to Home</Link>
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
        <main className="min-h-screen bg-white font-outfit break-words">
            <MinimalHeader cartCount={cartCount} />

            <div className="max-w-7xl mx-auto pb-24 lg:pb-12 pt-0 lg:pt-8 px-0 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-0 lg:gap-12">
                    
                    {/* 2. PRODUCT IMAGE SECTION */}
                    <section className="w-full lg:w-1/2 relative bg-[#F4F4F4] lg:rounded-2xl overflow-hidden self-start sticky lg:top-24">
                        {/* Swipe Gallery */}
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full aspect-[4/5] lg:aspect-square no-scrollbar"
                        >
                            {images.map((img, idx) => (
                                <div key={idx} className="flex-[0_0_100%] w-full snap-start relative shrink-0">
                                    <img src={optimizeImage(img, 1000)} alt={dbProduct.title} className="w-full h-full object-cover object-[center_top]" />
                                    {/* Watermark Overlay */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-10">
                                        <span className="text-[18vw] lg:text-[10vw] font-black font-montserrat -rotate-[30deg] text-black whitespace-nowrap">SANRA LIVING</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Dots */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                                {images.map((_, idx) => (
                                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${activeImg === idx ? "w-5 bg-black" : "w-1.5 bg-black/20"}`} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* DETAILS SECTION */}
                    <div className="w-full lg:w-1/2 px-4 py-6 lg:px-0 lg:py-0 flex flex-col min-w-0">
                        
                        {/* 3. PRODUCT TITLE AREA */}
                        <section className="mb-6">
                            {dbProduct.badge && (
                                <span className="inline-block bg-black text-white px-2.5 py-1 text-[0.65rem] font-bold font-montserrat tracking-[0.1em] rounded-sm mb-3 uppercase">
                                    {dbProduct.badge}
                                </span>
                            )}
                            <h1 className="text-[1.75rem] lg:text-[2.2rem] font-semibold font-montserrat text-black mb-1 leading-tight tracking-tight">
                                {dbProduct.title}
                            </h1>
                            {dbProduct.subtitle && (
                                <p className="text-base text-gray-600 mb-4 font-outfit leading-relaxed font-light">
                                    {dbProduct.subtitle}
                                </p>
                            )}
                            
                            <div className="flex items-baseline gap-3 mt-4">
                                <span className="text-2xl lg:text-3xl font-medium font-montserrat text-black tracking-tight">₹{dbProduct.price.toLocaleString("en-IN")}</span>
                                {dbProduct.compare_at_price && (
                                    <span className="text-lg text-gray-400 line-through font-outfit font-light">₹{dbProduct.compare_at_price.toLocaleString("en-IN")}</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-outfit font-light">Inclusive of all taxes</p>
                        </section>

                        {/* 4. QUICK TRUST ICONS */}
                        <section className="flex justify-between py-6 border-y border-black/5 my-8 overflow-x-auto gap-4 no-scrollbar">
                            {trustFeatures.slice(0, 4).map((feat, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 min-w-[70px] flex-1">
                                    <div className="w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center shrink-0">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            {i === 0 && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>}
                                            {i === 1 && <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>}
                                            {i === 2 && <><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></>}
                                            {i === 3 && <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></>}
                                            {i > 3 && <path d="M5 12l5 5l10 -10"></path>}
                                        </svg>
                                    </div>
                                    <span className="text-[0.7rem] font-montserrat font-semibold text-[#222] text-center leading-tight tracking-wide uppercase">{feat}</span>
                                </div>
                            ))}
                        </section>

                        {/* 5. QUANTITY + BUY SECTION (Inline) */}
                        <section className="mb-10">
                            <div className="flex gap-4 mb-4">
                                {/* Quantity selector */}
                                <div className="flex items-center border border-black/10 rounded-md bg-white p-1 w-[120px] shrink-0">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-11 bg-transparent border-none text-xl text-black cursor-pointer">−</button>
                                    <span className="flex-1 text-center text-base font-medium font-outfit">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-11 bg-transparent border-none text-xl text-black cursor-pointer">+</button>
                                </div>
                                {/* Add to cart */}
                                <button onClick={handleAddToCart} className="flex-1 h-[52px] bg-black text-white border-none rounded-md text-sm font-semibold font-montserrat uppercase tracking-wide cursor-pointer hover:bg-black/90 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                            
                            {/* Buy on WhatsApp */}
                            <button onClick={handleWhatsApp} className="w-full h-[52px] bg-[#25D366] text-white border-none rounded-md text-sm font-semibold font-montserrat uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Buy On WhatsApp
                            </button>

                            {/* 6. TRUST MESSAGE */}
                            <div className="flex justify-center items-center gap-3 mt-6">
                                <span className="text-xs text-gray-500 font-outfit flex items-center gap-1 font-light"><span className="text-[10px]">🔒</span> Secure Checkout</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-xs text-gray-500 font-outfit flex items-center gap-1 font-light"><span className="text-[10px]">🚚</span> Fast Delivery</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-xs text-gray-500 font-outfit flex items-center gap-1 font-light"><span className="text-[10px]">↩</span> Easy Returns</span>
                            </div>
                        </section>

                        {/* 8. ACCORDION INFORMATION SECTION */}
                        <section className="mb-12 border-t border-black/5">
                            <Accordion title="Materials & Finish" open>
                                <ul className="pl-5 m-0 list-disc">
                                    {dbProduct.material && <li className="mb-2">Material: {dbProduct.material}</li>}
                                    {dbProduct.pipe_type && <li className="mb-2">Structure: {dbProduct.pipe_type}</li>}
                                    {dbProduct.finish && <li className="mb-2">Finish: {dbProduct.finish}</li>}
                                    {dbProduct.color && <li className="mb-2">Color: {dbProduct.color}</li>}
                                    {!dbProduct.material && !dbProduct.finish && <li>Premium stainless steel with expert powder coating.</li>}
                                </ul>
                            </Accordion>
                            
                            <Accordion title="Dimensions">
                                {dbProduct.dimensions ? (
                                    <p className="m-0">{dbProduct.dimensions}</p>
                                ) : (
                                    <p className="m-0">Please check product images for detailed dimensions.</p>
                                )}
                                {dbProduct.weight_kg && <p className="mt-2 mb-0">Weight Capacity: {dbProduct.weight_kg}kg</p>}
                            </Accordion>
                            
                            <Accordion title="Delivery & Installation">
                                <p className="m-0">{dbProduct.delivery_info || "Pan India delivery available within 5-7 business days. No complex installation required."}</p>
                            </Accordion>
                            
                            <Accordion title="Warranty">
                                <p className="m-0">{dbProduct.warranty || "Standard 3 Year structural warranty included."}</p>
                            </Accordion>
                            
                            <Accordion title="Care Instructions">
                                <ul className="pl-5 m-0 list-disc">
                                    <li className="mb-2">Wipe clean with a damp cloth.</li>
                                    <li className="mb-2">Avoid using harsh chemicals or abrasives.</li>
                                </ul>
                            </Accordion>
                        </section>

                    </div>
                </div>

                {/* 9. RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16 lg:mt-24 px-4 lg:px-0">
                        <h2 className="text-xl lg:text-2xl font-medium font-montserrat text-black mb-6 tracking-wide">Complete The Look</h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map(rp => (
                                <Link key={rp.id} href={`/shop/${rp.id}`} className="group flex flex-col justify-between h-full bg-white p-2 lg:p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 min-w-0">
                                    <div className="bg-[#F7F7F7] rounded-lg aspect-[4/5] mb-3 overflow-hidden relative shrink-0">
                                        <img src={optimizeImage(rp.image_url, 400)} alt={rp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="px-1 min-w-0 flex flex-col justify-between flex-1">
                                        <p className="text-sm lg:text-base font-medium font-montserrat text-black mb-1 line-clamp-2 leading-snug min-h-[40px]">{rp.title}</p>
                                        <p className="text-sm lg:text-sm text-gray-600 font-light font-outfit mt-auto">₹{rp.price.toLocaleString("en-IN")}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 10. SOCIAL PROOF */}
                <section className="py-8 mt-8 border-t border-black/5 text-center px-4">
                    <p className="text-base lg:text-lg font-medium font-montserrat text-black m-0 tracking-wide">Trusted by 10,000+ customers<br className="lg:hidden"/> across India.</p>
                </section>
            </div>
            
            <SiteFooter />

            {/* STICKY BOTTOM BAR (MOBILE ONLY) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/5 px-4 py-2.5 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
                <div className="flex flex-col">
                    <span className="text-[0.65rem] text-gray-500 font-outfit uppercase tracking-wider font-medium">Price</span>
                    <span className="text-lg font-semibold font-montserrat text-black tracking-tight">₹{dbProduct?.price?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleAddToCart} className="px-5 h-11 bg-black text-white border-none rounded-md text-xs font-semibold font-montserrat uppercase tracking-wide cursor-pointer hover:bg-black/90 transition-colors">
                        Add to Cart
                    </button>
                    <button onClick={handleWhatsApp} className="w-11 h-11 bg-[#25D366] text-white border-none rounded-md flex items-center justify-center cursor-pointer hover:bg-[#20ba59] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </button>
                </div>
            </div>
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
