import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-bold",
  variants: {
    color: {
      silver: "from-[#64748B] to-[#334155]",
      mist: "from-[#94A3B8] to-[#475569]",
      steel: "from-[#9CA3AF] to-[#6B7280]",
      charcoal: "from-[#6B7280] to-[#374151]",
      fire: "from-[#475569] to-[#1E293B]",
      stone: "from-[#A8A29E] to-[#78716C]",
      foreground:
        "dark:from-[#FFFFFF] dark:to-[#A8A29E] from-[#1C1917] to-[#44403C]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl",
      lg: "text-4xl lg:text-6xl",
      xl: "text-5xl lg:text-7xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "silver",
        "mist",
        "steel",
        "charcoal",
        "fire",
        "stone",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-500 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
