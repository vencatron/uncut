import type { GetStaticPaths, GetStaticProps } from "next";

import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  getAllCategorizedProducts,
  getMinPrice,
  getAvailableVariantCount,
} from "@/lib/shopify";
import { getRecommendations, RecommendedProduct } from "@/lib/recommendations";
import { ShopifyProduct } from "@/types";

interface ProductDetailProps {
  product: ShopifyProduct;
  categoryHandle: string;
  categoryLabel: string;
  recommendations: RecommendedProduct[];
}

export default function ProductDetailPage({
  product,
  categoryHandle,
  categoryLabel,
  recommendations,
}: ProductDetailProps) {
  const img = product.images[0]?.src;
  const price = getMinPrice(product);
  const variantCount = getAvailableVariantCount(product);

  // Group options for display
  const displayOptions = product.options?.filter(
    (o) => o.name.toLowerCase() !== "title" && o.values[0] !== "Default Title",
  );

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
      <nav className="pt-6 pb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-default-400">
        <NextLink className="hover:text-primary transition-colors" href="/">
          Home
        </NextLink>
        <span>/</span>
        <NextLink
          className="hover:text-primary transition-colors"
          href="/products"
        >
          Products
        </NextLink>
        <span>/</span>
        <NextLink
          className="hover:text-primary transition-colors"
          href={`/products?category=${categoryHandle}`}
        >
          {categoryLabel}
        </NextLink>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{product.title}</span>
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
                size="sm"
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
              {price ? (
                <span className="text-2xl font-bold text-primary">
                  From {price}
                </span>
              ) : (
                <span className="text-sm text-default-400 uppercase tracking-wider">
                  Contact for pricing
                </span>
              )}
              {variantCount > 1 && (
                <span className="text-xs text-default-400 uppercase tracking-wide">
                  {variantCount} options available
                </span>
              )}
            </div>

            {/* Options */}
            {displayOptions && displayOptions.length > 0 && (
              <div className="flex flex-col gap-3 pt-1">
                {displayOptions.map((opt) => (
                  <div key={opt.name}>
                    <p className="text-xs font-bold uppercase tracking-widest text-default-400 mb-2">
                      {opt.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => (
                        <span
                          key={val}
                          className="border border-divider px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground"
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {product.body_html && (
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(product.body_html),
                }}
                className="text-sm text-default-500 leading-relaxed prose prose-sm max-w-none border-t border-divider pt-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1"
              />
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-divider">
              <Button
                isExternal
                as={Link}
                className="font-semibold uppercase tracking-wider flex-1"
                color="primary"
                href={siteConfig.links.contact}
                radius="none"
                size="lg"
              >
                Get a Quote
              </Button>
              <Button
                isExternal
                as={Link}
                className="font-semibold uppercase tracking-wider flex-1 border-default-400 text-foreground hover:border-primary hover:text-primary"
                href={siteConfig.links.store}
                radius="none"
                size="lg"
                variant="bordered"
              >
                View on Store
              </Button>
            </div>
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
            {recommendations.map((rec) => {
              const recImg = rec.images[0]?.src;
              const recPrice = getMinPrice(rec);

              return (
                <NextLink
                  key={rec.id}
                  className="group flex flex-col"
                  href={`/products/${rec.handle}`}
                >
                  {/* Bundle label */}
                  <div className="mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                      {rec.bundleLabel}
                    </span>
                  </div>
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden border border-divider bg-stone-50 transition-colors group-hover:border-primary">
                    {recImg ? (
                      <Image
                        fill
                        alt={rec.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                        src={recImg}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-default-200 text-4xl">
                        ◆
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="pt-2 px-0.5 flex flex-col gap-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-default-400">
                      {rec.categoryLabel}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wide leading-snug line-clamp-2 text-foreground">
                      {rec.title}
                    </p>
                    {recPrice && (
                      <p className="text-xs font-bold text-primary mt-0.5">
                        From {recPrice}
                      </p>
                    )}
                  </div>
                </NextLink>
              );
            })}
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
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ProductDetailProps> = async ({
  params,
}) => {
  const handle = params?.handle as string;
  const categories = await getAllCategorizedProducts();

  let product: ShopifyProduct | null = null;
  let categoryHandle = "";
  let categoryLabel = "";

  for (const cat of categories) {
    const found = cat.products.find((p) => p.handle === handle);

    if (found) {
      product = found;
      categoryHandle = cat.handle;
      categoryLabel = cat.label;
      break;
    }
  }

  if (!product) return { notFound: true };

  const recommendations = getRecommendations(
    product,
    categoryHandle,
    categories,
  );

  return {
    props: { product, categoryHandle, categoryLabel, recommendations },
    revalidate: 3600,
  };
};
