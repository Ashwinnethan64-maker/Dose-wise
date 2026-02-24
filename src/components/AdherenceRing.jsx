/**
 * AdherenceRing — SVG circular progress indicator. Theme-aware label.
 */
export default function AdherenceRing({ percentage = 0, size = 120, strokeWidth = 10, label }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const color = percentage >= 80 ? '#27ae60' : percentage >= 50 ? '#f39c12' : '#e74c3c';

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                    stroke="var(--color-border)" strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
                    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color }}>{percentage}%</span>
                {label && <span className="text-xs themed-text-muted mt-0.5">{label}</span>}
            </div>
        </div>
    );
}
