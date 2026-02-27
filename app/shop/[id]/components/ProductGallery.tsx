"use client";

import React, { useState, useCallback, useEffect } from "react";
import { optimizeImage, imgThumb } from "@/utils/cloudinary";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";

/* ── ICONS ── */
const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface Props {
    images: string[];
    title: string;
    stockLabel: string;
    isMobile: boolean;
}

export default function ProductGallery({ images, title, stockLabel, isMobile }: Props) {
    const [activeImg, setActiveImg] = useState(0);
    const [zoomed, setZoomed] = useState(false);

    const prevImg = useCallback(() => setActiveImg(i => (i - 1 + images.length) % images.length), [images.length]);
    const nextImg = useCallback(() => setActiveImg(i => (i + 1) % images.length), [images.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevImg();
            if (e.key === "ArrowRight") nextImg();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [prevImg, nextImg]);

    const arrowBtn = (): React.CSSProperties => ({
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        width: 40, height: 40, borderRadius: "50%",
        background: "rgba(255,255,255,0.92)", border: "1px solid #E6E6E6",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#1C1C1C",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)", zIndex: 5,
        transition: "opacity 0.2s, box-shadow 0.2s",
    });

    return (
        <div>
            {/* Main Image */}
            <div style={{ position: "relative" }}>
                <div
                    style={{ aspectRatio: "1/1", background: "#F2F2F0", overflow: "hidden", cursor: "zoom-in", position: "relative" }}
                    onMouseEnter={() => setZoomed(true)}
                    onMouseLeave={() => setZoomed(false)}
                >
                    <img
                        src={optimizeImage(images[activeImg], 800)}
                        alt={title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.45s ease", transform: zoomed ? "scale(1.09)" : "scale(1)", display: "block" }}
                    />
                    {/* Stock badge */}
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "#1C1C1C", color: "#fff", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", padding: "0.35rem 0.75rem", textTransform: "uppercase", fontFamily: FM }}>
                        {stockLabel}
                    </div>
                    {/* Image counter */}
                    {images.length > 1 && (
                        <div style={{ position: "absolute", bottom: "1rem", right: "1rem", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "0.65rem", fontWeight: 700, fontFamily: FM, padding: "0.3rem 0.65rem", borderRadius: 2, letterSpacing: "0.08em" }}>
                            {activeImg + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Arrow Navigation */}
                {images.length > 1 && (
                    <>
                        <button onClick={prevImg} style={{ ...arrowBtn(), left: "0.6rem" }} aria-label="Previous image">
                            <ChevronIcon dir="left" />
                        </button>
                        <button onClick={nextImg} style={{ ...arrowBtn(), right: "0.6rem" }} aria-label="Next image">
                            <ChevronIcon dir="right" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.625rem", overflowX: "auto", paddingBottom: "0.25rem", scrollbarWidth: "none" }}>
                    <style>{`.thumb-strip::-webkit-scrollbar { display: none; }`}</style>
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveImg(i)}
                            style={{
                                flexShrink: 0, width: 76, height: 76, background: "#F2F2F0",
                                overflow: "hidden", cursor: "pointer",
                                border: i === activeImg ? "2.5px solid #1C1C1C" : "2px solid transparent",
                                transition: "border-color 0.2s, transform 0.15s",
                                transform: i === activeImg ? "scale(1)" : "scale(0.97)",
                            }}
                        >
                            <img src={imgThumb(img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Keyboard hint */}
            {images.length > 1 && !isMobile && (
                <p style={{ fontSize: "0.65rem", color: "#aaa", fontFamily: FM, marginTop: "0.5rem", letterSpacing: "0.08em" }}>
                    ← → Use arrow keys to navigate
                </p>
            )}
        </div>
    );
}
