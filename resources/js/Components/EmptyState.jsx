import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'No records found.', icon: Icon = Inbox }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">{message}</p>
        </div>
    );
}
