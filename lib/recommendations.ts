import { ShopifyProduct, ProductCollection } from "@/types";

// Maps each category to complementary categories and a human-readable bundle reason
const BUNDLE_MAP: Record<string, { handle: string; label: string }[]> = {
  gloves: [
    { handle: "aprons-gowns-coats", label: "Pair with body protection" },
    { handle: "foot-protection", label: "Complete your PPE kit" },
    { handle: "head-eye", label: "Head-to-toe coverage" },
  ],
  "aprons-gowns-coats": [
    { handle: "gloves", label: "Add hand protection" },
    { handle: "foot-protection", label: "Complete your protection" },
    { handle: "head-eye", label: "Add head & eye protection" },
  ],
  "foot-protection": [
    { handle: "gloves", label: "Add hand protection" },
    { handle: "aprons-gowns-coats", label: "Pair with body protection" },
    { handle: "head-eye", label: "Complete your kit" },
  ],
  "head-eye": [
    { handle: "gloves", label: "Add hand protection" },
    { handle: "aprons-gowns-coats", label: "Pair with body protection" },
    { handle: "foot-protection", label: "Complete your kit" },
  ],
  tape: [
    { handle: "tape", label: "Other tape types" },
    { handle: "labels", label: "Complete your labeling setup" },
    { handle: "ribbon", label: "Add thermal transfer ribbon" },
  ],
  ribbon: [
    { handle: "labels", label: "Pair with labels" },
    { handle: "tape", label: "Add packaging tape" },
    { handle: "ribbon", label: "Other ribbon types" },
  ],
  labels: [
    { handle: "ribbon", label: "Pair with TTR ribbon" },
    { handle: "tape", label: "Add packaging tape" },
    { handle: "labels", label: "Other label sizes" },
  ],
};

export interface RecommendedProduct extends ShopifyProduct {
  categoryHandle: string;
  categoryLabel: string;
  bundleLabel: string;
}

export function getRecommendations(
  currentProduct: ShopifyProduct,
  currentCategoryHandle: string,
  categories: ProductCollection[],
  maxCount = 6,
): RecommendedProduct[] {
  const bundles = BUNDLE_MAP[currentCategoryHandle] ?? [];
  const recommendations: RecommendedProduct[] = [];
  const seen = new Set<number>([currentProduct.id]);

  for (const bundle of bundles) {
    const cat = categories.find((c) => c.handle === bundle.handle);

    if (!cat) continue;

    let picked = 0;

    for (const p of cat.products) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      recommendations.push({
        ...p,
        categoryHandle: cat.handle,
        categoryLabel: cat.label,
        bundleLabel: bundle.label,
      });
      picked++;
      if (picked >= 2) break;
    }

    if (recommendations.length >= maxCount) break;
  }

  return recommendations.slice(0, maxCount);
}
