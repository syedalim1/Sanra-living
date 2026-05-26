const { writeFileSync } = require('fs');

async function fetchProducts() {
    const supabaseUrl = "https://pgenqwvkiwvleoleyvrg.supabase.co";
    const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZW5xd3ZraXd2bGVvbGV5dnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjEwMjcsImV4cCI6MjA4NzUzNzAyN30.yRx3k15Qol8nN6RBx-9YUxr-UH5xmLsjHvmRwGu7w70";
    
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
            headers: {
                "apikey": anonKey,
                "Authorization": `Bearer ${anonKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        
        const products = await response.json();
        console.log(`Fetched ${products.length} products successfully.`);
        
        // Write to a local JSON file for easy viewing
        writeFileSync('./scratch/products_dump.json', JSON.stringify(products, null, 2));
        
        // Output summary in console
        products.forEach(p => {
            console.log(`- Product: ${p.title} (${p.category})`);
            console.log(`  Image: ${p.image_url}`);
            console.log(`  Hover Image: ${p.hover_image_url}`);
            console.log(`  Other: ${[p.image_1, p.image_2, p.image_3, p.image_4, p.image_5].filter(Boolean).join(', ')}`);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

fetchProducts();
