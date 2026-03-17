/**
 * Skeleton — Loading placeholder with shimmer animation.
 */
export default function Skeleton({ width = '100%', height = '1rem', rounded = 'rounded-xl', className = '', count = 1 }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton ${rounded}`}
                    style={{ width, height }}
                />
            ))}
        </div>
    );
}

/**
 * CardSkeleton — Full card loading state.
 */
export function CardSkeleton({ className = '' }) {
    return (
        <div className={`bg-white/60 rounded-2xl border border-primary-100/50 p-6 space-y-4 ${className}`}>
            <div className="flex items-center gap-4">
                <div className="skeleton w-14 h-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-5 w-2/3 rounded-lg" />
                    <div className="skeleton h-3.5 w-1/3 rounded-lg" />
                </div>
            </div>
            <div className="skeleton h-3 w-full rounded-lg" />
            <div className="skeleton h-3 w-4/5 rounded-lg" />
        </div>
    );
}
