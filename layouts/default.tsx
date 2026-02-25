import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site";

interface DefaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function DefaultLayout({
  children,
  title,
  description,
}: DefaultLayoutProps) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Head description={description} title={title} />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full mt-20 border-t border-divider bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <p className="font-bold tracking-widest uppercase text-foreground mb-2">
                Uncut Packaging
              </p>
              <p className="text-default-500 text-sm max-w-sm">
                Your trusted source for PPE, protective equipment, and packaging
                supplies. Safety Zone, SHOWA, QSPAC, and more — all ready to
                ship.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm uppercase tracking-wider text-default-400 mb-4">
                Navigation
              </p>
              <div className="flex flex-col gap-2">
                {siteConfig.navItems.map((item) => (
                  <Link
                    key={item.href}
                    className="text-sm text-default-500 hover:text-primary transition-colors"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm uppercase tracking-wider text-default-400 mb-4">
                Contact
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  isExternal
                  className="text-sm text-default-500 hover:text-primary transition-colors"
                  href={siteConfig.links.contact}
                >
                  Get in Touch
                </Link>
                <Link
                  isExternal
                  className="text-sm text-default-500 hover:text-primary transition-colors"
                  href={siteConfig.links.store}
                >
                  Shop Online
                </Link>
              </div>
            </div>
          </div>
          <Divider className="my-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-default-400 text-xs">
              © {new Date().getFullYear()} Uncut Packaging. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
