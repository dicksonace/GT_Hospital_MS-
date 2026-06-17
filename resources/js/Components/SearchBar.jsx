import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({
    routeName,
    initial = '',
    placeholder = 'Search...',
    extra = {},
}) {
    const [value, setValue] = useState(initial);

    const submit = (e) => {
        e.preventDefault();
        router.get(
            route(routeName),
            { ...extra, search: value },
            { preserveState: true, replace: true },
        );
    };

    return (
        <form onSubmit={submit} className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border-gray-300 pl-9 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </form>
    );
}
