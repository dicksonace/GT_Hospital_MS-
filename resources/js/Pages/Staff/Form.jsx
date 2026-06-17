import FormField from '@/Components/FormField';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';

export default function StaffForm({ staff = null, roles }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: staff?.name ?? '',
        email: staff?.email ?? '',
        password: '',
        phone: staff?.phone ?? '',
        role: staff?.role ?? 'receptionist',
    });

    const submit = (e) => {
        e.preventDefault();
        staff ? put(route('staff.update', staff.id)) : post(route('staff.store'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Name" error={errors.name} required>
                    <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                </FormField>
                <FormField label="Email" error={errors.email} required>
                    <TextInput type="email" className="w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                </FormField>
                <FormField
                    label={staff ? 'New Password (leave blank to keep)' : 'Password'}
                    error={errors.password}
                    required={!staff}
                >
                    <TextInput type="password" className="w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                </FormField>
                <FormField label="Phone" error={errors.phone}>
                    <TextInput className="w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                </FormField>
                <FormField label="Role" error={errors.role} required>
                    <SelectInput className="w-full" value={data.role} onChange={(e) => setData('role', e.target.value)}>
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </SelectInput>
                </FormField>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <Link href={route('staff.index')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </Link>
                <PrimaryButton disabled={processing}>{staff ? 'Update' : 'Create'}</PrimaryButton>
            </div>
        </form>
    );
}
