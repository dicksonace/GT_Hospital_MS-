import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function MedicalRecordForm({
    record = null,
    patients,
    doctors,
    appointments,
    selectedPatient = null,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: record?.patient_id ?? selectedPatient ?? '',
        doctor_id: record?.doctor_id ?? '',
        appointment_id: record?.appointment_id ?? '',
        visit_date: record?.visit_date ?? new Date().toISOString().slice(0, 10),
        symptoms: record?.symptoms ?? '',
        diagnosis: record?.diagnosis ?? '',
        prescription_notes: record?.prescription_notes ?? '',
        notes: record?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        record ? put(route('medical-records.update', record.id)) : post(route('medical-records.store'));
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
                <FormField label="Related Appointment" error={errors.appointment_id}>
                    <SelectInput className="w-full" value={data.appointment_id} onChange={(e) => setData('appointment_id', e.target.value)}>
                        <option value="">None</option>
                        {appointments.map((a) => (
                            <option key={a.id} value={a.id}>{a.appointment_number} — {a.patient?.first_name} {a.patient?.last_name}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Visit Date" error={errors.visit_date} required>
                    <TextInput type="date" className="w-full" value={data.visit_date} onChange={(e) => setData('visit_date', e.target.value)} />
                </FormField>
            </div>
            <FormField label="Symptoms" error={errors.symptoms}>
                <TextareaInput className="w-full" value={data.symptoms} onChange={(e) => setData('symptoms', e.target.value)} />
            </FormField>
            <FormField label="Diagnosis" error={errors.diagnosis}>
                <TextareaInput className="w-full" value={data.diagnosis} onChange={(e) => setData('diagnosis', e.target.value)} />
            </FormField>
            <FormField label="Prescription" error={errors.prescription_notes}>
                <TextareaInput className="w-full" value={data.prescription_notes} onChange={(e) => setData('prescription_notes', e.target.value)} />
            </FormField>
            <FormField label="Additional Notes" error={errors.notes}>
                <TextareaInput className="w-full" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
            </FormField>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('medical-records.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{record ? 'Update Record' : 'Create Record'}</PrimaryButton>
            </div>
        </form>
    );
}
