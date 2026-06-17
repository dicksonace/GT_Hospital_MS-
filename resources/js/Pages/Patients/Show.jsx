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
            <dt className="text-xs uppercase tracking-wide text-gray-400">
                {label}
            </dt>
            <dd className="mt-0.5 text-sm text-gray-800">{value || '—'}</dd>
        </div>
    );
}

export default function Show({ patient }) {
    return (
        <AuthenticatedLayout header="Patients">
            <Head title={`${patient.first_name} ${patient.last_name}`} />

            <PageHeader
                title={`${patient.first_name} ${patient.last_name}`}
                subtitle={patient.patient_number}
                actions={
                    <LinkButton href={route('patients.edit', patient.id)} variant="secondary">
                        <Pencil className="h-4 w-4" /> Edit
                    </LinkButton>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-1">
                    <Card title="Demographics">
                        <dl className="grid grid-cols-2 gap-4">
                            <Info label="Gender" value={patient.gender} />
                            <Info label="Date of Birth" value={patient.date_of_birth} />
                            <Info label="Blood Group" value={patient.blood_group} />
                            <Info label="Phone" value={patient.phone} />
                            <Info label="Email" value={patient.email} />
                        </dl>
                        <div className="mt-4 border-t border-gray-100 pt-4">
                            <Info label="Address" value={patient.address} />
                        </div>
                    </Card>

                    <Card title="Emergency Contact">
                        <dl className="grid grid-cols-1 gap-4">
                            <Info label="Name" value={patient.emergency_contact_name} />
                            <Info label="Phone" value={patient.emergency_contact_phone} />
                        </dl>
                    </Card>

                    <Card title="Medical Notes">
                        <dl className="space-y-4">
                            <Info label="Allergies" value={patient.allergies} />
                            <Info label="History" value={patient.medical_history} />
                        </dl>
                    </Card>
                </div>

                <div className="space-y-6 lg:col-span-2">
                    <Card title="Appointments">
                        {patient.appointments?.length ? (
                            <ul className="divide-y divide-gray-50">
                                {patient.appointments.map((apt) => (
                                    <li key={apt.id} className="flex items-center justify-between py-2">
                                        <div>
                                            <Link
                                                href={route('appointments.show', apt.id)}
                                                className="text-sm font-medium text-indigo-600 hover:underline"
                                            >
                                                {apt.appointment_number}
                                            </Link>
                                            <p className="text-xs text-gray-500">
                                                Dr. {apt.doctor?.user?.name} · {apt.appointment_date}
                                            </p>
                                        </div>
                                        <StatusBadge status={apt.status} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No appointments.</p>
                        )}
                    </Card>

                    <Card title="Medical Records">
                        {patient.medical_records?.length ? (
                            <ul className="divide-y divide-gray-50">
                                {patient.medical_records.map((rec) => (
                                    <li key={rec.id} className="py-2">
                                        <Link
                                            href={route('medical-records.show', rec.id)}
                                            className="text-sm font-medium text-indigo-600 hover:underline"
                                        >
                                            {rec.visit_date} · Dr. {rec.doctor?.user?.name}
                                        </Link>
                                        <p className="text-xs text-gray-500">
                                            {rec.diagnosis || 'No diagnosis recorded'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No records.</p>
                        )}
                    </Card>

                    <Card title="Bills">
                        {patient.bills?.length ? (
                            <ul className="divide-y divide-gray-50">
                                {patient.bills.map((bill) => (
                                    <li key={bill.id} className="flex items-center justify-between py-2">
                                        <Link
                                            href={route('bills.show', bill.id)}
                                            className="text-sm font-medium text-indigo-600 hover:underline"
                                        >
                                            {bill.bill_number}
                                        </Link>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-700">
                                                ${Number(bill.total_amount).toFixed(2)}
                                            </span>
                                            <StatusBadge status={bill.status} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">No bills.</p>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
