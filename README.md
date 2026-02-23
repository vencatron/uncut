# Uncut Packaging

Marketing site for [Uncut Packaging](https://uncutpackaging.com) — your trusted source for PPE, protective equipment, and packaging supplies.

## Overview

This site showcases products from the Uncut Packaging Shopify store with a custom-designed frontend. Product data is fetched directly from the Shopify API and cached via ISR.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (Pages Router)
- [HeroUI v2](https://heroui.com) (component library)
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Project Structure

```
├── components/     # Reusable UI components
├── config/         # Site configuration and fonts
├── layouts/        # Page layout wrappers
├── lib/            # Data fetching and utilities
├── pages/          # Next.js pages
├── public/         # Static assets
├── styles/         # Global CSS
└── types/          # TypeScript types
```

## Data Source

Product data is fetched from the Shopify JSON API at `uncutpackaging.com`:
- Collections: aprons-gowns-coats, foot-protection, gloves, head-eye, tape
- Pages are regenerated every hour (ISR with 3600s revalidate)

## License

MIT
