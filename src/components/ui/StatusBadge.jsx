import { useLanguage } from '../../context/LanguageContext';

/**
 * StatusBadge — Color-coded status pill with multilingual labels.
 */
export default function StatusBadge({ status, className = '' }) {
    const { t } = useLanguage();

    const styles = {
        taken: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: '✓', key: 'statusTaken' },
        skipped: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '↷', key: 'statusSkipped' },
        pending: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200/60', icon: '◷', key: 'statusPending' },
        missed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '✗', key: 'statusMissed' },
        critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: '⚠', label: 'Critical' },
        moderate: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '⚠', label: 'Moderate' },
        safe: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: '✓', label: 'Safe' },
        active: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200/60', icon: '●', label: 'Active' },
        inactive: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', icon: '○', label: 'Inactive' },
    };

    const s = styles[status] || styles.active;
    const label = s.key ? `${s.icon} ${t(s.key)}` : `${s.icon} ${s.label}`;

    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.text} ${s.border} ${className}`}>
            {label}
        </span>
    );
}
