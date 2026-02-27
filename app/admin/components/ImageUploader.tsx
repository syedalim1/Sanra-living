"use client";

import React, { useState, useRef, useCallback } from "react";
import { C, FM, FO } from "../constants";

interface Props {
    images: string[];
    onImagesChange: (images: string[]) => void;
    adminKey: string;
    maxImages?: number;
}

export default function ImageUploader({ images, onImagesChange, adminKey, maxImages = 10 }: Props) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string>("");
    const [activeThumb, setActiveThumb] = useState(0);
    const [manualUrl, setManualUrl] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
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
            return data.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
            return null;
        }
    };

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArr = Array.from(files).slice(0, maxImages - images.length);
        if (fileArr.length === 0) return;

        setUploading(true);
        setError("");
        const newUrls: string[] = [];

        for (let i = 0; i < fileArr.length; i++) {
            setUploadProgress(`Uploading ${i + 1}/${fileArr.length}…`);
            const url = await uploadFile(fileArr[i]);
            if (url) newUrls.push(url);
        }

        if (newUrls.length > 0) {
            onImagesChange([...images, ...newUrls]);
            setActiveThumb(images.length);
        }
        setUploading(false);
        setUploadProgress("");
    }, [images, maxImages, adminKey, onImagesChange]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        const files: File[] = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
                const file = items[i].getAsFile();
                if (file) files.push(file);
            }
        }
        if (files.length > 0) {
            e.preventDefault();
            handleFiles(files);
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        setActiveThumb(Math.min(activeThumb, Math.max(newImages.length - 1, 0)));
    };

    const moveImage = (from: number, to: number) => {
        const newImages = [...images];
        const [moved] = newImages.splice(from, 1);
        newImages.splice(to, 0, moved);
        onImagesChange(newImages);
        setActiveThumb(to);
    };

    const addManualUrl = () => {
        const url = manualUrl.trim();
        if (!url) return;
        onImagesChange([...images, url]);
        setManualUrl("");
        setActiveThumb(images.length);
    };

    return (
        <div onPaste={handlePaste}>
            {/* Preview */}
            {images.length > 0 ? (
                <div style={{
                    aspectRatio: "16/9", background: "#111", borderRadius: 8, overflow: "hidden",
                    marginBottom: "1rem", border: `1px solid ${C.border}`, position: "relative",
                }}>
                    <img src={images[activeThumb]} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    {/* Nav arrows */}
                    {images.length > 1 && (
                        <>
                            <button type="button" onClick={() => setActiveThumb(i => Math.max(0, i - 1))} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: "1rem", cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
                            <button type="button" onClick={() => setActiveThumb(i => Math.min(images.length - 1, i + 1))} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: "1rem", cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                        </>
                    )}
                    <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", padding: "2px 8px", borderRadius: 10, fontSize: "0.62rem", color: "#fff", fontFamily: FM }}>{activeThumb + 1}/{images.length}</div>
                </div>
            ) : (
                /* Drop Zone */
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{
                        aspectRatio: "16/9", background: dragOver ? `${C.accent}08` : "#0F0F0F",
                        borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center",
                        justifyContent: "center", marginBottom: "1rem", cursor: "pointer",
                        border: `2px dashed ${dragOver ? C.accent : C.border}`,
                        transition: "all 0.2s",
                    }}
                >
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", opacity: 0.4 }}>📸</div>
                    <p style={{ fontSize: "0.88rem", color: C.text, fontFamily: FM, fontWeight: 700, marginBottom: "0.375rem" }}>
                        {uploading ? uploadProgress : "Drop images here or click to upload"}
                    </p>
                    <p style={{ fontSize: "0.68rem", color: C.muted, fontFamily: FO }}>
                        JPEG, PNG, WebP · Max 10MB · Paste from clipboard
                    </p>
                </div>
            )}

            {/* Thumbnails */}
            {images.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {images.map((img, i) => (
                        <div key={i} style={{ position: "relative" }}>
                            <div onClick={() => setActiveThumb(i)} style={{
                                width: 64, height: 64, background: "#111", borderRadius: 6, overflow: "hidden",
                                cursor: "pointer", border: i === activeThumb ? `2px solid ${C.accent}` : `2px solid ${C.border}`,
                            }}>
                                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ display: "flex", gap: 2, marginTop: 3, justifyContent: "center" }}>
                                {i > 0 && <button type="button" onClick={() => moveImage(i, i - 1)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", fontSize: "0.55rem", padding: "1px 4px", borderRadius: 3 }}>←</button>}
                                {i < images.length - 1 && <button type="button" onClick={() => moveImage(i, i + 1)} style={{ background: "none", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", fontSize: "0.55rem", padding: "1px 4px", borderRadius: 3 }}>→</button>}
                                <button type="button" onClick={() => removeImage(i)} style={{ background: "none", border: `1px solid ${C.red}33`, color: C.red, cursor: "pointer", fontSize: "0.55rem", padding: "1px 4px", borderRadius: 3 }}>✕</button>
                            </div>
                            {i === 0 && <div style={{ position: "absolute", top: -5, left: -5, background: C.accent, color: "#111", fontSize: "0.45rem", fontWeight: 900, fontFamily: FM, padding: "1px 4px", borderRadius: 8 }}>PRIMARY</div>}
                        </div>
                    ))}

                    {/* Upload more button */}
                    {images.length < maxImages && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: 64, height: 64, background: "#0F0F0F", borderRadius: 6,
                                border: `2px dashed ${C.border}`, display: "flex", alignItems: "center",
                                justifyContent: "center", cursor: "pointer", fontSize: "1.2rem", color: C.muted,
                            }}
                        >
                            +
                        </div>
                    )}
                </div>
            )}

            {/* Upload progress */}
            {uploading && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", padding: "0.625rem 1rem", background: `${C.accent}08`, border: `1px solid ${C.accent}22`, borderRadius: 6 }}>
                    <div style={{
                        width: 16, height: 16, border: `2px solid ${C.accent}`, borderTopColor: "transparent",
                        borderRadius: "50%", animation: "spin 0.8s linear infinite",
                    }} />
                    <span style={{ fontSize: "0.78rem", color: C.accent, fontFamily: FM }}>{uploadProgress}</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}44`, padding: "0.5rem 0.875rem", borderRadius: 6, marginBottom: "0.75rem", fontSize: "0.75rem", color: C.red, fontFamily: FO, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {error}
                    <button type="button" onClick={() => setError("")} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.82rem" }}>✕</button>
                </div>
            )}

            {/* Action Row */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || images.length >= maxImages}
                    style={{
                        padding: "0.625rem 1.25rem", background: C.accent, color: "#111", fontWeight: 900,
                        fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
                        border: "none", cursor: uploading ? "not-allowed" : "pointer", borderRadius: 6,
                        fontFamily: FM, opacity: uploading ? 0.6 : 1,
                    }}
                >
                    📤 Upload Images
                </button>
                <div style={{ flex: 1, display: "flex", gap: "0.35rem" }}>
                    <input
                        value={manualUrl}
                        onChange={e => setManualUrl(e.target.value)}
                        placeholder="Or paste image URL…"
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addManualUrl())}
                        style={{
                            background: "#0F0F0F", border: `1px solid ${C.border}`, color: C.text,
                            fontSize: "0.78rem", fontFamily: FO, borderRadius: 6,
                            padding: "0.625rem 0.875rem", flex: 1, boxSizing: "border-box",
                        }}
                    />
                    <button type="button" onClick={addManualUrl} style={{ padding: "0 0.875rem", background: "transparent", border: `1px solid ${C.border}`, color: C.accent, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 6, fontFamily: FM, whiteSpace: "nowrap" }}>+ URL</button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                multiple
                onChange={e => e.target.files && handleFiles(e.target.files)}
                style={{ display: "none" }}
            />
        </div>
    );
}
