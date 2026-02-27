import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Steel Bedroom Furniture in India – Wardrobes, Cloth Racks & Side Tables",
    description: "Premium steel bedroom furniture including wardrobes, open wardrobes, cloth racks, side tables & modular closet systems. Dismantlable design with luxury finishes. Delivered across India.",
    alternates: { canonical: "/shop/bedroom" },
    openGraph: { title: "Steel Bedroom Furniture – SANRA LIVING", description: "Wardrobes, cloth racks & side tables in premium steel.", url: "/shop/bedroom" },
};

export default function BedroomPage() {
    return (
        <CategoryPage
            config={{
                slug: "bedroom",
                name: "Bedroom",
                description: "Beds, wardrobes, nightstands & closet systems in dismantlable steel.",
                dbCategories: ["Bedroom"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Steel Wardrobe", "Open Wardrobe", "Cloth Rack", "Side Table", "Modular Closet"] },
                ],
            }}
        />
    );
}
