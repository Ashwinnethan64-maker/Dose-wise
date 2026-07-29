/**
 * SectionHeader — Consistent section title with optional action.
 */
export default function SectionHeader({ title, subtitle, icon, action, className = '' }) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${className}`}>
            <div>
                <h2 className="text-lg sm:text-xl font-bold themed-text flex items-center gap-2.5">
                    {icon && <span className="text-primary-500 shrink-0 [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-7 sm:[&>svg]:h-7">{icon}</span>}
                    {title}
                </h2>
                {subtitle && <p className="text-xs sm:text-sm themed-text-muted mt-1 font-medium">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
