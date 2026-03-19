const STOREFRONT_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const API_VERSION = "2025-01";

const STOREFRONT_URL = `https://${STOREFRONT_DOMAIN}/api/${API_VERSION}/graphql.json`;

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

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

  return data.cartCreate.cart.checkoutUrl;
}
