/**
 * SectionHeader — Consistent section title with optional action.
 */
export default function SectionHeader({ title, subtitle, icon, action, className = '' }) {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div>
                <h2 className="text-elder-lg font-bold themed-text flex items-center gap-2.5">
                    {icon && <span className="text-primary-500">{icon}</span>}
                    {title}
                </h2>
                {subtitle && <p className="text-sm themed-text-muted mt-0.5">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
