const { readdirSync, readFileSync, statSync } = require('fs');
const { join } = require('path');

const shopDir = 'd:\\Downloads\\Sanra-living\\app\\shop';

function findCategoryPages(dir) {
    const items = readdirSync(dir);
    for (const item of items) {
        if (item === '[id]' || item === 'components') continue;
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            const pagePath = join(fullPath, 'page.tsx');
            try {
                if (statSync(pagePath).isFile()) {
                    const content = readFileSync(pagePath, 'utf8');
                    console.log(`\n--- Found Category Page: ${item} ---`);
                    // Extract name and dbCategories from config
                    const configMatch = content.match(/config=\{\s*([\s\S]*?)\s*\}/);
                    if (configMatch) {
                        console.log(`Config:\n${configMatch[1].trim()}`);
                    } else {
                        console.log("No config found or page is different.");
                    }
                }
            } catch (e) {
                // page.tsx doesn't exist in this directory
            }
        }
    }
}

findCategoryPages(shopDir);
