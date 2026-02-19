import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { motion, useScroll, useTransform } from "framer-motion";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const features = [
  {
    icon: "⬡",
    title: "Custom Die-Cut Boxes",
    description:
      "Precision-engineered boxes crafted to your exact specifications. Every cut, fold, and crease is dialed in.",
  },
  {
    icon: "◈",
    title: "Premium Materials",
    description:
      "Corrugated, rigid, kraft, and specialty substrates sourced from the best mills. Built to protect and impress.",
  },
  {
    icon: "▣",
    title: "Full-Color Printing",
    description:
      "CMYK offset and digital printing with UV coating, foil, and emboss options. Make your brand impossible to ignore.",
  },
  {
    icon: "◉",
    title: "Low Minimums",
    description:
      "Start with 100 units and scale to millions. No job is too small or too big for our production lines.",
  },
  {
    icon: "◆",
    title: "Fast Turnaround",
    description:
      "Standard 10-day production. Rush 5-day production available. We move fast so you can move faster.",
  },
  {
    icon: "⬟",
    title: "Sustainable Options",
    description:
      "FSC-certified materials, soy inks, and recyclable constructions. Green packaging that doesn&apos;t compromise.",
  },
];

const stats = [
  { value: "10K+", label: "Brands Served" },
  { value: "50M+", label: "Units Shipped" },
  { value: "100+", label: "Material Options" },
  { value: "5 Days", label: "Rush Turnaround" },
];

export default function IndexPage() {
  const { scrollY } = useScroll();

  // Background blobs scroll at ~25% of the foreground speed (75% slower)
  const bgY1 = useTransform(scrollY, [0, 2000], [0, -250]);
  const bgY2 = useTransform(scrollY, [0, 2000], [0, -160]);
  const bgY3 = useTransform(scrollY, [0, 2000], [0, -100]);

  return (
    <DefaultLayout>
      {/* ── Static base background (light warm stone) ── */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#FAFAF9]" />

      {/* ── Parallax layer 1 — large orange bloom, top-right ── */}
      <motion.div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ y: bgY1 }}
      >
        <div className="absolute -top-32 -right-32 h-[700px] w-[700px] rounded-full bg-orange-200 opacity-30 blur-[140px]" />
        <div className="absolute top-1/2 -left-48 h-[500px] w-[500px] rounded-full bg-amber-100 opacity-35 blur-[120px]" />
      </motion.div>

      {/* ── Parallax layer 2 — mid amber accent ── */}
      <motion.div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ y: bgY2 }}
      >
        <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-orange-100 opacity-40 blur-[90px]" />
      </motion.div>

      {/* ── Parallax layer 3 — stone accent, bottom-left ── */}
      <motion.div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ y: bgY3 }}
      >
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-stone-300 opacity-25 blur-[100px]" />
      </motion.div>

      {/* ── Hero Section ── */}
      <section className="flex flex-col items-center justify-center gap-6 py-16 text-center md:py-24">
        <Chip
          className="text-xs font-semibold uppercase tracking-widest"
          color="primary"
          radius="none"
          variant="bordered"
        >
          Premium Custom Packaging
        </Chip>

        <div className="inline-block max-w-4xl">
          <h1 className={title({ fullWidth: true, size: "xl" })}>
            <span className={title({ size: "xl" })}>Packaging That&nbsp;</span>
            <span className={title({ color: "orange", size: "xl" })}>
              Works As Hard&nbsp;
            </span>
            <br />
            <span className={title({ size: "xl" })}>As You Do.</span>
          </h1>
          <div className={subtitle({ class: "mx-auto mt-6 text-center" })}>
            Custom packaging built for brands that mean business. From concept
            to delivery — no compromises, no excuses.
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Button
            as={Link}
            className="px-8 font-semibold uppercase tracking-wider"
            color="primary"
            href={siteConfig.links.sponsor}
            radius="none"
            size="lg"
          >
            Get a Quote
          </Button>
          <Button
            as={Link}
            className="border-default-400 px-8 font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary"
            href="/products"
            radius="none"
            size="lg"
            variant="bordered"
          >
            View Products
          </Button>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="my-8 border-y border-divider py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <span className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-default-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className={title({ fullWidth: true, size: "md" })}>
            <span className={title({ size: "md" })}>Built for&nbsp;</span>
            <span className={title({ color: "orange", size: "md" })}>
              Performance
            </span>
          </h2>
          <p className={subtitle({ class: "mx-auto mt-4 text-center" })}>
            Every product in our lineup is engineered to protect what matters
            and present your brand with authority.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border border-divider bg-background/60 backdrop-blur-sm hover:border-primary transition-colors"
              radius="none"
              shadow="none"
            >
              <CardBody className="gap-3 p-6">
                <span className="inline-block text-2xl text-primary transition-transform group-hover:scale-110">
                  {feature.icon}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-default-500">
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="border-t border-divider py-16 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className={title({ size: "md" })}>
            <span className={title({ size: "md" })}>Ready to&nbsp;</span>
            <span className={title({ color: "fire", size: "md" })}>
              Box It Up?
            </span>
          </h2>
          <p className={subtitle({ class: "mx-auto text-center" })}>
            Tell us what you need. We&apos;ll handle the rest. No salespeople,
            no runaround — just great packaging made fast.
          </p>
          <Button
            as={Link}
            className="px-12 font-semibold uppercase tracking-widest"
            color="primary"
            href={siteConfig.links.sponsor}
            radius="none"
            size="lg"
          >
            Start Your Order
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}
