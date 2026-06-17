import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function DeleteButton({
    routeName,
    routeParams,
    label = 'Delete',
    title = 'Confirm deletion',
    message = 'Are you sure? This action cannot be undone.',
    iconOnly = false,
}) {
    const [confirming, setConfirming] = useState(false);
    const { delete: destroy, processing } = useForm();

    const submit = () => {
        destroy(route(routeName, routeParams), {
            onSuccess: () => setConfirming(false),
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className={
                    iconOnly
                        ? 'rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600'
                        : 'inline-flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700'
                }
            >
                <Trash2 className="h-4 w-4" />
                {!iconOnly && label}
            </button>

            <Modal show={confirming} onClose={() => setConfirming(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">{message}</p>
                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton onClick={() => setConfirming(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={submit} disabled={processing}>
                            {label}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </>
    );
}
