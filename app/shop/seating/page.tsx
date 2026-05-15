import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Modern Steel Chairs & Seating | Premium Furniture India | SANRA LIVING",
    description: "Explore premium stainless steel chairs, dining chairs, arm chairs, benches & stools. Dismantlable, powder-coated seating with modern industrial design. State-wise delivery across India.",
    alternates: { canonical: "https://www.sanraliving.com/shop/seating" },
    openGraph: { title: "Steel Seating – SANRA LIVING", description: "Premium steel chairs & seating for modern Indian homes.", url: "https://www.sanraliving.com/shop/seating" },
};

export default function SeatingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Modern Steel Chairs & Seating",
        "description": "Explore premium stainless steel chairs, dining chairs, arm chairs, benches & stools. Dismantlable, powder-coated seating with modern industrial design.",
        "url": "https://www.sanraliving.com/shop/seating",
        "isPartOf": {
            "@type": "WebSite",
            "name": "SANRA LIVING",
            "url": "https://www.sanraliving.com/"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sanraliving.com/" },
                { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.sanraliving.com/shop" },
                { "@type": "ListItem", "position": 3, "name": "Seating", "item": "https://www.sanraliving.com/shop/seating" }
            ]
        }
    };

    return (
        <>
            <Script id="seating-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <CategoryPage
                config={{
                    slug: "seating",
                    name: "Steel Chairs & Seating",
                    description: "Minimalist chairs, stools & lounge systems engineered from structural steel. Perfect for home, dining, and commercial use.",
                    dbCategories: ["Seating"],
                    extraFilters: [
                        { title: "Type", key: "type", options: ["Chair", "Arm Chair", "Cushion Chair", "Bench", "Stool"] },
                        { title: "Cushion", key: "cushion", options: ["With Cushion", "Without Cushion"] },
                    ],
                }}
            />
        </>
    );
}
