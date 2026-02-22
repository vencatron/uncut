# Uncut Packaging

Marketing and catalog site for Uncut Packaging — PPE, protective equipment, and packaging supplies.

## Stack

- [Next.js 15](https://nextjs.org) (Pages Router)
- [HeroUI v2](https://heroui.com) components
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## Data

Product catalog is fetched from the live Shopify store at `uncutpackaging.com` via their public JSON API. Pages are statically generated at build time with ISR (1-hour revalidation).

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

## License

Licensed under the [MIT license](./LICENSE).
