import Checkbox from '@/Components/Checkbox';
import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function WardForm({ ward = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: ward?.name ?? '',
        type: ward?.type ?? 'general',
        capacity: ward?.capacity ?? 1,
        floor: ward?.floor ?? '',
        is_active: ward?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        ward ? put(route('wards.update', ward.id)) : post(route('wards.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Name" error={errors.name} required>
                    <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </FormField>
                <FormField label="Type" error={errors.type} required>
                    <SelectInput className="w-full" value={data.type} onChange={(e) => setData('type', e.target.value)}>
                        {['general', 'private', 'icu', 'emergency', 'maternity', 'pediatric'].map((t) => (
                            <option key={t} value={t} className="capitalize">{t}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Capacity (beds)" error={errors.capacity} required>
                    <TextInput type="number" min="1" className="w-full" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} />
                </FormField>
                <FormField label="Floor" error={errors.floor}>
                    <TextInput className="w-full" value={data.floor} onChange={(e) => setData('floor', e.target.value)} />
                </FormField>
            </div>
            <label className="flex items-center gap-2">
                <Checkbox checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('wards.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{ward ? 'Update' : 'Create'}</PrimaryButton>
            </div>
        </form>
    );
}
