import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

export default function BillForm({
    bill = null,
    patients,
    appointments,
    statuses,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: bill?.patient_id ?? '',
        appointment_id: bill?.appointment_id ?? '',
        paid_amount: bill?.paid_amount ?? 0,
        status: bill?.status ?? 'pending',
        issued_at: bill?.issued_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        due_at: bill?.due_at?.slice(0, 10) ?? '',
        notes: bill?.notes ?? '',
        items: bill?.items?.length
            ? bill.items.map((i) => ({
                  description: i.description,
                  quantity: i.quantity,
                  unit_price: i.unit_price,
              }))
            : [{ description: '', quantity: 1, unit_price: '' }],
    });

    const updateItem = (index, key, value) => {
        const items = [...data.items];
        items[index][key] = value;
        setData('items', items);
    };

    const addItem = () => setData('items', [...data.items, { description: '', quantity: 1, unit_price: '' }]);
    const removeItem = (index) => setData('items', data.items.filter((_, i) => i !== index));

    const total = data.items.reduce(
        (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0),
        0,
    );

    const submit = (e) => {
        e.preventDefault();
        bill ? put(route('bills.update', bill.id)) : post(route('bills.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Patient" error={errors.patient_id} required>
                    <SelectInput className="w-full" value={data.patient_id} onChange={(e) => setData('patient_id', e.target.value)}>
                        <option value="">Select patient</option>
                        {patients.map((p) => (
                            <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.patient_number})</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Related Appointment" error={errors.appointment_id}>
                    <SelectInput className="w-full" value={data.appointment_id} onChange={(e) => setData('appointment_id', e.target.value)}>
                        <option value="">None</option>
                        {appointments.map((a) => (
                            <option key={a.id} value={a.id}>{a.appointment_number}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Issued Date" error={errors.issued_at}>
                    <TextInput type="date" className="w-full" value={data.issued_at} onChange={(e) => setData('issued_at', e.target.value)} />
                </FormField>
                <FormField label="Due Date" error={errors.due_at}>
                    <TextInput type="date" className="w-full" value={data.due_at} onChange={(e) => setData('due_at', e.target.value)} />
                </FormField>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Line Items</h3>
                    <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
                        <Plus className="h-4 w-4" /> Add Item
                    </button>
                </div>
                <div className="space-y-2">
                    {data.items.map((item, index) => (
                        <div key={index} className="flex items-end gap-2">
                            <div className="flex-1">
                                <TextInput
                                    placeholder="Description"
                                    className="w-full"
                                    value={item.description}
                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                />
                            </div>
                            <div className="w-20">
                                <TextInput
                                    type="number"
                                    min="1"
                                    placeholder="Qty"
                                    className="w-full"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                />
                            </div>
                            <div className="w-28">
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Price"
                                    className="w-full"
                                    value={item.unit_price}
                                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                disabled={data.items.length === 1}
                                className="mb-1 rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
                {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs uppercase text-gray-400">Total</p>
                    <p className="text-xl font-bold text-gray-900">${total.toFixed(2)}</p>
                </div>
                <FormField label="Paid Amount" error={errors.paid_amount}>
                    <TextInput type="number" step="0.01" min="0" className="w-full" value={data.paid_amount} onChange={(e) => setData('paid_amount', e.target.value)} />
                </FormField>
                {bill && (
                    <FormField label="Status" error={errors.status}>
                        <SelectInput className="w-full" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                            {statuses.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </SelectInput>
                    </FormField>
                )}
            </div>

            <FormField label="Notes" error={errors.notes}>
                <TextareaInput className="w-full" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
            </FormField>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('bills.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{bill ? 'Update Bill' : 'Create Bill'}</PrimaryButton>
            </div>
        </form>
    );
}
