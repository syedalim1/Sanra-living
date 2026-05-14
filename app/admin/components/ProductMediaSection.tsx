"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

/* ── Constants ── */
const IMAGE_PRESETS = [
    "Studio White",
    "Luxury Interior",
    "Warm Beige",
    "Dark Premium",
    "Editorial Luxury",
];
const WATERMARK_OPTIONS = ["Light", "Medium", "Strong", "Brand Protection"];

interface ImageWarning {
    index: number;
    type: "quality" | "aspect" | "size";
    message: string;
}

interface ProductMediaSectionProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    imageStylePreset: string;
    watermarkStrength: string;
    onSettingsChange: (field: string, value: string) => void;
    adminKey: string;
    maxImages?: number;
    /** Accordion section number */
    sectionNum?: number;
    defaultOpen?: boolean;
}

export default function ProductMediaSection({
    images,
    onImagesChange,
    imageStylePreset,
    watermarkStrength,
    onSettingsChange,
    adminKey,
    maxImages = 8,
    sectionNum = 2,
    defaultOpen = false,
}: ProductMediaSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, percent: 0 });
    const [dragOver, setDragOver] = useState(false);
    const [activePreview, setActivePreview] = useState(0);
    const [error, setError] = useState("");
    const [warnings, setWarnings] = useState<ImageWarning[]>([]);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Measure content for animation
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [images, uploading, error, warnings, imageStylePreset, watermarkStrength]);

    /* ── Image quality validation ── */
    const validateImage = useCallback((file: File, index: number): Promise<ImageWarning[]> => {
        return new Promise((resolve) => {
            const warns: ImageWarning[] = [];

            // Size warning
            if (file.size > 5 * 1024 * 1024) {
                warns.push({ index, type: "size", message: `Image ${index + 1} is ${(file.size / 1024 / 1024).toFixed(1)}MB — consider optimizing` });
            }

            const img = new Image();
            img.onload = () => {
                // Quality warning (low resolution)
                if (img.width < 800 || img.height < 800) {
                    warns.push({ index, type: "quality", message: `Image ${index + 1} is ${img.width}×${img.height}px — recommend 1200×1500px minimum` });
                }
                // Aspect ratio warning
                const ratio = img.width / img.height;
                if (ratio < 0.6 || ratio > 1.2) {
                    warns.push({ index, type: "aspect", message: `Image ${index + 1} has unusual aspect ratio — 4:5 recommended for product shots` });
                }
                resolve(warns);
            };
            img.onerror = () => resolve(warns);
            img.src = URL.createObjectURL(file);
        });
    }, []);

    /* ── Upload single file ── */
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

    /* ── Handle multiple files ── */
    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const allFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
        const fileArr = allFiles.slice(0, maxImages - images.length);
        if (fileArr.length === 0) return;

        setUploading(true);
        setError("");
        const newUrls: string[] = [];
        const allWarns: ImageWarning[] = [];

        for (let i = 0; i < fileArr.length; i++) {
            setUploadProgress({ current: i + 1, total: fileArr.length, percent: Math.round(((i + 1) / fileArr.length) * 100) });

            // Validate
            const warns = await validateImage(fileArr[i], images.length + i);
            allWarns.push(...warns);

            // Upload
            const url = await uploadFile(fileArr[i]);
            if (url) newUrls.push(url);
        }

        if (newUrls.length > 0) {
            onImagesChange([...images, ...newUrls]);
            setActivePreview(images.length);
        }
        if (allWarns.length > 0) {
            setWarnings(prev => [...prev, ...allWarns]);
        }
        setUploading(false);
        setUploadProgress({ current: 0, total: 0, percent: 0 });
    }, [images, maxImages, adminKey, onImagesChange, validateImage]);

    /* ── Drag & Drop handlers ── */
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

    /* ── Image management ── */
    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
        setActivePreview(Math.min(activePreview, Math.max(newImages.length - 1, 0)));
        setWarnings(prev => prev.filter(w => w.index !== index));
    };

    /* ── Drag reorder (thumbnail) ── */
    const handleThumbDragStart = (e: React.DragEvent, index: number) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Use a transparent image so the default ghost isn't shown
        const ghost = document.createElement("div");
        ghost.style.opacity = "0";
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
    };

    const handleThumbDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIndex !== null && dragIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleThumbDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        if (dragIndex !== null && dragIndex !== toIndex) {
            const newImages = [...images];
            const [moved] = newImages.splice(dragIndex, 1);
            newImages.splice(toIndex, 0, moved);
            onImagesChange(newImages);
            setActivePreview(toIndex);
        }
        setDragIndex(null);
        setDragOverIndex(null);
    };

    const handleThumbDragEnd = () => {
        setDragIndex(null);
        setDragOverIndex(null);
    };

    return (
        <>
            <div className={`pms-section${isOpen ? " pms-open" : ""}`}>
                {/* ── Accordion Header ── */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="pms-header"
                >
                    <div className="pms-header-left">
                        <span className={`pms-num${isOpen ? " pms-num-active" : ""}`}>
                            {sectionNum}
                        </span>
                        <div>
                            <span className="pms-title">Product Media</span>
                            {!isOpen && images.length > 0 && (
                                <span className="pms-title-count">{images.length} image{images.length !== 1 ? "s" : ""}</span>
                            )}
                        </div>
                    </div>
                    <span className={`pms-arrow${isOpen ? " pms-arrow-open" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </button>

                {/* ── Body ── */}
                <div
                    className="pms-body"
                    style={{
                        maxHeight: isOpen ? `${contentHeight + 120}px` : "0px",
                        opacity: isOpen ? 1 : 0,
                    }}
                >
                    <div ref={contentRef} className="pms-inner" onPaste={handlePaste}>

                        {/* ── Hero Preview ── */}
                        {images.length > 0 && (
                            <div className="pms-preview-area">
                                <div className="pms-preview-container">
                                    <img
                                        src={images[activePreview] || images[0]}
                                        alt={`Product image ${activePreview + 1}`}
                                        className="pms-preview-img"
                                    />
                                    {/* Image counter */}
                                    <div className="pms-preview-counter">
                                        {activePreview + 1} / {images.length}
                                    </div>
                                    {/* Hero badge */}
                                    {activePreview === 0 && (
                                        <div className="pms-hero-badge">HERO IMAGE</div>
                                    )}
                                    {/* Nav arrows */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                className="pms-nav pms-nav-prev"
                                                onClick={() => setActivePreview(i => Math.max(0, i - 1))}
                                                disabled={activePreview === 0}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                                            </button>
                                            <button
                                                type="button"
                                                className="pms-nav pms-nav-next"
                                                onClick={() => setActivePreview(i => Math.min(images.length - 1, i + 1))}
                                                disabled={activePreview === images.length - 1}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Thumbnail Strip ── */}
                        {images.length > 0 && (
                            <div className="pms-thumbs">
                                {images.map((img, i) => (
                                    <div
                                        key={`${img}-${i}`}
                                        className={`pms-thumb${i === activePreview ? " pms-thumb-active" : ""}${dragOverIndex === i ? " pms-thumb-dragover" : ""}${dragIndex === i ? " pms-thumb-dragging" : ""}`}
                                        draggable
                                        onDragStart={(e) => handleThumbDragStart(e, i)}
                                        onDragOver={(e) => handleThumbDragOver(e, i)}
                                        onDrop={(e) => handleThumbDrop(e, i)}
                                        onDragEnd={handleThumbDragEnd}
                                        onClick={() => setActivePreview(i)}
                                    >
                                        <img src={img} alt="" className="pms-thumb-img" />
                                        {i === 0 && <div className="pms-thumb-hero">①</div>}
                                        <button
                                            type="button"
                                            className="pms-thumb-delete"
                                            onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                        >
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                        <div className="pms-thumb-drag-hint">
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>
                                        </div>
                                    </div>
                                ))}

                                {/* Add more button */}
                                {images.length < maxImages && (
                                    <button
                                        type="button"
                                        className="pms-thumb-add"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Drop Zone (show when no images or as add-more) ── */}
                        {images.length === 0 && (
                            <div
                                className={`pms-dropzone${dragOver ? " pms-dropzone-active" : ""}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                            >
                                <div className="pms-dropzone-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <p className="pms-dropzone-title">
                                    {uploading ? "Uploading..." : "Drop images here"}
                                </p>
                                <p className="pms-dropzone-subtitle">
                                    or click to browse · JPEG, PNG, WebP · Max 10MB
                                </p>
                                <p className="pms-dropzone-hint">
                                    Up to {maxImages} images · First image becomes hero
                                </p>
                            </div>
                        )}

                        {/* ── Upload Progress ── */}
                        {uploading && (
                            <div className="pms-progress">
                                <div className="pms-progress-bar">
                                    <div
                                        className="pms-progress-fill"
                                        style={{ width: `${uploadProgress.percent}%` }}
                                    />
                                </div>
                                <div className="pms-progress-info">
                                    <div className="pms-progress-spinner" />
                                    <span>Uploading {uploadProgress.current} of {uploadProgress.total}</span>
                                </div>
                            </div>
                        )}

                        {/* ── Warnings ── */}
                        {warnings.length > 0 && (
                            <div className="pms-warnings">
                                {warnings.map((w, i) => (
                                    <div key={i} className="pms-warning">
                                        <span className="pms-warning-icon">
                                            {w.type === "quality" ? "📐" : w.type === "aspect" ? "↔️" : "📦"}
                                        </span>
                                        <span className="pms-warning-text">{w.message}</span>
                                        <button
                                            type="button"
                                            className="pms-warning-close"
                                            onClick={() => setWarnings(prev => prev.filter((_, j) => j !== i))}
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── Error ── */}
                        {error && (
                            <div className="pms-error">
                                <span>{error}</span>
                                <button type="button" onClick={() => setError("")} className="pms-error-close">×</button>
                            </div>
                        )}

                        {/* ── Divider ── */}
                        <div className="pms-divider" />

                        {/* ── Image Settings ── */}
                        <div className="pms-settings">
                            <p className="pms-settings-label">Image Settings</p>
                            <div className="pms-settings-grid">
                                <div className="pms-field">
                                    <label className="pms-label">Image Style Preset</label>
                                    <div className="pms-select-wrapper">
                                        <select
                                            value={imageStylePreset}
                                            onChange={(e) => onSettingsChange("image_style_preset", e.target.value)}
                                            className="pms-select"
                                        >
                                            {IMAGE_PRESETS.map(p => <option key={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="pms-field">
                                    <label className="pms-label">Watermark Strength</label>
                                    <div className="pms-select-wrapper">
                                        <select
                                            value={watermarkStrength}
                                            onChange={(e) => onSettingsChange("watermark_strength", e.target.value)}
                                            className="pms-select"
                                        >
                                            {WATERMARK_OPTIONS.map(w => <option key={w}>{w}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Upload Info ── */}
                        <div className="pms-info-bar">
                            <span>{images.length}/{maxImages} images uploaded</span>
                            {images.length > 0 && <span>Drag thumbnails to reorder</span>}
                        </div>

                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={e => e.target.files && handleFiles(e.target.files)}
                style={{ display: "none" }}
            />
        </>
    );
}
