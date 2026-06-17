import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextareaInput from '@/Components/TextareaInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function PatientForm({ patient = null, genders }) {
    const { data, setData, post, put, processing, errors } = useForm({
        first_name: patient?.first_name ?? '',
        last_name: patient?.last_name ?? '',
        gender: patient?.gender ?? 'male',
        date_of_birth: patient?.date_of_birth ?? '',
        blood_group: patient?.blood_group ?? '',
        phone: patient?.phone ?? '',
        email: patient?.email ?? '',
        address: patient?.address ?? '',
        emergency_contact_name: patient?.emergency_contact_name ?? '',
        emergency_contact_phone: patient?.emergency_contact_phone ?? '',
        allergies: patient?.allergies ?? '',
        medical_history: patient?.medical_history ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (patient) {
            put(route('patients.update', patient.id));
        } else {
            post(route('patients.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-8">
            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="First Name" error={errors.first_name} required>
                        <TextInput
                            className="w-full"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Last Name" error={errors.last_name} required>
                        <TextInput
                            className="w-full"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Gender" error={errors.gender} required>
                        <SelectInput
                            className="w-full"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                        >
                            {genders.map((g) => (
                                <option key={g.value} value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </SelectInput>
                    </FormField>
                    <FormField label="Date of Birth" error={errors.date_of_birth} required>
                        <TextInput
                            type="date"
                            className="w-full"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Blood Group" error={errors.blood_group}>
                        <SelectInput
                            className="w-full"
                            value={data.blood_group}
                            onChange={(e) => setData('blood_group', e.target.value)}
                        >
                            <option value="">Unknown</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                                <option key={bg} value={bg}>
                                    {bg}
                                </option>
                            ))}
                        </SelectInput>
                    </FormField>
                </div>
            </section>

            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Phone" error={errors.phone} required>
                        <TextInput
                            className="w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Email" error={errors.email}>
                        <TextInput
                            type="email"
                            className="w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Address" error={errors.address} className="sm:col-span-2">
                        <TextareaInput
                            className="w-full"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Emergency Contact Name" error={errors.emergency_contact_name}>
                        <TextInput
                            className="w-full"
                            value={data.emergency_contact_name}
                            onChange={(e) => setData('emergency_contact_name', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Emergency Contact Phone" error={errors.emergency_contact_phone}>
                        <TextInput
                            className="w-full"
                            value={data.emergency_contact_phone}
                            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                        />
                    </FormField>
                </div>
            </section>

            <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Medical
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Known Allergies" error={errors.allergies}>
                        <TextareaInput
                            className="w-full"
                            value={data.allergies}
                            onChange={(e) => setData('allergies', e.target.value)}
                        />
                    </FormField>
                    <FormField label="Medical History" error={errors.medical_history}>
                        <TextareaInput
                            className="w-full"
                            value={data.medical_history}
                            onChange={(e) => setData('medical_history', e.target.value)}
                        />
                    </FormField>
                </div>
            </section>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link
                    href={route('patients.index')}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>
                    {patient ? 'Update Patient' : 'Register Patient'}
                </PrimaryButton>
            </div>
        </form>
    );
}
