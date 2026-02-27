import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "CNC Cut Steel Decor & Custom Furniture India – Wall Art, Name Plates & Panels",
    description: "Bespoke CNC-cut steel wall art, name plates, partition panels & logo boards. Custom metal fabrication with premium finishes for homes and businesses. Delivered across India.",
    alternates: { canonical: "/shop/cnc-decor" },
    openGraph: { title: "CNC & Custom Steel – SANRA LIVING", description: "CNC-cut wall art, name plates & custom partition panels.", url: "/shop/cnc-decor" },
};

export default function CncDecorPage() {
    return (
        <CategoryPage
            config={{
                slug: "cnc-decor",
                name: "CNC & Custom",
                description: "Bespoke CNC-cut wall art, name plates, partition panels & logo boards.",
                dbCategories: ["CNC & Decor", "CNC & Custom", "CNC"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["CNC Wall Art", "CNC Name Plates", "CNC Partition Panels", "CNC Logo Boards"] },
                ],
            }}
        />
    );
}
