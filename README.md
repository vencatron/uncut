# Uncut Packaging

Product catalog and company website for Uncut Packaging — a family-owned PPE and packaging supplies distributor based in Claremont, California.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (Pages Router)
- [HeroUI](https://heroui.com) component library
- [Tailwind CSS 4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- Shopify Storefront API (product data)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Project Structure

```
├── components/     # Reusable UI components
├── config/         # Site configuration and fonts
├── layouts/        # Page layouts (default, head)
├── lib/            # API clients and utilities
├── pages/          # Next.js pages
├── public/         # Static assets
├── styles/         # Global styles
└── types/          # TypeScript type definitions
```

## Data Source

Product data is fetched from the Shopify store at `uncutpackaging.com` using the public Products JSON API. Data is statically generated at build time with ISR (revalidation every hour).

## License

Licensed under the [MIT license](./LICENSE).
