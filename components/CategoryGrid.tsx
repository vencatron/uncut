import NextLink from "next/link";

/* ─── SVG Icons ──────────────────────────────────────────────── */

function TapeIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes tape-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .tape-roll { transform-origin: 40px 40px; animation: tape-spin 6s linear infinite; animation-play-state: paused; }
        .category-tile:hover .tape-roll { animation-play-state: running; }
      `}</style>
      <g className="tape-roll">
        {/* Outer ring */}
        <circle cx="40" cy="40" r="32" stroke="#1a1a1a" strokeWidth="3.5" fill="none"/>
        {/* Inner hub */}
        <circle cx="40" cy="40" r="14" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
        {/* Core fill */}
        <circle cx="40" cy="40" r="8" fill="#1a1a1a" opacity="0.15"/>
        {/* Radial spokes */}
        {[0,60,120,180,240,300].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          const x1 = 40 + 14 * Math.cos(rad);
          const y1 = 40 + 14 * Math.sin(rad);
          const x2 = 40 + 32 * Math.cos(rad);
          const y2 = 40 + 32 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.35"/>;
        })}
      </g>
      {/* Tape tail */}
      <path d="M72 38 Q80 38 78 50 L74 54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function ShrinkFilmIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes film-pulse { 0%,100% { opacity:1; transform:scaleX(1); } 50% { opacity:0.7; transform:scaleX(1.04); } }
        .film-wrap { transform-origin:40px 40px; animation: film-pulse 3s ease-in-out infinite; animation-play-state: paused; }
        .category-tile:hover .film-wrap { animation-play-state: running; }
      `}</style>
      {/* Pallet base */}
      <rect x="12" y="62" width="56" height="8" rx="1" fill="#1a1a1a" opacity="0.8"/>
      <rect x="18" y="55" width="6" height="10" fill="#1a1a1a" opacity="0.5"/>
      <rect x="37" y="55" width="6" height="10" fill="#1a1a1a" opacity="0.5"/>
      <rect x="56" y="55" width="6" height="10" fill="#1a1a1a" opacity="0.5"/>
      {/* Box stack */}
      <rect x="14" y="28" width="52" height="28" rx="1" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
      <line x1="40" y1="28" x2="40" y2="56" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4"/>
      <rect x="14" y="14" width="52" height="16" rx="1" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
      {/* Wrap lines */}
      <g className="film-wrap">
        <ellipse cx="40" cy="28" rx="27" ry="5" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.6"/>
        <ellipse cx="40" cy="42" rx="27" ry="5" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.6"/>
        <ellipse cx="40" cy="56" rx="27" ry="5" stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.6"/>
      </g>
    </svg>
  );
}

function LabelsIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes label-peel {
          0%,70%,100% { transform: translateY(0); }
          85% { transform: translateY(-4px); }
        }
        .label-top { transform-origin: 40px 20px; animation: label-peel 3.5s ease-in-out infinite; animation-play-state: paused; }
        .category-tile:hover .label-top { animation-play-state: running; }
      `}</style>
      {/* Shadow sheets */}
      <rect x="20" y="22" width="44" height="52" rx="2" fill="#1a1a1a" opacity="0.12"/>
      <rect x="16" y="18" width="44" height="52" rx="2" stroke="#1a1a1a" strokeWidth="2" fill="white" opacity="0.6"/>
      {/* Main sheet */}
      <rect x="12" y="12" width="44" height="52" rx="2" stroke="#1a1a1a" strokeWidth="2.5" fill="white"/>
      {/* Lines */}
      <line x1="20" y1="26" x2="48" y2="26" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="20" y1="34" x2="44" y2="34" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="20" y1="41" x2="46" y2="41" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="20" y1="48" x2="40" y2="48" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Peeling corner */}
      <g className="label-top">
        <path d="M44 12 L56 12 L56 24 Z" fill="#e5e5e5" stroke="#1a1a1a" strokeWidth="1.5"/>
      </g>
    </svg>
  );
}

function JanitorialIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes sweep {
          0%,100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .broom { transform-origin: 30px 12px; animation: sweep 2.5s ease-in-out infinite; animation-play-state: paused; }
        .brush { transform-origin: 52px 12px; animation: sweep 2.5s ease-in-out infinite reverse; animation-play-state: paused; }
        .category-tile:hover .broom, .category-tile:hover .brush { animation-play-state: running; }
      `}</style>
      {/* Broom */}
      <g className="broom">
        <line x1="30" y1="12" x2="18" y2="62" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
        <rect x="8" y="58" width="22" height="14" rx="2" fill="#1a1a1a" opacity="0.85"/>
        <line x1="10" y1="62" x2="10" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="14" y1="62" x2="14" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="18" y1="62" x2="18" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="22" y1="62" x2="22" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="26" y1="62" x2="26" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      </g>
      {/* Brush */}
      <g className="brush">
        <line x1="52" y1="12" x2="64" y2="62" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
        <rect x="50" y="56" width="22" height="16" rx="3" fill="#1a1a1a" opacity="0.85"/>
        <line x1="53" y1="60" x2="53" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="57" y1="60" x2="57" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="61" y1="60" x2="61" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="65" y1="60" x2="65" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
        <line x1="69" y1="60" x2="69" y2="72" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      </g>
    </svg>
  );
}

function RibbonIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes ribbon-spin { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .ribbon-roll { transform-origin: 40px 44px; animation: ribbon-spin 8s linear infinite; animation-play-state: paused; }
        .category-tile:hover .ribbon-roll { animation-play-state: running; }
      `}</style>
      <g className="ribbon-roll">
        {/* Outer ring - wider/flatter like ribbon spool */}
        <ellipse cx="40" cy="44" rx="30" ry="22" stroke="#1a1a1a" strokeWidth="3.5" fill="none"/>
        <ellipse cx="40" cy="44" rx="30" ry="8" stroke="#1a1a1a" strokeWidth="2" fill="none" opacity="0.4"/>
        {/* Inner core */}
        <ellipse cx="40" cy="44" rx="12" ry="9" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
        {/* Hatch lines on spool */}
        {[0,1,2,3,4,5,6,7].map((i) => (
          <line key={i}
            x1={40 + 12 * Math.cos(i * Math.PI / 4)}
            y1={44 + 9 * Math.sin(i * Math.PI / 4)}
            x2={40 + 30 * Math.cos(i * Math.PI / 4)}
            y2={44 + 22 * Math.sin(i * Math.PI / 4)}
            stroke="#1a1a1a" strokeWidth="1" opacity="0.25"/>
        ))}
      </g>
      {/* Ribbon tail coming off */}
      <path d="M10 44 Q6 38 8 30 L14 24" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M8 30 Q6 24 12 20" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}

function PPEIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <style>{`
        @keyframes ppe-glow {
          0%,100% { opacity:1; }
          50% { opacity:0.6; }
        }
        @keyframes glove-wave {
          0%,100% { transform: rotate(0deg); }
          30% { transform: rotate(-6deg); }
          60% { transform: rotate(4deg); }
        }
        .shield { animation: ppe-glow 3s ease-in-out infinite; animation-play-state: paused; }
        .glove { transform-origin: 55px 55px; animation: glove-wave 3s ease-in-out infinite; animation-play-state: paused; }
        .category-tile:hover .shield, .category-tile:hover .glove { animation-play-state: running; }
      `}</style>
      {/* Face shield */}
      <g className="shield">
        {/* Headband */}
        <rect x="10" y="8" width="42" height="8" rx="4" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
        {/* Visor */}
        <path d="M12 16 Q10 30 10 42 Q10 60 31 66 Q52 60 52 42 Q52 30 50 16 Z"
          stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
        {/* Visor shine */}
        <path d="M18 22 Q16 32 16 42" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <path d="M24 20 Q21 32 21 44" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
      </g>
      {/* Glove */}
      <g className="glove">
        {/* Palm */}
        <path d="M48 44 Q46 40 48 35 L50 28 Q52 24 56 26 L56 38"
          stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Fingers */}
        <path d="M50 28 Q51 22 55 23 Q59 24 58 30" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M54 27 Q55 20 59 21 Q63 23 62 29" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M58 29 Q60 22 64 24 Q67 27 65 33" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Thumb */}
        <path d="M48 35 Q44 31 43 36 Q43 42 48 44" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
        {/* Cuff */}
        <path d="M48 44 Q47 56 50 62 L62 62 Q66 56 65 44 Q60 42 58 40"
          stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <line x1="48" y1="52" x2="64" y2="50" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4"/>
      </g>
    </svg>
  );
}

/* ─── Category data ──────────────────────────────────────────── */

const CATEGORIES = [
  {
    label: "Tape",
    tagline: "Rugged hold. Secure seals.",
    handle: "tape",
    Icon: TapeIcon,
  },
  {
    label: "Shrink & Stretch Film",
    tagline: "Optimize protection. Reduce waste.",
    handle: "shrink-stretch-film",
    Icon: ShrinkFilmIcon,
  },
  {
    label: "Labels",
    tagline: "Clear branding. Clear identity.",
    handle: "labels",
    Icon: LabelsIcon,
  },
  {
    label: "Janitorial Supplies",
    tagline: "Essential facility cleanliness.",
    handle: "janitorial-supplies",
    Icon: JanitorialIcon,
  },
  {
    label: "Ribbon",
    tagline: "Professional detail. Stylish finish.",
    handle: "ribbon",
    Icon: RibbonIcon,
  },
  {
    label: "PPE",
    tagline: "Team safety. Ensured.",
    handle: "ppe",
    Icon: PPEIcon,
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
            "
          >
            {/* Icon */}
            <div className="w-16 h-16 flex-shrink-0">
              <cat.Icon />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="font-black text-sm sm:text-base uppercase tracking-wide leading-tight text-foreground">
                {cat.label}
              </p>
              <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-wider text-zinc-500 leading-snug">
                {cat.tagline}
              </p>
            </div>
          </div>
        </NextLink>
      ))}
    </div>
  );
}
