const COLORS = {
    // Appointment / general
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-200 text-gray-700',
    // Bills
    pending: 'bg-amber-100 text-amber-800',
    partial: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    // Admissions
    admitted: 'bg-blue-100 text-blue-800',
    discharged: 'bg-green-100 text-green-800',
    transferred: 'bg-purple-100 text-purple-800',
    // Booleans
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-200 text-gray-700',
};

export default function StatusBadge({ status, label }) {
    const key = String(status ?? '').toLowerCase();
    const classes = COLORS[key] ?? 'bg-gray-100 text-gray-700';

    return (
        <span
            className={
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ' +
                classes
            }
        >
            {label ?? key.replace(/_/g, ' ')}
        </span>
    );
}
