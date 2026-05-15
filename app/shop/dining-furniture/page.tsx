import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Steel Dining Furniture – Premium Dining Chairs & Table Sets | SANRA LIVING",
    description: "Modern steel dining chairs, dining table sets, and dining room furniture. Stainless steel and powder-coated finishes. Premium quality from Coimbatore steel furniture manufacturer.",
    keywords: [
        "dining furniture",
        "steel dining chairs",
        "stainless steel dining chairs",
        "steel dining table",
        "dining chairs Coimbatore",
        "premium dining chairs",
        "modern dining chairs India",
        "steel dining set",
        "dining room furniture steel",
    ],
    alternates: { canonical: "https://www.sanraliving.com/shop/dining-furniture" },
    openGraph: {
        title: "Steel Dining Furniture – SANRA LIVING",
        description: "Premium steel dining chairs and table sets. Modern designs with powder-coated finishes.",
        url: "https://www.sanraliving.com/shop/dining-furniture",
    },
};

export default function DiningFurniturePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Steel Dining Furniture",
        "description": "Premium steel dining chairs, tables, and complete dining sets for modern homes.",
        "url": "https://www.sanraliving.com/shop/dining-furniture",
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
                { "@type": "ListItem", "position": 3, "name": "Dining Furniture", "item": "https://www.sanraliving.com/shop/dining-furniture" }
            ]
        }
    };

    return (
        <>
            <Script id="dining-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <CategoryPage
                config={{
                    slug: "dining-furniture",
                    name: "Dining Furniture",
                    description: "Modern steel dining chairs, tables & complete dining sets.",
                    dbCategories: ["Seating", "Tables"],
                    extraFilters: [
                        { title: "Type", key: "type", options: ["Dining Chair", "Dining Table", "Chair Table Set", "Arm Chair", "Bench"] },
                    ],
                }}
            />
        </>
    );
}
