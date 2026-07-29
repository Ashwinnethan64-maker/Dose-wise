import React from 'react';

/**
 * DoseWiseLogo — High Quality Vector SVG Brand Logo Component.
 * Guarantees crisp, unclipped rendering of the Pill + Ring + Pixel trail mark
 * and matching Dosewise AI brand typography in light and dark modes.
 */
export default function DoseWiseLogo({ size = 'md', className = '' }) {
    const isSmall = size === 'sm';
    const isLarge = size === 'lg';

    // Dimensions based on size variant
    const iconHeight = isSmall ? 32 : isLarge ? 46 : 38;
    const textSize = isSmall ? 'text-lg' : isLarge ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl';

    return (
        <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
            {/* High Resolution Vector Logo Mark (Pill + Arc + Digital Pixels) */}
            <svg
                height={iconHeight}
                viewBox="0 0 170 170"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 transition-transform duration-200 group-hover:scale-105"
            >
                <defs>
                    <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#26d0ce" />
                        <stop offset="100%" stopColor="#0d9e9e" />
                    </linearGradient>

                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0d9e9e" />
                        <stop offset="50%" stopColor="#26d0ce" />
                        <stop offset="100%" stopColor="#0fa7a1" />
                    </linearGradient>

                    <linearGradient id="sheenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                    </linearGradient>
                </defs>

                {/* Complete Outer Circular Arc */}
                <path
                    d="M 55 145 A 64 64 0 1 1 155 85"
                    stroke="url(#arcGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                />

                {/* Digital Pixel Trail (Top-Left) */}
                <rect x="25" y="45" width="9" height="9" rx="2" fill="#0fa7a1" />
                <rect x="38" y="30" width="9" height="9" rx="2" fill="#26d0ce" />
                <rect x="38" y="52" width="9" height="9" rx="2" fill="#0d9e9e" />
                <rect x="14" y="60" width="9" height="9" rx="2" fill="#26d0ce" opacity="0.8" />
                <rect x="27" y="76" width="9" height="9" rx="2" fill="#0fa7a1" opacity="0.9" />

                {/* Main Angled Pill Body centered inside circle */}
                <g transform="translate(50, 42) rotate(-40 45 45)">
                    <rect x="10" y="25" width="72" height="36" rx="18" fill="url(#pillGrad)" stroke="#0b8686" strokeWidth="1" />
                    <line x1="46" y1="25" x2="46" y2="61" stroke="#043e3e" strokeWidth="2.5" opacity="0.4" />
                    <path
                        d="M 22 29 L 70 29 C 76 29 78 33 72 34 L 24 34 C 18 33 16 29 22 29 Z"
                        fill="url(#sheenGrad)"
                    />
                </g>
            </svg>

            {/* Clean Brand Typography */}
            <div className={`flex items-baseline font-bold tracking-tight font-heading ${textSize}`}>
                <span style={{ color: 'var(--color-text)' }}>Dosewise</span>
                <span className="ml-1.5 text-primary-500 font-extrabold">AI</span>
            </div>
        </div>
    );
}
