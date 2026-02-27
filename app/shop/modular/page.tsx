import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Modular Steel Furniture Systems in India – Expandable & Configurable",
    description: "Premium modular steel furniture including closet systems, kitchen racks, wall grid panels & expandable storage units. Configurable designs that grow with your space. Delivered across India.",
    alternates: { canonical: "/shop/modular" },
    openGraph: { title: "Modular Steel Systems – SANRA LIVING", description: "Expandable, configurable steel furniture systems.", url: "/shop/modular" },
};

export default function ModularPage() {
    return (
        <CategoryPage
            config={{
                slug: "modular",
                name: "Modular Systems",
                description: "Expandable, configurable units that grow with your space.",
                dbCategories: ["Modular", "Modular Systems"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Modular Closet System", "Modular Kitchen Rack", "Wall Grid Panel", "Expandable Storage Units"] },
                ],
            }}
        />
    );
}
