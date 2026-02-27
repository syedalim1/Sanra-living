import type { Metadata } from "next";
import CategoryPage from "../CategoryPage";

export const metadata: Metadata = {
    title: "Steel Storage Racks & Shelves in India – Shoe Rack, Book Shelf & More",
    description: "Premium steel shoe racks, utility racks, wall shelves, console tables, book shelves, plant stands & organizers. Multiple tier options with modern industrial design. Delivered across India.",
    alternates: { canonical: "/shop/storage" },
    openGraph: { title: "Steel Storage – SANRA LIVING", description: "Shoe racks, wall shelves, organizers & utility racks in premium steel.", url: "/shop/storage" },
};

export default function StoragePage() {
    return (
        <CategoryPage
            config={{
                slug: "storage",
                name: "Storage",
                description: "Racks, shelves, organizers & utility systems in structural steel.",
                dbCategories: ["Storage", "Entryway Storage", "Wall Storage"],
                extraFilters: [
                    { title: "Type", key: "type", options: ["Shoe Rack", "Utility Rack", "Wall Shelf", "Console Table", "Book Shelf", "Magazine Rack", "Plant Stand", "Key Holder", "Under Desk Organizer"] },
                    { title: "Mounting", key: "mounting", options: ["Wall Mounted", "Floor Standing"] },
                    { title: "Size", key: "size", options: ["Compact", "Large"] },
                ],
            }}
        />
    );
}
