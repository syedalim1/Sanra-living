import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Modern Steel Chairs & Seating in India",
    description: "Explore premium steel chairs, arm chairs, cushion chairs, benches & stools. Dismantlable, powder-coated seating with modern industrial design. State-wise delivery across India.",
    alternates: { canonical: "/shop/seating" },
    openGraph: { title: "Steel Seating – SANRA LIVING", description: "Premium steel chairs & seating for modern Indian homes.", url: "/shop/seating" },
};

export default function SeatingPage() {
    return (
        <CategoryPage
            config={{
                slug: "seating",
                name: "Seating",
                description: "Chairs, stools & lounge systems engineered from structural steel.",
                dbCategories: ["Seating"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Chair", "Arm Chair", "Cushion Chair", "Bench", "Stool"] },
                    { title: "Cushion", key: "cushion", options: ["With Cushion", "Without Cushion"] },
                ],
            }}
        />
    );
}
