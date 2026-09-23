import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NurseNoteForm from './Form';

export default function Create(props) {
    return (
        <AuthenticatedLayout header="Nurse Notes">
            <Head title="New Nurse Note" />
            <PageHeader title="Record Nurse Note" subtitle="Doctors assigned to this patient can open and review this note" />
            <Card className="max-w-4xl">
                <NurseNoteForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
