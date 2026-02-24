import type { GetStaticProps } from "next";

import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";
import { getAllCategorizedProducts, getMinPrice } from "@/lib/shopify";
import { ProductCollection } from "@/types";

const trustSignals = [
  {
    icon: "◉",
    title: "Bulk Pricing",
    desc: "Case pricing and volume discounts on every product line. The more you order, the more you save.",
  },
  {
    icon: "◆",
    title: "Trusted Brands",
    desc: "Safety Zone, SHOWA, and QSPAC — industry-leading PPE manufacturers, all under one roof.",
  },
  {
    icon: "⬟",
    title: "Fast Fulfillment",
    desc: "In-stock items ship same or next business day. No waiting, no runaround.",
  },
];

interface HomePageProps {
  categories: ProductCollection[];
}

export default function IndexPage({ categories }: HomePageProps) {
  const featuredProducts = categories
    .flatMap((cat) => cat.products.slice(0, 2))
    .slice(0, 8);

  return (
    <DefaultLayout>
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#FAFAFA]" />
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-slate-300 opacity-20 blur-[140px]" />
        <div className="absolute top-1/2 -left-48 h-[500px] w-[500px] rounded-full bg-zinc-200 opacity-25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-slate-200 opacity-20 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 py-16 text-center md:py-24">
        <Chip
          className="text-xs font-semibold uppercase tracking-widest"
          color="primary"
          radius="none"
          variant="bordered"
        >
          PPE & Packaging Supplies
        </Chip>
        <div className="inline-block max-w-4xl">
          <h1 className={title({ fullWidth: true, size: "xl" })}>
            <span className={title({ size: "xl" })}>Protect Your Team.</span>
            <br />
            <span className={title({ color: "steel", size: "xl" })}>
              Ship with Confidence.
            </span>
          </h1>
          <p className={subtitle({ class: "mx-auto mt-6 text-center" })}>
            Gloves, gowns, coveralls, tape, and more — everything your operation
            needs, sourced and ready to ship.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Button
            as={Link}
            className="px-8 font-semibold uppercase tracking-wider"
            color="primary"
            href="/products"
            radius="none"
            size="lg"
          >
            Shop All Products
          </Button>
          <Button
            isExternal
            as={Link}
            className="border-default-400 px-8 font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary"
            href={siteConfig.links.contact}
            radius="none"
            size="lg"
            variant="bordered"
          >
            Bulk Order Quote
          </Button>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="pb-16 md:pb-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className={title({ size: "md" })}>
            <span className={title({ size: "md" })}>Shop by </span>
            <span className={title({ color: "steel", size: "md" })}>
              Category
            </span>
          </h2>
          <Link
            className="text-sm font-semibold uppercase tracking-wider text-primary hidden sm:block"
            href="/products"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => {
            const img = cat.products[0]?.images[0]?.src;

            return (
              <NextLink
                key={cat.handle}
                className="group block"
                href={`/products?category=${cat.handle}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden border-2 border-foreground/20 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg bg-zinc-100">
                  {img ? (
                    <Image
                      fill
                      alt={cat.label}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      src={img}
                    />
                  ) : null}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <p className="font-extrabold text-white text-base uppercase tracking-wider leading-tight">
                      {cat.label}
                    </p>
                    <p className="text-white/70 text-xs mt-1 font-medium">
                      {cat.products.length} product
                      {cat.products.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </NextLink>
            );
          })}
        </div>
        <div className="mt-4 text-center sm:hidden">
          <Link
            className="text-sm font-semibold uppercase tracking-wider text-primary"
            href="/products"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-divider py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className={title({ size: "md" })}>
            <span className={title({ size: "md" })}>Featured </span>
            <span className={title({ color: "charcoal", size: "md" })}>
              Products
            </span>
          </h2>
          <Link
            className="text-sm font-semibold uppercase tracking-wider text-primary hidden sm:block"
            href="/products"
          >
            Full Catalog →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => {
            const img = product.images[0]?.src;
            const price = getMinPrice(product);

            return (
              <NextLink
                key={product.id}
                className="group block"
                href={`/products/${product.handle}`}
              >
                <div className="relative aspect-square overflow-hidden border border-divider bg-zinc-50 transition-colors group-hover:border-primary">
                  {img ? (
                    <Image
                      fill
                      alt={product.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      src={img}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-default-200 text-5xl">
                      ◆
                    </div>
                  )}
                </div>
                <div className="pt-3 px-0.5">
                  <p className="text-xs font-bold uppercase tracking-wide leading-snug line-clamp-2 text-foreground">
                    {product.title}
                  </p>
                  {price && (
                    <p className="text-primary font-bold text-sm mt-1">
                      From {price}
                    </p>
                  )}
                </div>
              </NextLink>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button
            as={Link}
            className="px-10 font-semibold uppercase tracking-wider"
            color="primary"
            href="/products"
            radius="none"
            variant="bordered"
          >
            Browse Full Catalog
          </Button>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-t border-divider py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {trustSignals.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <span className="text-2xl text-primary">{item.icon}</span>
              <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-default-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-divider py-16 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className={title({ size: "md" })}>
            <span className={title({ size: "md" })}>Ready to </span>
            <span className={title({ color: "steel", size: "md" })}>
              Place an Order?
            </span>
          </h2>
          <p className={subtitle({ class: "mx-auto text-center" })}>
            Get in touch and we&apos;ll put together the right package for your
            operation — fast.
          </p>
          <Button
            isExternal
            as={Link}
            className="px-12 font-semibold uppercase tracking-widest"
            color="primary"
            href={siteConfig.links.contact}
            radius="none"
            size="lg"
          >
            Contact Us
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const categories = await getAllCategorizedProducts();

  return {
    props: { categories },
    revalidate: 3600,
  };
};
