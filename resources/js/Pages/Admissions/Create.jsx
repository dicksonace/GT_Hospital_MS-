import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdmissionForm from './Form';

export default function Create(props) {
    return (
        <AuthenticatedLayout header="Admissions">
            <Head title="New Admission" />
            <PageHeader title="New Admission or Checkup" subtitle="Choose Checkup in Status for an outpatient visit" />
            <Card className="max-w-4xl">
                <AdmissionForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
