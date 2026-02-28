import { MetadataRoute } from "next";

const BASE = "https://www.sanraliving.com";

const categories = [
    "seating", "tables", "storage", "bedroom", "workspace",
    "balcony-outdoor", "modular", "cnc-decor", "commercial",
];

const staticPages = [
    "/", "/shop", "/contact", "/track-order",
    "/about", "/warranty", "/terms", "/refund-policy",
    "/bulk-orders", "/shipping-policy", "/privacy-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date().toISOString();

    const pages: MetadataRoute.Sitemap = staticPages.map((path) => ({
        url: `${BASE}${path}`,
        lastModified: now,
        changeFrequency: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 1.0 : 0.8,
    }));

    // Category pages
    categories.forEach((slug) => {
        pages.push({
            url: `${BASE}/shop/${slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.85,
        });
    });

    // Dynamic product pages — fetch from API
    try {
        const res = await fetch(`${BASE}/api/products?limit=500`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            const products = data.products ?? data ?? [];
            products.forEach((p: { id: string; created_at?: string }) => {
                pages.push({
                    url: `${BASE}/shop/${p.id}`,
                    lastModified: p.created_at ?? now,
                    changeFrequency: "weekly",
                    priority: 0.7,
                });
            });
        }
    } catch {
        // Sitemap still works without dynamic products
    }

    return pages;
}
