import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Modern Steel Tables in India – Dining, Coffee, Study & Work Desks | SANRA LIVING",
    description: "Premium steel tables including dining tables, coffee tables, study desks, laptop tables & TV unit frames. Precision-crafted with powder-coated finishes. Delivered across India.",
    alternates: { canonical: "https://www.sanraliving.com/shop/tables" },
    openGraph: { title: "Steel Tables – SANRA LIVING", description: "Dining, coffee, study & work tables in premium steel.", url: "https://www.sanraliving.com/shop/tables" },
};

export default function TablesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Modern Steel Tables",
        "description": "Premium steel tables including dining tables, coffee tables, study desks, laptop tables & TV unit frames. Precision-crafted with powder-coated finishes.",
        "url": "https://www.sanraliving.com/shop/tables",
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
                { "@type": "ListItem", "position": 3, "name": "Tables", "item": "https://www.sanraliving.com/shop/tables" }
            ]
        }
    };

    return (
        <>
            <Script id="tables-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <CategoryPage
                config={{
                    slug: "tables",
                    name: "Tables",
                    description: "Dining, coffee, side & work tables crafted from precision steel.",
                    dbCategories: ["Tables", "Study Desks"],
                    extraFilters: [
                        { title: "Type", key: "type", options: ["Study Table", "Computer Table", "Work Desk", "Laptop Table", "Dining Table", "Coffee Table", "TV Unit Frame"] },
                        { title: "Size", key: "size", options: ["Compact", "Full Size"] },
                    ],
                }}
            />
        </>
    );
}
