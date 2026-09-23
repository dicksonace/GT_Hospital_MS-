import Card from '@/Components/Card';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

function Info({ label, value }) {
    return (
        <div>
            <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
            <dd className="mt-0.5 text-sm text-gray-800">{value || '—'}</dd>
        </div>
    );
}

export default function Show({ nurse }) {
    return (
        <AuthenticatedLayout header="Nurses">
            <Head title={nurse.user?.name} />
            <PageHeader
                title={nurse.user?.name}
                subtitle="Nurse profile and recent notes"
                actions={
                    <LinkButton href={route('nurses.edit', nurse.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Login & Profile">
                    <dl className="space-y-4">
                        <Info label="Email / Login" value={nurse.user?.email} />
                        <Info label="Phone" value={nurse.phone} />
                        <Info label="Department" value={nurse.department?.name} />
                        <Info label="License" value={nurse.license_number} />
                        <Info label="Shift" value={nurse.shift} />
                        <div>
                            <dt className="text-xs uppercase tracking-wide text-gray-400">Status</dt>
                            <dd className="mt-1">
                                <StatusBadge status={nurse.is_available ? 'active' : 'inactive'} label={nurse.is_available ? 'On duty' : 'Off'} />
                            </dd>
                        </div>
                    </dl>
                </Card>
                <Card title="Recent Nursing Notes" className="lg:col-span-2">
                    {nurse.notes?.length ? (
                        <ul className="divide-y divide-gray-50">
                            {nurse.notes.map((note) => (
                                <li key={note.id} className="py-2">
                                    <Link href={route('nurse-notes.show', note.id)} className="text-sm font-medium text-indigo-600 hover:underline">
                                        {note.patient?.first_name} {note.patient?.last_name}
                                    </Link>
                                    <p className="text-xs text-gray-500">
                                        {note.note_type} · {note.recorded_at}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No notes recorded yet.</p>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
