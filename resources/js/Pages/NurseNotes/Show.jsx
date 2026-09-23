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

export default function Show({ note, canWrite }) {
    return (
        <AuthenticatedLayout header="Nurse Notes">
            <Head title="Nurse Note" />
            <PageHeader
                title={`${note.patient?.first_name} ${note.patient?.last_name}`}
                subtitle="Nursing observation"
                actions={
                    canWrite ? (
                        <LinkButton href={route('nurse-notes.edit', note.id)} variant="secondary">
                            <Pencil className="h-4 w-4" /> Edit
                        </LinkButton>
                    ) : null
                }
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Recorded by">
                    <dl className="space-y-4">
                        <Info label="Nurse" value={note.nurse?.user?.name} />
                        <Info label="Doctor" value={note.doctor?.user?.name ? `Dr. ${note.doctor.user.name}` : 'Not assigned'} />
                        <Info label="When" value={note.recorded_at} />
                        <div>
                            <dt className="text-xs uppercase tracking-wide text-gray-400">Type</dt>
                            <dd className="mt-1"><StatusBadge status={note.note_type} /></dd>
                        </div>
                    </dl>
                </Card>
                <Card title="Vitals & notes" className="lg:col-span-2">
                    <dl className="grid grid-cols-2 gap-4">
                        <Info label="Blood pressure" value={note.blood_pressure} />
                        <Info label="Temperature" value={note.temperature ? `${note.temperature} °C` : null} />
                        <Info label="Pulse" value={note.pulse} />
                        <Info label="Respiratory rate" value={note.respiratory_rate} />
                        <Info label="Oxygen saturation" value={note.oxygen_saturation ? `${note.oxygen_saturation}%` : null} />
                    </dl>
                    <div className="mt-4 border-t border-gray-100 pt-4">
                        <Info label="Notes" value={note.notes} />
                    </div>
                    <div className="mt-4">
                        <Link href={route('patients.show', note.patient_id)} className="text-sm font-medium text-indigo-600 hover:underline">
                            Open patient chart
                        </Link>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
