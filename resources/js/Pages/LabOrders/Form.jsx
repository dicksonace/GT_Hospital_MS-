import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import { Link, useForm } from '@inertiajs/react';

export default function LabOrderForm({
    labOrder = null,
    patients,
    doctors,
    labTests,
    appointments,
    statuses,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: labOrder?.patient_id ?? '',
        doctor_id: labOrder?.doctor_id ?? '',
        appointment_id: labOrder?.appointment_id ?? '',
        lab_test_id: labOrder?.lab_test_id ?? '',
        status: labOrder?.status ?? 'pending',
        result: labOrder?.result ?? '',
        notes: labOrder?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        labOrder ? put(route('lab-orders.update', labOrder.id)) : post(route('lab-orders.store'));
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
                <FormField label="Doctor" error={errors.doctor_id} required>
                    <SelectInput className="w-full" value={data.doctor_id} onChange={(e) => setData('doctor_id', e.target.value)}>
                        <option value="">Select doctor</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>Dr. {d.user?.name}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Lab Test" error={errors.lab_test_id} required>
                    <SelectInput className="w-full" value={data.lab_test_id} onChange={(e) => setData('lab_test_id', e.target.value)}>
                        <option value="">Select test</option>
                        {labTests.map((t) => (
                            <option key={t.id} value={t.id}>{t.name} (${Number(t.price).toFixed(2)})</option>
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
                <FormField label="Status" error={errors.status} required>
                    <SelectInput className="w-full" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </SelectInput>
                </FormField>
            </div>
            <FormField label="Result" error={errors.result}>
                <TextareaInput className="w-full" value={data.result} onChange={(e) => setData('result', e.target.value)} />
            </FormField>
            <FormField label="Notes" error={errors.notes}>
                <TextareaInput className="w-full" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
            </FormField>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('lab-orders.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{labOrder ? 'Update Order' : 'Create Order'}</PrimaryButton>
            </div>
        </form>
    );
}
