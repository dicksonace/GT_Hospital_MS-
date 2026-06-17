import DeleteButton from '@/Components/DeleteButton';
import EmptyState from '@/Components/EmptyState';
import LinkButton from '@/Components/LinkButton';
import PageHeader from '@/Components/PageHeader';
import Pagination from '@/Components/Pagination';
import SearchBar from '@/Components/SearchBar';
import SelectInput from '@/Components/SelectInput';
import StatusBadge from '@/Components/StatusBadge';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BedDouble, Eye, Pencil, Plus } from 'lucide-react';

export default function Index({ admissions, filters, statuses }) {
    const applyFilter = (value) => {
        router.get(route('admissions.index'), { ...filters, status: value }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout header="Admissions">
            <Head title="Admissions" />
            <PageHeader
                title="Admissions (IPD)"
                subtitle="Inpatient admissions and bed allocation"
                actions={
                    <LinkButton href={route('admissions.create')}>
                        <Plus className="h-4 w-4" /> New Admission
                    </LinkButton>
                }
            />
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
                    <SearchBar routeName="admissions.index" initial={filters.search} placeholder="Search admission or patient..." extra={{ status: filters.status }} />
                    <SelectInput className="text-sm" value={filters.status ?? ''} onChange={(e) => applyFilter(e.target.value)}>
                        <option value="">All statuses</option>
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </SelectInput>
                </div>
                {admissions.data.length === 0 ? (
                    <EmptyState message="No admissions found." icon={BedDouble} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 text-sm">
                            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Admission #</th>
                                    <th className="px-4 py-3">Patient</th>
                                    <th className="px-4 py-3">Ward / Bed</th>
                                    <th className="px-4 py-3">Admitted</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {admissions.data.map((adm) => (
                                    <tr key={adm.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{adm.admission_number}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {adm.patient?.first_name} {adm.patient?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {adm.ward?.name} · Bed {adm.bed_number}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{adm.admission_date}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={adm.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={route('admissions.show', adm.id)} className="rounded p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link href={route('admissions.edit', adm.id)} className="rounded p-1.5 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <DeleteButton routeName="admissions.destroy" routeParams={adm.id} iconOnly />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="p-4">
                    <Pagination links={admissions.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
