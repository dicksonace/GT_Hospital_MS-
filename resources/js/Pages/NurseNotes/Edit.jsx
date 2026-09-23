import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import NurseNoteForm from './Form';

export default function Edit(props) {
    return (
        <AuthenticatedLayout header="Nurse Notes">
            <Head title="Edit Nurse Note" />
            <PageHeader title="Edit Nurse Note" />
            <Card className="max-w-4xl">
                <NurseNoteForm {...props} />
            </Card>
        </AuthenticatedLayout>
    );
}
