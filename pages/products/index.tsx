import type { GetStaticProps } from "next";

import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";
import {
  getAllCategorizedProducts,
  COLLECTIONS,
  getMinPrice,
  getAvailableVariantCount,
} from "@/lib/shopify";
import { ProductCollection, ShopifyProduct } from "@/types";

interface ProductsPageProps {
  categories: ProductCollection[];
}

interface DisplayProduct extends ShopifyProduct {
  categoryHandle: string;
  categoryLabel: string;
}

export default function ProductsPage({ categories }: ProductsPageProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Sync filter with URL query param on mount / navigation
  useEffect(() => {
    if (router.isReady) {
      const q = router.query.category;
      const handle = typeof q === "string" ? q : "all";
      const valid = COLLECTIONS.some((c) => c.handle === handle);

      setActiveCategory(valid ? handle : "all");
    }
  }, [router.isReady, router.query.category]);

  function handleFilterChange(handle: string) {
    setActiveCategory(handle);
    router.replace(
      {
        pathname: "/products",
        query: handle !== "all" ? { category: handle } : {},
      },
      undefined,
      { shallow: true },
    );
  }

  // Build a deduplicated flat product list with category metadata
  const allProducts: DisplayProduct[] = [];
  const seen = new Set<number>();

  for (const cat of categories) {
    for (const p of cat.products) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        allProducts.push({
          ...p,
          categoryHandle: cat.handle,
          categoryLabel: cat.label,
        });
      }
    }
  }

  const displayedProducts =
    activeCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.categoryHandle === activeCategory);

  const activeCollectionMeta = COLLECTIONS.find(
    (c) => c.handle === activeCategory,
  );

  return (
    <DefaultLayout
      description="Browse our full catalog of PPE, protective equipment, and packaging supplies. Gloves, gowns, tape, and more."
      title="Products"
    >
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#FAFAFA]" />
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-slate-300 opacity-15 blur-[140px]" />
      </div>

      <section className="py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <Chip
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            color="primary"
            radius="none"
            variant="bordered"
          >
            Full Catalog
          </Chip>
          <h1 className={title({ size: "lg", fullWidth: true })}>
            <span className={title({ size: "lg" })}>Our </span>
            <span className={title({ color: "steel", size: "lg" })}>
              Products
            </span>
          </h1>
          <p className={subtitle({ class: "mt-4 max-w-xl" })}>
            {activeCategory === "all"
              ? "PPE, protective equipment, tape, and packaging supplies — all in one place."
              : (activeCollectionMeta?.description ?? "")}
          </p>
        </div>

        {/* Category Filter */}
        <div className="-mx-6 px-6 mb-10 border-b border-divider pb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
            <Button
              className="text-xs font-bold uppercase tracking-wider shrink-0"
              color={activeCategory === "all" ? "primary" : "default"}
              radius="none"
              size="md"
              variant={activeCategory === "all" ? "solid" : "bordered"}
              onPress={() => handleFilterChange("all")}
            >
              All ({allProducts.length})
            </Button>
            {COLLECTIONS.map((col) => {
              const cat = categories.find((c) => c.handle === col.handle);
              const count = cat?.products.length ?? 0;
              const isActive = activeCategory === col.handle;

              return (
                <Button
                  key={col.handle}
                  className="text-xs font-bold uppercase tracking-wider shrink-0"
                  color={isActive ? "primary" : "default"}
                  radius="none"
                  size="md"
                  variant={isActive ? "solid" : "bordered"}
                  onPress={() => handleFilterChange(col.handle)}
                >
                  {col.label} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayedProducts.map((product) => {
              const img = product.images[0]?.src;
              const price = getMinPrice(product);
              const variantCount = getAvailableVariantCount(product);

              return (
                <NextLink
                  key={product.id}
                  className="group flex flex-col"
                  href={`/products/${product.handle}`}
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden border border-divider bg-zinc-50 transition-colors group-hover:border-primary">
                    {img ? (
                      <Image
                        fill
                        alt={product.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        src={img}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-default-200 text-5xl">
                        ◆
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="pt-3 px-0.5 flex flex-col gap-1 flex-1">
                    {/* Category badge */}
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-default-400">
                      {product.categoryLabel}
                    </p>
                    {/* Name */}
                    <p className="text-xs font-bold uppercase tracking-wide leading-snug line-clamp-2 text-foreground">
                      {product.title}
                    </p>
                    {/* Vendor */}
                    {product.vendor && (
                      <p className="text-[10px] text-default-400 uppercase tracking-wide">
                        {product.vendor}
                      </p>
                    )}
                    {/* Price + variants */}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      {price ? (
                        <span className="text-sm font-bold text-primary">
                          From {price}
                        </span>
                      ) : (
                        <span className="text-xs text-default-400">
                          Contact for pricing
                        </span>
                      )}
                      {variantCount > 1 && (
                        <span className="text-[10px] text-default-400 tabular-nums">
                          {variantCount} options
                        </span>
                      )}
                    </div>
                  </div>
                </NextLink>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-default-400 text-sm uppercase tracking-wider">
              No products found in this category.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 border-t border-divider pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-sm uppercase tracking-wide text-foreground mb-1">
              Need a custom quote?
            </p>
            <p className="text-sm text-default-500">
              Volume orders, custom specs, or can&apos;t find what you need —
              we&apos;ll sort it out.
            </p>
          </div>
          <Button
            isExternal
            as={Link}
            className="shrink-0 px-10 font-semibold uppercase tracking-wider"
            color="primary"
            href={siteConfig.links.contact}
            radius="none"
            size="lg"
          >
            Bulk Order Quote
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}

export const getStaticProps: GetStaticProps<ProductsPageProps> = async () => {
  const categories = await getAllCategorizedProducts();

  return {
    props: { categories },
    revalidate: 3600,
  };
};
