import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function AppointmentForm({
    appointment = null,
    patients,
    doctors,
    departments,
    statuses,
    types,
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        patient_id: appointment?.patient_id ?? '',
        doctor_id: appointment?.doctor_id ?? '',
        department_id: appointment?.department_id ?? '',
        appointment_date: appointment?.appointment_date ?? '',
        appointment_time: appointment?.appointment_time?.slice(0, 5) ?? '',
        type: appointment?.type ?? 'opd',
        status: appointment?.status ?? 'scheduled',
        reason: appointment?.reason ?? '',
        notes: appointment?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (appointment) {
            put(route('appointments.update', appointment.id));
        } else {
            post(route('appointments.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Patient" error={errors.patient_id} required>
                    <SelectInput
                        className="w-full"
                        value={data.patient_id}
                        onChange={(e) => setData('patient_id', e.target.value)}
                    >
                        <option value="">Select patient</option>
                        {patients.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.first_name} {p.last_name} ({p.patient_number})
                            </option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Doctor" error={errors.doctor_id} required>
                    <SelectInput
                        className="w-full"
                        value={data.doctor_id}
                        onChange={(e) => setData('doctor_id', e.target.value)}
                    >
                        <option value="">Select doctor</option>
                        {doctors.map((d) => (
                            <option key={d.id} value={d.id}>
                                Dr. {d.user?.name} — {d.specialization}
                            </option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Department" error={errors.department_id} required>
                    <SelectInput
                        className="w-full"
                        value={data.department_id}
                        onChange={(e) => setData('department_id', e.target.value)}
                    >
                        <option value="">Select department</option>
                        {departments.map((dep) => (
                            <option key={dep.id} value={dep.id}>
                                {dep.name}
                            </option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Type" error={errors.type} required>
                    <SelectInput
                        className="w-full"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                    >
                        {types.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Date" error={errors.appointment_date} required>
                    <TextInput
                        type="date"
                        className="w-full"
                        value={data.appointment_date}
                        onChange={(e) => setData('appointment_date', e.target.value)}
                    />
                </FormField>
                <FormField label="Time" error={errors.appointment_time} required>
                    <TextInput
                        type="time"
                        className="w-full"
                        value={data.appointment_time}
                        onChange={(e) => setData('appointment_time', e.target.value)}
                    />
                </FormField>
                <FormField label="Status" error={errors.status} required>
                    <SelectInput
                        className="w-full"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                    >
                        {statuses.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </SelectInput>
                </FormField>
            </div>

            <FormField label="Reason for Visit" error={errors.reason}>
                <TextareaInput
                    className="w-full"
                    value={data.reason}
                    onChange={(e) => setData('reason', e.target.value)}
                />
            </FormField>
            <FormField label="Notes" error={errors.notes}>
                <TextareaInput
                    className="w-full"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                />
            </FormField>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link
                    href={route('appointments.index')}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>
                    {appointment ? 'Update Appointment' : 'Schedule Appointment'}
                </PrimaryButton>
            </div>
        </form>
    );
}
