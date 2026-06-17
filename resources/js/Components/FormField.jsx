import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function FormField({ label, error, required, children, className = '' }) {
    return (
        <div className={className}>
            {label && (
                <InputLabel value={required ? `${label} *` : label} />
            )}
            <div className="mt-1">{children}</div>
            <InputError message={error} className="mt-1" />
        </div>
    );
}
