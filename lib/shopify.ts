import { ShopifyProduct, ProductCollection } from "@/types";

const STORE_URL = "https://uncutpackaging.com";

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return fallback;

    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

function mapProductsImages(products: ShopifyProduct[]): ShopifyProduct[] {
  return products;
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const data = await safeFetch<{ products: ShopifyProduct[] }>(
    `${STORE_URL}/products.json?limit=250`,
    { products: [] },
  );

  return mapProductsImages(data.products);
}

export async function getCollectionProducts(
  handle: string,
): Promise<ShopifyProduct[]> {
  const data = await safeFetch<{ products: ShopifyProduct[] }>(
    `${STORE_URL}/collections/${handle}/products.json?limit=250`,
    { products: [] },
  );

  return mapProductsImages(data.products);
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
