import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function AdmissionForm({
    admission = null,
    patients,
    doctors,
    wards,
    statuses,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: admission?.patient_id ?? '',
        doctor_id: admission?.doctor_id ?? '',
        ward_id: admission?.ward_id ?? '',
        bed_number: admission?.bed_number ?? '',
        admission_date: admission?.admission_date ?? new Date().toISOString().slice(0, 10),
        discharge_date: admission?.discharge_date ?? '',
        status: admission?.status ?? 'admitted',
        diagnosis: admission?.diagnosis ?? '',
        notes: admission?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        admission ? put(route('admissions.update', admission.id)) : post(route('admissions.store'));
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
                <FormField label="Attending Doctor" error={errors.doctor_id} required>
                    <SelectInput className="w-full" value={data.doctor_id} onChange={(e) => setData('doctor_id', e.target.value)}>
                        <option value="">Select doctor</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>Dr. {d.user?.name}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Ward" error={errors.ward_id} required>
                    <SelectInput className="w-full" value={data.ward_id} onChange={(e) => setData('ward_id', e.target.value)}>
                        <option value="">Select ward</option>
                        {wards.map((w) => (
                            <option key={w.id} value={w.id}>
                                {w.name} ({Math.max(0, w.capacity - w.occupied_beds)} free)
                            </option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Bed Number" error={errors.bed_number} required>
                    <TextInput className="w-full" value={data.bed_number} onChange={(e) => setData('bed_number', e.target.value)} />
                </FormField>
                <FormField label="Admission Date" error={errors.admission_date} required>
                    <TextInput type="date" className="w-full" value={data.admission_date} onChange={(e) => setData('admission_date', e.target.value)} />
                </FormField>
                <FormField label="Discharge Date" error={errors.discharge_date}>
                    <TextInput type="date" className="w-full" value={data.discharge_date} onChange={(e) => setData('discharge_date', e.target.value)} />
                </FormField>
                <FormField label="Status" error={errors.status} required>
                    <SelectInput className="w-full" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </SelectInput>
                </FormField>
            </div>
            <FormField label="Diagnosis" error={errors.diagnosis}>
                <TextareaInput className="w-full" value={data.diagnosis} onChange={(e) => setData('diagnosis', e.target.value)} />
            </FormField>
            <FormField label="Notes" error={errors.notes}>
                <TextareaInput className="w-full" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
            </FormField>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('admissions.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{admission ? 'Update Admission' : 'Admit Patient'}</PrimaryButton>
            </div>
        </form>
    );
}
