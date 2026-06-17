import Checkbox from '@/Components/Checkbox';
import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function DoctorForm({ doctor = null, departments }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: doctor?.user?.name ?? '',
        email: doctor?.user?.email ?? '',
        password: '',
        phone: doctor?.phone ?? '',
        department_id: doctor?.department_id ?? '',
        specialization: doctor?.specialization ?? '',
        license_number: doctor?.license_number ?? '',
        is_available: doctor?.is_available ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        doctor ? put(route('doctors.update', doctor.id)) : post(route('doctors.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Full Name" error={errors.name} required>
                    <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </FormField>
                <FormField label="Email" error={errors.email} required>
                    <TextInput type="email" className="w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                </FormField>
                {!doctor && (
                    <FormField label="Password" error={errors.password} required>
                        <TextInput type="password" className="w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    </FormField>
                )}
                <FormField label="Phone" error={errors.phone}>
                    <TextInput className="w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                </FormField>
                <FormField label="Department" error={errors.department_id} required>
                    <SelectInput className="w-full" value={data.department_id} onChange={(e) => setData('department_id', e.target.value)}>
                        <option value="">Select department</option>
                        {departments.map((dep) => (
                            <option key={dep.id} value={dep.id}>{dep.name}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="Specialization" error={errors.specialization} required>
                    <TextInput className="w-full" value={data.specialization} onChange={(e) => setData('specialization', e.target.value)} />
                </FormField>
                <FormField label="License Number" error={errors.license_number} required>
                    <TextInput className="w-full" value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} />
                </FormField>
            </div>
            <label className="flex items-center gap-2">
                <Checkbox checked={data.is_available} onChange={(e) => setData('is_available', e.target.checked)} />
                <span className="text-sm text-gray-700">Available for appointments</span>
            </label>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('doctors.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{doctor ? 'Update Doctor' : 'Add Doctor'}</PrimaryButton>
            </div>
        </form>
    );
}
