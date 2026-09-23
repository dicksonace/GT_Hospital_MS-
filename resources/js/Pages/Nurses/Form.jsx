import Checkbox from '@/Components/Checkbox';
import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function NurseForm({ nurse = null, departments, shifts }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: nurse?.user?.name ?? '',
        email: nurse?.user?.email ?? '',
        password: '',
        phone: nurse?.phone ?? '',
        department_id: nurse?.department_id ?? '',
        license_number: nurse?.license_number ?? '',
        shift: nurse?.shift ?? '',
        is_available: nurse?.is_available ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        nurse ? put(route('nurses.update', nurse.id)) : post(route('nurses.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Full Name" error={errors.name} required>
                    <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </FormField>
                <FormField label="Email (login)" error={errors.email} required>
                    <TextInput type="email" className="w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                </FormField>
                {!nurse && (
                    <FormField label="Password" error={errors.password} required>
                        <TextInput type="password" className="w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    </FormField>
                )}
                <FormField label="Phone" error={errors.phone}>
                    <TextInput className="w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                </FormField>
                <FormField label="Department" error={errors.department_id}>
                    <SelectInput className="w-full" value={data.department_id} onChange={(e) => setData('department_id', e.target.value)}>
                        <option value="">Select department</option>
                        {departments.map((dep) => (
                            <option key={dep.id} value={dep.id}>{dep.name}</option>
                        ))}
                    </SelectInput>
                </FormField>
                <FormField label="License Number" error={errors.license_number} required>
                    <TextInput className="w-full" value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} />
                </FormField>
                <FormField label="Shift" error={errors.shift}>
                    <SelectInput className="w-full" value={data.shift} onChange={(e) => setData('shift', e.target.value)}>
                        <option value="">Select shift</option>
                        {shifts.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </SelectInput>
                </FormField>
            </div>
            <label className="flex items-center gap-2">
                <Checkbox checked={data.is_available} onChange={(e) => setData('is_available', e.target.checked)} />
                <span className="text-sm text-gray-700">On duty / available</span>
            </label>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('nurses.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{nurse ? 'Update Nurse' : 'Create Nurse Login'}</PrimaryButton>
            </div>
        </form>
    );
}
