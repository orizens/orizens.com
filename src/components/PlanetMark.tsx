/**
 * Orizens planet / orbit brand mark — inline SVG so it stays crisp at every size
 * and in both themes. The supplied raster (src/assets/logo.png) ships without a
 * real alpha channel; swap this for an <img> if a properly matted logo is added.
 */
import logoWhite from '@/assets/logo-white.webp';

type Props = {
  className?: string;
  title?: string;
};

export const PlanetMark = ({ className = 'h-10 w-10', title }: Props) => (
  <img
    className={className}
    src={logoWhite.src}
    alt={title ?? 'Orizens logo'}
  />
);
// export const PlanetMark = ({ className = 'h-10 w-10', title }: Props) => (
//   <svg
//     viewBox="0 0 48 48"
//     className={className}
//     role={title ? 'img' : 'presentation'}
//     aria-label={title}
//     aria-hidden={title ? undefined : true}
//   >
//     <defs>
//       <radialGradient id="planet-body" cx="38%" cy="32%" r="75%">
//         <stop offset="0%" stopColor="#6DDCFF" />
//         <stop offset="42%" stopColor="#0B9CFF" />
//         <stop offset="78%" stopColor="#6548E8" />
//         <stop offset="100%" stopColor="#3a1f9e" />
//       </radialGradient>
//       <linearGradient id="planet-ring" x1="0" y1="0" x2="1" y2="1">
//         <stop offset="0%" stopColor="#A9ECFF" />
//         <stop offset="50%" stopColor="#29C6FF" />
//         <stop offset="100%" stopColor="#C2A9FF" />
//       </linearGradient>
//     </defs>
//     <circle cx="24" cy="24" r="17" fill="#29C6FF" opacity="0.18" />
//     <circle cx="22" cy="22" r="11.5" fill="url(#planet-body)" />
//     <ellipse
//       cx="22"
//       cy="22"
//       rx="19"
//       ry="6.4"
//       fill="none"
//       stroke="url(#planet-ring)"
//       strokeWidth="2.4"
//       transform="rotate(-22 22 22)"
//     />
//     <circle cx="18" cy="18" r="2.4" fill="#F7FAFF" opacity="0.75" />
//   </svg>
// );
