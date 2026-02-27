"use client";

import React from "react";
import { optimizeVideo } from "@/utils/cloudinary";

const FM = "var(--font-montserrat), Montserrat, Inter, sans-serif";

interface Props {
    videoUrl?: string;
    videoThumbnail?: string;
    isMobile: boolean;
}

export default function ProductVideo({ videoUrl, videoThumbnail, isMobile }: Props) {
    if (!videoUrl) return null;

    return (
        <section style={{ background: "#000", padding: isMobile ? "0" : "2rem 1.5rem" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
                <video
                    src={optimizeVideo(videoUrl, isMobile ? 480 : 1080)}
                    poster={videoThumbnail || undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    style={{
                        width: "100%",
                        maxHeight: isMobile ? "50vh" : "65vh",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
                <div style={{
                    position: "absolute", bottom: isMobile ? "0.75rem" : "1.5rem",
                    left: isMobile ? "0.75rem" : "1.5rem",
                    display: "flex", alignItems: "center", gap: "0.625rem",
                }}>
                    <div style={{
                        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
                        padding: "0.4rem 0.875rem", borderRadius: 2,
                        display: "flex", alignItems: "center", gap: "0.4rem",
                    }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: FM }}>🎬 Product Showcase</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
