import type { GetStaticPaths, GetStaticProps } from "next";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";
import {
  getAllCategorizedProducts,
  getProductByHandle,
  getAvailableVariantCount,
} from "@/lib/shopify";
import { createCheckoutUrl } from "@/lib/shopify-storefront";
import { getRecommendations, RecommendedProduct } from "@/lib/recommendations";
import { ShopifyProduct, ShopifyVariant } from "@/types";

interface ProductDetailProps {
  product: ShopifyProduct;
  categoryHandle: string;
  categoryLabel: string;
  recommendations: RecommendedProduct[];
  sanitizedBodyHtml: string;
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (isNaN(num) || num <= 0) return "";
  return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
}

function findVariant(
  product: ShopifyProduct,
  selectedOptions: Record<string, string>,
): ShopifyVariant | undefined {
  // For single-variant products (e.g. "Default Title"), return it directly
  if (product.variants.length === 1) return product.variants[0];

  return product.variants.find((v) =>
    product.options.every((opt, i) => {
      const selected = selectedOptions[opt.name];
      // Skip options that aren't tracked (e.g. hidden "Title" option)
      if (!selected) return true;
      const key = `option${i + 1}` as "option1" | "option2" | "option3";
      return v[key] === selected;
    }),
  );
}

export default function ProductDetailPage({
  product,
  categoryHandle,
  categoryLabel,
  recommendations,
  sanitizedBodyHtml,
}: ProductDetailProps) {
  const img = product.images[0]?.src;
  const variantCount = getAvailableVariantCount(product);

  // Options that are meaningful to display (filter out default/title)
  const displayOptions = product.options?.filter(
    (o) => o.name.toLowerCase() !== "title" && o.values[0] !== "Default Title",
  );

  // Initialize selected options from the first available variant
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const firstAvailable = product.variants.find((v) => v.available !== false);
    const defaults: Record<string, string> = {};

    if (firstAvailable && product.options) {
      product.options.forEach((opt, i) => {
        const key = `option${i + 1}` as "option1" | "option2" | "option3";
        if (firstAvailable[key]) defaults[opt.name] = firstAvailable[key]!;
      });
    }

    return defaults;
  });

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedVariant = findVariant(product, selectedOptions);
  const selectedPrice = selectedVariant
    ? formatPrice(selectedVariant.price)
    : "";

  async function handlePurchase() {
    if (!selectedVariant || selectedVariant.available === false) return;
    setLoading(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckoutUrl(selectedVariant.id, quantity);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Checkout failed: ${message}`);
      setLoading(false);
    }
  }

  return (
    <DefaultLayout
      description={`Shop ${product.title} from ${product.vendor || "Uncut Packaging"}. ${categoryLabel} and PPE supplies.`}
      title={product.title}
    >
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#FAFAF9]" />
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-zinc-300 opacity-20 blur-[140px]" />
      </div>

      {/* Breadcrumb */}
      <nav className="pt-6 pb-2 flex flex-wrap items-center gap-1 text-xs font-semibold uppercase tracking-wider text-default-400">
        <NextLink className="hover:text-primary transition-colors py-2 inline-flex items-center" href="/">
          Home
        </NextLink>
        <span>/</span>
        <NextLink
          className="hover:text-primary transition-colors py-2 inline-flex items-center"
          href="/products"
        >
          Products
        </NextLink>
        <span>/</span>
        <NextLink
          className="hover:text-primary transition-colors py-2 inline-flex items-center"
          href={`/products?category=${categoryHandle}`}
        >
          {categoryLabel}
        </NextLink>
        <span>/</span>
        <span className="text-foreground truncate max-w-[120px] sm:max-w-none py-2 inline-flex items-center">{product.title}</span>
      </nav>

      {/* Product Detail */}
      <section className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden border border-divider bg-stone-50">
            {img ? (
              <Image
                fill
                priority
                alt={product.title}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                src={img}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-default-200 text-8xl">
                ◆
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* Category + vendor */}
            <div className="flex items-center gap-3">
              <Chip
                as={NextLink}
                className="text-[10px] font-semibold uppercase tracking-widest cursor-pointer"
                color="primary"
                href={`/products?category=${categoryHandle}`}
                radius="none"
                size="md"
                variant="bordered"
              >
                {categoryLabel}
              </Chip>
              {product.vendor && (
                <span className="text-xs font-semibold uppercase tracking-widest text-default-400">
                  {product.vendor}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-foreground leading-snug">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {selectedPrice ? (
                <span className="text-2xl font-bold text-primary">
                  {selectedPrice}
                </span>
              ) : (
                <Link
                  className="text-sm text-primary font-medium uppercase tracking-wider"
                  href={siteConfig.links.contact}
                >
                  Contact for pricing
                </Link>
              )}
              {variantCount > 1 && (
                <span className="text-xs text-default-400 uppercase tracking-wide">
                  {variantCount} options available
                </span>
              )}
            </div>

            {/* Variant Options */}
            {displayOptions && displayOptions.length > 0 && (
              <div className="flex flex-col gap-3 pt-1">
                {displayOptions.map((opt) => (
                  <div key={opt.name}>
                    <p className="text-xs font-bold uppercase tracking-widest text-default-400 mb-2">
                      {opt.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => (
                        <button
                          key={val}
                          className={`border px-3 py-2.5 min-h-[44px] inline-flex items-center text-sm font-semibold uppercase tracking-wide transition-colors ${
                            selectedOptions[opt.name] === val
                              ? "border-primary text-primary bg-primary/5"
                              : "border-divider text-foreground hover:border-default-400"
                          }`}
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [opt.name]: val,
                            }))
                          }
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="pt-1">
              <p className="text-xs font-bold uppercase tracking-widest text-default-400 mb-2">
                Quantity
              </p>
              <div className="inline-flex items-center border border-divider">
                <button
                  className="px-3 py-2.5 min-h-[44px] text-sm font-bold text-foreground hover:bg-default-100 transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="px-4 py-2.5 min-h-[44px] inline-flex items-center text-sm font-bold tabular-nums text-foreground border-x border-divider min-w-[48px] justify-center">
                  {quantity}
                </span>
                <button
                  className="px-3 py-2.5 min-h-[44px] text-sm font-bold text-foreground hover:bg-default-100 transition-colors"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Description */}
            {sanitizedBodyHtml && (
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizedBodyHtml,
                }}
                className="text-sm text-default-500 leading-relaxed prose prose-sm max-w-none border-t border-divider pt-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1"
              />
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-divider">
              <Button
                className="font-semibold uppercase tracking-wider flex-1"
                color="primary"
                isDisabled={!selectedVariant || selectedVariant.available === false}
                isLoading={loading}
                radius="none"
                size="lg"
                onPress={handlePurchase}
              >
                {selectedVariant && selectedVariant.available !== false ? "Purchase" : "Unavailable"}
              </Button>
              <Button
                isExternal
                as={Link}
                className="font-semibold uppercase tracking-wider flex-1 border-default-400 text-foreground hover:border-primary hover:text-primary"
                href={siteConfig.links.contact}
                radius="none"
                size="lg"
                variant="bordered"
              >
                Get a Quote
              </Button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="border-t border-divider py-16 md:py-20">
          <div className="mb-8">
            <h2 className={title({ size: "md", fullWidth: true })}>
              <span className={title({ size: "md" })}>Frequently </span>
              <span className={title({ color: "steel", size: "md" })}>
                Bought Together
              </span>
            </h2>
            <p className="text-sm text-default-400 uppercase tracking-wider mt-2">
              Products that pair well with {product.title}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recommendations.map((rec) => (
              <NextLink
                key={rec.id}
                className="group flex flex-col"
                href={`/products/${rec.handle}`}
              >
                {/* Bundle label */}
                <div className="mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {rec.bundleLabel}
                  </span>
                </div>
                {/* Image */}
                <div className="relative aspect-square overflow-hidden border border-divider bg-stone-50 transition-colors group-hover:border-primary">
                  {rec.imageSrc ? (
                    <Image
                      fill
                      alt={rec.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                      src={rec.imageSrc}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-default-200 text-4xl">
                      ◆
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="pt-2 px-0.5 flex flex-col gap-0.5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-default-400">
                    {rec.categoryLabel}
                  </p>
                  <p className="text-sm font-bold uppercase tracking-wide leading-snug line-clamp-2 text-foreground">
                    {rec.title}
                  </p>
                  {rec.minPrice && (
                    <p className="text-xs font-bold text-primary mt-0.5">
                      From {rec.minPrice}
                    </p>
                  )}
                </div>
              </NextLink>
            ))}
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getAllCategorizedProducts();
  const handles: string[] = [];
  const seen = new Set<string>();

  for (const cat of categories) {
    for (const p of cat.products) {
      if (!seen.has(p.handle)) {
        seen.add(p.handle);
        handles.push(p.handle);
      }
    }
  }

  return {
    paths: handles.map((handle) => ({ params: { handle } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ProductDetailProps> = async ({
  params,
}) => {
  const handle = params?.handle as string;

  // Fetch the specific product directly — 1 API call instead of 7
  const product = await getProductByHandle(handle);
  if (!product) return { notFound: true };

  // Find which collection this product belongs to — up to 7 calls but stops early
  const categories = await getAllCategorizedProducts();
  let categoryHandle = "";
  let categoryLabel = "";
  for (const cat of categories) {
    if (cat.products.some((p) => p.id === product.id)) {
      categoryHandle = cat.handle;
      categoryLabel = cat.label;
      break;
    }
  }

  const recommendations = getRecommendations(product.id, categoryHandle, categories);

  const { sanitizeHtml } = await import("@/lib/sanitize");
  const sanitizedBodyHtml = product.body_html ? sanitizeHtml(product.body_html) : "";

  return {
    props: { product, categoryHandle, categoryLabel, recommendations, sanitizedBodyHtml },
    revalidate: 3600,
  };
};
