import Checkbox from '@/Components/Checkbox';
import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function LabTestForm({ labTest = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: labTest?.name ?? '',
        code: labTest?.code ?? '',
        category: labTest?.category ?? '',
        price: labTest?.price ?? '',
        normal_range: labTest?.normal_range ?? '',
        unit: labTest?.unit ?? '',
        is_active: labTest?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        labTest ? put(route('lab-tests.update', labTest.id)) : post(route('lab-tests.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Name" error={errors.name} required>
                    <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </FormField>
                <FormField label="Code" error={errors.code} required>
                    <TextInput className="w-full" value={data.code} onChange={(e) => setData('code', e.target.value)} />
                </FormField>
                <FormField label="Category" error={errors.category}>
                    <TextInput className="w-full" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                </FormField>
                <FormField label="Price" error={errors.price} required>
                    <TextInput type="number" step="0.01" min="0" className="w-full" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                </FormField>
                <FormField label="Normal Range" error={errors.normal_range}>
                    <TextInput className="w-full" value={data.normal_range} onChange={(e) => setData('normal_range', e.target.value)} />
                </FormField>
                <FormField label="Unit" error={errors.unit}>
                    <TextInput className="w-full" value={data.unit} onChange={(e) => setData('unit', e.target.value)} />
                </FormField>
            </div>
            <label className="flex items-center gap-2">
                <Checkbox checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('lab-tests.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{labTest ? 'Update' : 'Create'}</PrimaryButton>
            </div>
        </form>
    );
}
