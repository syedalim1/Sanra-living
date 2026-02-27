import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Commercial Steel Furniture India – Office, Hostel, Library & Retail",
    description: "Institutional-grade steel furniture for offices, hostels, libraries & retail spaces. Heavy-duty construction with bulk and reseller pricing. Delivered across India.",
    alternates: { canonical: "/shop/commercial" },
    openGraph: { title: "Commercial Steel Furniture – SANRA LIVING", description: "Institutional-grade steel furniture for offices, hostels & retail.", url: "/shop/commercial" },
};

export default function CommercialPage() {
    return (
        <CategoryPage
            config={{
                slug: "commercial",
                name: "Commercial",
                description: "Institutional-grade furniture for offices, hostels, libraries & retail spaces.",
                dbCategories: ["Commercial"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Hostel Bunk Frame", "Library Rack", "Retail Display Rack", "Institutional Desk"] },
                ],
            }}
        />
    );
}
