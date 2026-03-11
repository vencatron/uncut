import Image from "next/image";
import NextLink from "next/link";

/* ─── Category data ──────────────────────────────────────────── */

const CATEGORIES = [
  {
    label: "Tape",
    tagline: "Rugged hold. Secure seals.",
    handle: "tape",
    icon: "/icons/icon-tape.png",
  },
  {
    label: "Shrink & Stretch Film",
    tagline: "Optimize protection. Reduce waste.",
    handle: "shrink-stretch-film",
    icon: "/icons/icon-shrink-film.png",
  },
  {
    label: "Labels",
    tagline: "Clear branding. Clear identity.",
    handle: "labels",
    icon: "/icons/icon-labels.png",
  },
  {
    label: "Janitorial Supplies",
    tagline: "Essential facility cleanliness.",
    handle: "janitorial-supplies",
    icon: "/icons/icon-janitorial.png",
  },
  {
    label: "TTR Ribbon",
    tagline: "Professional detail. Stylish finish.",
    handle: "ribbon",
    icon: "/icons/icon-ribbon.png",
  },
  {
    label: "PPE",
    tagline: "Team safety. Ensured.",
    handle: "ppe",
    icon: "/icons/icon-ppe.png",
  },
];

/* ─── Component ──────────────────────────────────────────────── */

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {CATEGORIES.map((cat) => (
        <NextLink
          key={cat.handle}
          href={`/products?category=${cat.handle}`}
          className="group block"
        >
          <div
            className="
              category-tile
              flex items-center gap-5 rounded-xl p-5
              bg-gradient-to-br from-zinc-100 to-zinc-200
              border border-zinc-300
              shadow-sm
              transition-all duration-300
              group-hover:border-primary group-hover:shadow-md group-hover:from-zinc-50 group-hover:to-zinc-150
              active:scale-[0.98] group-active:border-primary
            "
          >
            {/* Icon */}
            <div className="w-16 h-16 flex-shrink-0 relative transition-transform duration-300 group-hover:scale-110">
              <Image
                src={cat.icon}
                alt={cat.label}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="font-black text-sm sm:text-base uppercase tracking-wide leading-tight text-foreground">
                {cat.label}
              </p>
              <p className="mt-1 text-xs sm:text-sm uppercase tracking-wider text-zinc-500 leading-snug">
                {cat.tagline}
              </p>
            </div>
          </div>
        </NextLink>
      ))}
    </div>
  );
}
