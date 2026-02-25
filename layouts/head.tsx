import NextHead from "next/head";

import { siteConfig } from "@/config/site";

interface HeadProps {
  title?: string;
  description?: string;
}

export const Head = ({ title, description }: HeadProps) => {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;

  return (
    <NextHead>
      <title>{pageTitle}</title>
      <meta key="title" content={pageTitle} property="og:title" />
      <meta key="og:type" content="website" property="og:type" />
      <meta
        key="description"
        content={pageDescription}
        property="og:description"
      />
      <meta content={pageDescription} name="description" />
      <meta
        key="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        name="viewport"
      />
      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
