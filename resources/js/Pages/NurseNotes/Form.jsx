import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function NurseNoteForm({
    note = null,
    patients,
    doctors,
    types,
    selectedPatient = null,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: note?.patient_id ?? selectedPatient ?? '',
        doctor_id: note?.doctor_id ?? '',
        note_type: note?.note_type ?? 'observation',
        blood_pressure: note?.blood_pressure ?? '',
        temperature: note?.temperature ?? '',
        pulse: note?.pulse ?? '',
        respiratory_rate: note?.respiratory_rate ?? '',
        oxygen_saturation: note?.oxygen_saturation ?? '',
        notes: note?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        note ? put(route('nurse-notes.update', note.id)) : post(route('nurse-notes.store'));
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
                <FormField label="Notify / assign doctor" error={errors.doctor_id}>
                    <SelectInput className="w-full" value={data.doctor_id} onChange={(e) => setData('doctor_id', e.target.value)}>
                        <option value="">No specific doctor</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>Dr. {d.user?.name} — {d.specialization}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Note type" error={errors.note_type} required>
                    <SelectInput className="w-full" value={data.note_type} onChange={(e) => setData('note_type', e.target.value)}>
                        {types.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Blood pressure" error={errors.blood_pressure}>
                    <TextInput className="w-full" placeholder="120/80" value={data.blood_pressure} onChange={(e) => setData('blood_pressure', e.target.value)} />
                </FormField>
                <FormField label="Temperature (°C)" error={errors.temperature}>
                    <TextInput type="number" step="0.1" className="w-full" value={data.temperature} onChange={(e) => setData('temperature', e.target.value)} />
                </FormField>
                <FormField label="Pulse" error={errors.pulse}>
                    <TextInput type="number" className="w-full" value={data.pulse} onChange={(e) => setData('pulse', e.target.value)} />
                </FormField>
                <FormField label="Respiratory rate" error={errors.respiratory_rate}>
                    <TextInput type="number" className="w-full" value={data.respiratory_rate} onChange={(e) => setData('respiratory_rate', e.target.value)} />
                </FormField>
                <FormField label="Oxygen saturation (%)" error={errors.oxygen_saturation}>
                    <TextInput type="number" className="w-full" value={data.oxygen_saturation} onChange={(e) => setData('oxygen_saturation', e.target.value)} />
                </FormField>
            </div>
            <FormField label="Nursing notes" error={errors.notes} required>
                <TextareaInput className="w-full" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
            </FormField>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('nurse-notes.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{note ? 'Update Note' : 'Save Note'}</PrimaryButton>
            </div>
        </form>
    );
}
