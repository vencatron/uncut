import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";

const values = [
  {
    icon: "◉",
    title: "Always In Stock",
    desc: "We maintain deep inventory on the products you rely on most, so you're never left scrambling. When you place an order, it ships — no substitutions, no delays, no excuses.",
  },
  {
    icon: "◆",
    title: "Fair Bulk Pricing",
    desc: "Volume orders shouldn't require a negotiation. We price our products straightforwardly so your budget goes further the more you buy.",
  },
  {
    icon: "⬟",
    title: "People Behind the Order",
    desc: "We're a family business, which means a real person is paying attention to your account. If something's off, you'll hear from us before you have to ask.",
  },
];

const whoWeServe = [
  "Medical & Dental Clinics",
  "Schools & Universities",
  "Warehouses & Distribution Centers",
  "Food Processing & Manufacturing",
  "Janitorial & Facilities Services",
  "Small Businesses & Startups",
];

export default function AboutPage() {
  return (
    <DefaultLayout
      description="Learn about Uncut Packaging — a family-owned business in Claremont, CA providing PPE and packaging supplies to businesses across Southern California."
      title="About Us"
    >
      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-[#FAFAF9]" />
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-zinc-300 opacity-20 blur-[140px]" />
        <div className="absolute bottom-1/3 -right-48 h-[400px] w-[400px] rounded-full bg-slate-200 opacity-25 blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="py-12 md:py-20">
        <Chip
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          color="primary"
          radius="none"
          variant="bordered"
        >
          Our Story
        </Chip>
        <div className="max-w-3xl">
          <h1 className={title({ size: "lg", fullWidth: true })}>
            <span className={title({ size: "lg" })}>Built on trust, </span>
            <span className={title({ color: "steel", size: "lg" })}>
              delivered fast.
            </span>
          </h1>
          <p className={subtitle({ class: "mt-5" })}>
            We&apos;re a family-owned business in Claremont, California — and we
            take it personally when the supplies you count on aren&apos;t there
            when you need them. That&apos;s exactly why we started Uncut.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="border-t border-divider py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className={title({ size: "md" })}>How We Got Here</h2>
          </div>
          <div className="flex flex-col gap-5 text-default-600 text-base leading-relaxed">
            <p>
              Uncut started the way most family businesses do — out of
              necessity. We watched too many local companies scrambling for
              basic PPE and packaging supplies, waiting weeks on backorders or
              overpaying just to get what they needed in a hurry. We&apos;re
              rooted in Claremont, a community that taught us what it means to
              show up for your neighbors. So we built something we&apos;d want
              to buy from ourselves: a reliable supplier that actually keeps
              things in stock.
            </p>
            <p>
              Over time, we&apos;ve built real partnerships with brands we trust
              — Safety Zone, SHOWA, and QSPAC — because we&apos;re not
              interested in selling you something we can&apos;t stand behind.
              Today we serve schools, medical clinics, warehouses,
              manufacturers, and small businesses across Southern California. We
              keep our inventory deep so you can order in bulk, get fair
              pricing, and move on with your day. No runaround, no waiting on a
              callback that never comes.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-divider py-16 md:py-20">
        <div className="mb-10">
          <Chip
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            color="primary"
            radius="none"
            variant="bordered"
          >
            What We Stand For
          </Chip>
          <h2 className={title({ size: "md", fullWidth: true })}>
            <span className={title({ size: "md" })}>The same every time, </span>
            <span className={title({ color: "steel", size: "md" })}>
              every order.
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col gap-3">
              <span className="text-2xl text-primary">{v.icon}</span>
              <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
                {v.title}
              </h3>
              <p className="text-sm text-default-500 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Serve */}
      <section className="border-t border-divider py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className={title({ size: "md", fullWidth: true })}>
              Who We{" "}
              <span className={title({ color: "steel", size: "md" })}>
                Work With
              </span>
            </h2>
            <p className="mt-4 text-default-500 text-base leading-relaxed max-w-sm">
              From single-location clinics to multi-site operations, we supply
              organizations across Southern California that can&apos;t afford to
              run out.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {whoWeServe.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border border-divider px-4 py-3"
              >
                <span className="text-primary text-xs">◆</span>
                <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-divider py-16 md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className={title({ size: "md" })}>
            <span className={title({ size: "md" })}>Ready to stock up? </span>
            <span className={title({ color: "steel", size: "md" })}>
              Let&apos;s talk.
            </span>
          </h2>
          <p className={subtitle({ class: "mx-auto text-center" })}>
            Reach out and we&apos;ll help you find the right products at the
            right quantity for what your operation actually needs.
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
            Get in Touch
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}
