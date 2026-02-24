/**
 * StatusBadge — Color-coded status pill.
 */
export default function StatusBadge({ status, className = '' }) {
    const styles = {
        taken: { bg: 'bg-green-100', text: 'text-green-700', label: '✅ Taken' },
        skipped: { bg: 'bg-orange-100', text: 'text-orange-700', label: '⏭ Skipped' },
        pending: { bg: 'bg-primary-50', text: 'text-primary-600', label: '⏳ Pending' },
        critical: { bg: 'bg-red-100', text: 'text-red-700', label: '🚨 Critical' },
        moderate: { bg: 'bg-amber-100', text: 'text-amber-700', label: '⚠️ Moderate' },
        safe: { bg: 'bg-green-100', text: 'text-green-700', label: '✅ Safe' },
        active: { bg: 'bg-primary-100', text: 'text-primary-700', label: '● Active' },
        inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: '○ Inactive' },
    };

    const s = styles[status] || styles.active;

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${s.bg} ${s.text} ${className}`}>
            {s.label}
        </span>
    );
}
