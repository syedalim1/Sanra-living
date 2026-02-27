import CategoryPage from "../CategoryPage";

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
