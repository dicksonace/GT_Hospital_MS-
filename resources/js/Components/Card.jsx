export default function Card({ title, actions, children, className = '' }) {
    return (
        <div
            className={
                'overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm ' +
                className
            }
        >
            {(title || actions) && (
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    {title && (
                        <h2 className="text-base font-semibold text-gray-800">
                            {title}
                        </h2>
                    )}
                    {actions}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
