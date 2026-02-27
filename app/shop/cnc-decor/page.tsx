import CategoryPage from "../CategoryPage";

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
