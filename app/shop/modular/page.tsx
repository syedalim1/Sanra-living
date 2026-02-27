import CategoryPage from "../CategoryPage";

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
