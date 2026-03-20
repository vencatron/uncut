const STOREFRONT_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const API_VERSION = "2025-01";

const STOREFRONT_URL = `https://${STOREFRONT_DOMAIN}/api/${API_VERSION}/graphql.json`;

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!STOREFRONT_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error(
      "Shopify Storefront API credentials are not configured. " +
      "Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    );
  }

  const res = await fetch(STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(
      `Shopify Storefront API error: ${res.status} ${res.statusText}`,
    );
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

/**
 * Creates a Shopify cart with a single line item and returns the checkout URL.
 * The checkout URL sends the customer straight to Shopify's hosted checkout —
 * they never see the Shopify storefront.
 */
export async function createCheckoutUrl(
  variantId: number,
  quantity: number = 1,
): Promise<string> {
  if (!variantId || variantId <= 0) {
    throw new Error("Invalid variant ID");
  }

  const gid = `gid://shopify/ProductVariant/${variantId}`;

  const data = await storefrontFetch<{
    cartCreate: {
      cart: { checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      input: {
        lines: [{ merchandiseId: gid, quantity }],
      },
    },
  );

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  if (!data.cartCreate.cart) {
    throw new Error("Failed to create cart");
  }

  // Shopify returns the checkoutUrl using the store's primary domain (the
  // custom domain configured in Shopify admin, e.g. www.uncutpackaging.com).
  // Because the headless storefront is hosted on Vercel, that domain doesn't
  // serve Shopify's /cart/c/ checkout routes.  Rewrite the URL to use the
  // canonical *.myshopify.com domain so the redirect lands on Shopify's
  // hosted checkout instead of a Vercel 404.
  const checkoutUrl = data.cartCreate.cart.checkoutUrl;
  try {
    const url = new URL(checkoutUrl);
    if (!url.hostname.endsWith(".myshopify.com")) {
      url.hostname = STOREFRONT_DOMAIN;
      return url.toString();
    }
  } catch {
    // If URL parsing fails, fall through and return as-is
  }

  return checkoutUrl;
}
