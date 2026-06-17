import Checkbox from '@/Components/Checkbox';
import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function MedicineForm({ medicine = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: medicine?.name ?? '',
        generic_name: medicine?.generic_name ?? '',
        category: medicine?.category ?? '',
        unit: medicine?.unit ?? 'tablet',
        stock_quantity: medicine?.stock_quantity ?? 0,
        reorder_level: medicine?.reorder_level ?? 10,
        unit_price: medicine?.unit_price ?? '',
        expiry_date: medicine?.expiry_date ?? '',
        is_active: medicine?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        medicine ? put(route('medicines.update', medicine.id)) : post(route('medicines.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Name" error={errors.name} required>
                    <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </FormField>
                <FormField label="Generic Name" error={errors.generic_name}>
                    <TextInput className="w-full" value={data.generic_name} onChange={(e) => setData('generic_name', e.target.value)} />
                </FormField>
                <FormField label="Category" error={errors.category}>
                    <TextInput className="w-full" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                </FormField>
                <FormField label="Unit" error={errors.unit} required>
                    <TextInput className="w-full" value={data.unit} onChange={(e) => setData('unit', e.target.value)} />
                </FormField>
                <FormField label="Stock Quantity" error={errors.stock_quantity} required>
                    <TextInput type="number" min="0" className="w-full" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', e.target.value)} />
                </FormField>
                <FormField label="Reorder Level" error={errors.reorder_level} required>
                    <TextInput type="number" min="0" className="w-full" value={data.reorder_level} onChange={(e) => setData('reorder_level', e.target.value)} />
                </FormField>
                <FormField label="Unit Price" error={errors.unit_price} required>
                    <TextInput type="number" step="0.01" min="0" className="w-full" value={data.unit_price} onChange={(e) => setData('unit_price', e.target.value)} />
                </FormField>
                <FormField label="Expiry Date" error={errors.expiry_date}>
                    <TextInput type="date" className="w-full" value={data.expiry_date} onChange={(e) => setData('expiry_date', e.target.value)} />
                </FormField>
            </div>
            <label className="flex items-center gap-2">
                <Checkbox checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('medicines.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{medicine ? 'Update' : 'Add Medicine'}</PrimaryButton>
            </div>
        </form>
    );
}
