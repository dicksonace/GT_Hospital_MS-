import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdmissionForm from './Form';

export default function Edit({ admission, ...props }) {
    return (
        <AuthenticatedLayout header="Admissions">
            <Head title="Edit Admission" />
            <PageHeader title="Edit Admission" subtitle={admission.admission_number} />
            <Card className="max-w-4xl">
                <AdmissionForm admission={admission} {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
