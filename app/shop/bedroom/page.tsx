import CategoryPage from "../CategoryPage";

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
