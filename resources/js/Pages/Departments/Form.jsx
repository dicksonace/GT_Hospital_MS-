import Checkbox from '@/Components/Checkbox';
import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function DepartmentForm({ department = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: department?.name ?? '',
        description: department?.description ?? '',
        is_active: department?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        department
            ? put(route('departments.update', department.id))
            : post(route('departments.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <FormField label="Name" error={errors.name} required>
                <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormField>
            <FormField label="Description" error={errors.description}>
                <TextareaInput className="w-full" value={data.description} onChange={(e) => setData('description', e.target.value)} />
            </FormField>
            <label className="flex items-center gap-2">
                <Checkbox checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('departments.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{department ? 'Update' : 'Create'}</PrimaryButton>
            </div>
        </form>
    );
}
