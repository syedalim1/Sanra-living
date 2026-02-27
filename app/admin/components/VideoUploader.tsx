"use client";

import React, { useState, useRef } from "react";
import { C, FM, FO } from "../constants";

interface Props {
    videoUrl: string;
    videoThumbnail: string;
    onVideoChange: (url: string, thumbnail: string) => void;
    adminKey: string;
}

export default function VideoUploader({ videoUrl, videoThumbnail, onVideoChange, adminKey }: Props) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadVideo = async (file: File) => {
        setUploading(true);
        setError("");
        setProgress("Uploading video…");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "video");

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: { "x-admin-key": adminKey },
                body: formData,
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Upload failed");
            }
            const data = await res.json();
            onVideoChange(data.url, data.thumbnail_url || "");
            setProgress("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
            setProgress("");
        } finally {
            setUploading(false);
        }
    };

    const handleFile = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        uploadVideo(files[0]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files);
    };

    const removeVideo = () => {
        onVideoChange("", "");
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div>
            {videoUrl ? (
                /* ── Video Preview ── */
                <div style={{ marginBottom: "1rem" }}>
                    <div style={{
                        aspectRatio: "16/9", background: "#000", borderRadius: 8, overflow: "hidden",
                        border: `1px solid ${C.border}`, position: "relative",
                    }}>
                        <video
                            src={videoUrl}
                            poster={videoThumbnail || undefined}
                            controls
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                        {/* Live badge */}
                        <div style={{
                            position: "absolute", top: 10, left: 10,
                            background: C.green, color: "#fff",
                            fontSize: "0.5rem", fontWeight: 900, fontFamily: FM,
                            padding: "2px 8px", borderRadius: 10,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                        }}>
                            🎬 Video
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.625rem" }}>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            style={{
                                padding: "0.5rem 1rem", background: "transparent",
                                border: `1px solid ${C.border}`, color: C.text,
                                fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.08em",
                                textTransform: "uppercase", cursor: "pointer", borderRadius: 6,
                                fontFamily: FM,
                            }}
                        >
                            Replace Video
                        </button>
                        <button
                            type="button"
                            onClick={removeVideo}
                            style={{
                                padding: "0.5rem 1rem", background: "transparent",
                                border: `1px solid ${C.red}44`, color: C.red,
                                fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.08em",
                                textTransform: "uppercase", cursor: "pointer", borderRadius: 6,
                                fontFamily: FM,
                            }}
                        >
                            Remove Video
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Upload Zone ── */
                <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                        aspectRatio: "16/9", background: dragOver ? `${C.accent}08` : "#0F0F0F",
                        borderRadius: 8, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        marginBottom: "1rem", cursor: uploading ? "wait" : "pointer",
                        border: `2px dashed ${dragOver ? C.accent : C.border}`,
                        transition: "all 0.2s",
                    }}
                >
                    {uploading ? (
                        <>
                            <div style={{
                                width: 28, height: 28, border: `3px solid ${C.accent}`,
                                borderTopColor: "transparent", borderRadius: "50%",
                                animation: "spin 0.8s linear infinite", marginBottom: "0.75rem",
                            }} />
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            <p style={{ fontSize: "0.85rem", color: C.accent, fontFamily: FM, fontWeight: 700 }}>{progress}</p>
                            <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO, marginTop: "0.25rem" }}>This may take a moment for large files</p>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", opacity: 0.4 }}>🎬</div>
                            <p style={{ fontSize: "0.88rem", color: C.text, fontFamily: FM, fontWeight: 700, marginBottom: "0.375rem" }}>
                                Drop video here or click to upload
                            </p>
                            <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO }}>
                                MP4, WebM, MOV · Max 100MB · Auto-optimized by Cloudinary
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    background: `${C.red}15`, border: `1px solid ${C.red}44`,
                    padding: "0.5rem 0.875rem", borderRadius: 6, marginBottom: "0.75rem",
                    fontSize: "0.75rem", color: C.red, fontFamily: FO,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    {error}
                    <button type="button" onClick={() => setError("")} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.82rem" }}>✕</button>
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={e => handleFile(e.target.files)}
                style={{ display: "none" }}
            />
        </div>
    );
}
