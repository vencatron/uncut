import {
  ShopifyProduct,
  ProductCollection,
  SlimProduct,
  SlimProductCollection,
} from "@/types";

const STORE_URL = "https://uncutpackaging.com";

/**
 * Creates a slim version of a product for listing pages.
 * Strips body_html, extra images, and variant details to reduce page data size.
 */
export function slimProduct(product: ShopifyProduct): SlimProduct {
  const firstImage = product.images[0];
  const availableVariants = product.variants.filter((v) => v.available);
  const prices = availableVariants
    .map((v) => parseFloat(v.price))
    .filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    imageSrc: firstImage?.src ?? null,
    minPrice:
      minPrice !== null
        ? `$${minPrice % 1 === 0 ? minPrice.toFixed(0) : minPrice.toFixed(2)}`
        : null,
    variantCount: availableVariants.length,
  };
}

/**
 * Creates slim product collections for listing pages.
 */
export function slimCollection(
  collection: ProductCollection,
): SlimProductCollection {
  return {
    handle: collection.handle,
    label: collection.label,
    products: collection.products.map(slimProduct),
  };
}

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return fallback;

    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getCollectionProducts(
  handle: string,
): Promise<ShopifyProduct[]> {
  const data = await safeFetch<{ products: ShopifyProduct[] }>(
    `${STORE_URL}/collections/${handle}/products.json?limit=250`,
    { products: [] },
  );

  return data.products;
}

export const COLLECTIONS: {
  handle: string;
  label: string;
  description: string;
}[] = [
  {
    handle: "aprons-gowns-coats",
    label: "Aprons & Coats",
    description:
      "Coveralls, isolation gowns, lab coats, vinyl and polyethylene aprons.",
  },
  {
    handle: "foot-protection",
    label: "Foot Protection",
    description:
      "Shoe covers, boot covers, and foot protection for any environment.",
  },
  {
    handle: "gloves",
    label: "Gloves",
    description: "Nitrile, latex, polyethylene, and chemical-resistant gloves.",
  },
  {
    handle: "head-eye",
    label: "Head & Eye",
    description: "Hard hats, eyewear, respirators, hairnets, hoods, and more.",
  },
  {
    handle: "tape",
    label: "Tape",
    description:
      "Acrylic, hot melt, filament, electrical, masking, and specialty tapes.",
  },
  {
    handle: "ribbon",
    label: "TTR Ribbon",
    description:
      "Thermal transfer ribbons for barcode printing — wax, wax-resin, and full resin.",
  },
  {
    handle: "labels",
    label: "Labels",
    description:
      "Thermal, direct thermal, and pressure-sensitive labels in a range of sizes.",
  },
];

export async function getAllCategorizedProducts(): Promise<
  ProductCollection[]
> {
  const results = await Promise.all(
    COLLECTIONS.map(async (col) => ({
      handle: col.handle,
      label: col.label,
      products: await getCollectionProducts(col.handle),
    })),
  );

  return results;
}

export function getMinPrice(product: ShopifyProduct): string {
  const prices = product.variants
    .filter((v) => v.available)
    .map((v) => parseFloat(v.price))
    .filter((p) => p > 0);

  if (!prices.length) return "";
  const min = Math.min(...prices);

  return `$${min % 1 === 0 ? min.toFixed(0) : min.toFixed(2)}`;
}

export function getAvailableVariantCount(product: ShopifyProduct): number {
  return product.variants.filter((v) => v.available).length;
}
