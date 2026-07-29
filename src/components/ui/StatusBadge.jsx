/**
 * StatusBadge — Color-coded status pill.
 */
export default function StatusBadge({ status, className = '' }) {
    const styles = {
        taken: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: '✓ Taken' },
        skipped: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: '↷ Skipped' },
        pending: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200/60', label: '◷ Pending' },
        critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: '⚠ Critical' },
        moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: '⚠ Moderate' },
        safe: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: '✓ Safe' },
        active: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200/60', label: '● Active' },
        inactive: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', label: '○ Inactive' },
    };

    const s = styles[status] || styles.active;

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border} ${className}`}>
            {s.label}
        </span>
    );
}
