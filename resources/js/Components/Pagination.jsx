import { Link } from '@inertiajs/react';

export default function Pagination({ links = [], meta = null }) {
    const items = links.length ? links : meta?.links ?? [];

    if (items.length <= 3) {
        return null;
    }

    return (
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-1">
            {items.map((link, index) => {
                const label = link.label
                    .replace('&laquo;', '«')
                    .replace('&raquo;', '»');

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="rounded-md px-3 py-1.5 text-sm text-gray-400"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={
                            'rounded-md px-3 py-1.5 text-sm transition ' +
                            (link.active
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100')
                        }
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </nav>
    );
}
