import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BedDouble, Pencil, Plus } from 'lucide-react';

export default function Index({ wards }) {
    return (
        <AuthenticatedLayout header="Wards">
            <Head title="Wards" />
            <PageHeader
                title="Wards & Beds"
                subtitle="Inpatient capacity management"
                actions={
                    <LinkButton href={route('wards.create')}>
                        <Plus className="h-4 w-4" /> New Ward
                    </LinkButton>
                }
            />
            {wards.data.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                    <EmptyState message="No wards configured." icon={BedDouble} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wards.data.map((ward) => {
                        const available = Math.max(0, ward.capacity - ward.occupied_beds);
                        return (
                            <div key={ward.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{ward.name}</h3>
                                        <p className="text-xs capitalize text-gray-500">
                                            {ward.type} · Floor {ward.floor ?? '—'}
                                        </p>
                                    </div>
                                    <StatusBadge status={ward.is_active ? 'active' : 'inactive'} />
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Beds</span>
                                    <span className="font-medium text-gray-800">
                                        {ward.occupied_beds} / {ward.capacity} used
                                    </span>
                                </div>
                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full bg-indigo-500"
                                        style={{ width: `${ward.capacity ? (ward.occupied_beds / ward.capacity) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{available} beds available</p>
                                <div className="mt-4 flex items-center justify-end gap-1 border-t border-gray-100 pt-3">
                                    <Link href={route('wards.edit', ward.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                    <DeleteButton routeName="wards.destroy" routeParams={ward.id} iconOnly />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="mt-4">
                <Pagination links={wards.links} />
            </div>
        </AuthenticatedLayout>
    );
}
