import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Steel Balcony & Outdoor Furniture in India – Garden, Patio & Terrace",
    description: "Premium steel balcony furniture, planter stands, drying stands & outdoor racks. Weather-resistant powder-coated finish for Indian balconies, gardens & terraces. Delivered across India.",
    alternates: { canonical: "/shop/balcony-outdoor" },
    openGraph: { title: "Balcony & Outdoor Steel Furniture – SANRA LIVING", description: "Weather-resistant steel furniture for balconies, gardens & terraces.", url: "/shop/balcony-outdoor" },
};

export default function BalconyOutdoorPage() {
    return (
        <CategoryPage
            config={{
                slug: "balcony-outdoor",
                name: "Balcony & Outdoor",
                description: "Garden, patio & terrace furniture built to weather every season.",
                dbCategories: ["Balcony & Outdoor", "Outdoor"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Balcony Table", "Planter Stand", "Drying Stand", "Outdoor Rack"] },
                ],
            }}
        />
    );
}
