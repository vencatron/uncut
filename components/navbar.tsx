import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import Image from "next/image";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <HeroUINavbar
      className="bg-background/80 backdrop-blur-md border-b border-divider"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Image
              priority
              alt="Uncut Packaging"
              className="object-contain dark:invert"
              height={64}
              src="/UncutLogo_776x.webp"
              width={160}
            />
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-6 justify-start ml-4">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium text-sm font-medium tracking-wide uppercase hover:text-primary transition-colors",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2 items-center">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-semibold tracking-wide uppercase"
            color="primary"
            href={siteConfig.links.contact}
            radius="none"
            variant="solid"
          >
            Get a Quote
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle className="w-10 h-10" />
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur-md pt-4 pb-8">
        <div className="flex flex-col gap-1 mt-2">
          {siteConfig.navMenuItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <Link
                className="w-full py-4 px-2 font-semibold tracking-wide uppercase text-base border-b border-divider"
                color={item.href.startsWith("http") ? "primary" : "foreground"}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
        <div className="mt-6 px-2">
          <Button
            isExternal
            as={Link}
            className="w-full font-semibold tracking-wide uppercase text-base"
            color="primary"
            href={siteConfig.links.contact}
            radius="none"
            size="lg"
            variant="solid"
          >
            Get a Quote
          </Button>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
