import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function ContactPage() {
  return (
    <DefaultLayout
      description="Get in touch with Uncut Packaging for bulk orders, quotes, and product inquiries."
      title="Contact"
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
          Contact Us
        </Chip>
        <div className="max-w-3xl">
          <h1 className={title({ size: "lg", fullWidth: true })}>
            <span className={title({ size: "lg" })}>Let&apos;s </span>
            <span className={title({ color: "steel", size: "lg" })}>
              talk.
            </span>
          </h1>
          <p className={subtitle({ class: "mt-5" })}>
            Whether you need a quote, want to place a bulk order, or just have a
            question — we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="border-t border-divider py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className={title({ size: "md" })}>Get in Touch</h2>
            <p className="mt-4 text-default-500 text-base leading-relaxed max-w-sm">
              Send us an email and we&apos;ll get back to you as soon as
              possible. We typically respond within one business day.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border border-divider px-6 py-5">
              <span className="text-primary text-lg">◉</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-default-400">
                  Email
                </p>
                <Link
                  className="text-base font-semibold text-foreground"
                  href="mailto:sales@uncutpackaging.com"
                >
                  sales@uncutpackaging.com
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4 border border-divider px-6 py-5">
              <span className="text-primary text-lg">◆</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-default-400">
                  Location
                </p>
                <p className="text-base font-semibold text-foreground">
                  Claremont, California
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
