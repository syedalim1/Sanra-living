import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Modern Steel Tables in India – Dining, Coffee, Study & Work Desks",
    description: "Premium steel tables including dining tables, coffee tables, study desks, laptop tables & TV unit frames. Precision-crafted with powder-coated finishes. Delivered across India.",
    alternates: { canonical: "/shop/tables" },
    openGraph: { title: "Steel Tables – SANRA LIVING", description: "Dining, coffee, study & work tables in premium steel.", url: "/shop/tables" },
};

export default function TablesPage() {
    return (
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
    );
}
