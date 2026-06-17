import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

function Stat({ label, value, accent }) {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className={'mt-1 text-2xl font-bold ' + (accent ?? 'text-gray-900')}>{value}</p>
        </div>
    );
}

export default function Index({
    summary,
    billsByStatus,
    appointmentsByDepartment,
    revenueByMonth,
    topDoctors,
}) {
    const maxRevenue = Math.max(1, ...revenueByMonth.map((r) => Number(r.revenue)));

    return (
        <AuthenticatedLayout header="Reports">
            <Head title="Reports" />
            <PageHeader title="Reports & Analytics" subtitle="Operational and financial overview" />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat label="Total Patients" value={summary.total_patients} />
                <Stat label="Total Doctors" value={summary.total_doctors} />
                <Stat label="Appointments (Month)" value={summary.appointments_this_month} />
                <Stat label="Active Admissions" value={summary.active_admissions} />
                <Stat label="Total Revenue" value={`$${summary.total_revenue.toFixed(2)}`} accent="text-green-600" />
                <Stat label="Outstanding" value={`$${summary.outstanding_balance.toFixed(2)}`} accent="text-red-600" />
                <Stat label="Low Stock Meds" value={summary.low_stock_medicines} accent="text-amber-600" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="Monthly Revenue">
                    {revenueByMonth.length === 0 ? (
                        <p className="text-sm text-gray-500">No revenue data yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {revenueByMonth.map((row) => (
                                <div key={row.month}>
                                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                                        <span>{row.month}</span>
                                        <span>${Number(row.revenue).toFixed(2)}</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full bg-indigo-500"
                                            style={{ width: `${(Number(row.revenue) / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card title="Bills by Status">
                    <div className="space-y-3">
                        {billsByStatus.map((row) => (
                            <div key={row.status} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{row.status}</span>
                                <span className="text-gray-500">
                                    {row.count} bills ·{' '}
                                    <span className="font-medium text-gray-800">${row.amount.toFixed(2)}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Appointments by Department">
                    {appointmentsByDepartment.length === 0 ? (
                        <p className="text-sm text-gray-500">No appointments yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {appointmentsByDepartment.map((row) => (
                                <div key={row.name} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{row.name}</span>
                                    <span className="font-medium text-gray-800">{row.total}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card title="Top Doctors by Appointments">
                    {topDoctors.length === 0 ? (
                        <p className="text-sm text-gray-500">No data yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {topDoctors.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Dr. {doc.user?.name}</span>
                                    <span className="font-medium text-gray-800">{doc.appointments_count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
