import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ShopifyImage {
  id: number;
  src: string;
  alt: string | null;
  width: number;
  height: number;
}

export interface ShopifyOption {
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyVariant {
  id: number;
  title: string;
  price: string;
  sku: string;
  available: boolean;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  product_type: string;
  vendor: string;
  tags: string[];
  body_html: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  options: ShopifyOption[];
}

export interface ProductCollection {
  handle: string;
  label: string;
  products: ShopifyProduct[];
}

/**
 * Slim product for listing pages - contains only display-essential fields.
 * Reduces SSG page data from ~500KB to ~50KB.
 */
export interface SlimProduct {
  id: number;
  title: string;
  handle: string;
  vendor: string;
  imageSrc: string | null;
  minPrice: string | null;
  variantCount: number;
}

export interface SlimProductCollection {
  handle: string;
  label: string;
  products: SlimProduct[];
}
