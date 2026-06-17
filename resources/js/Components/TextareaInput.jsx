import { forwardRef } from 'react';

export default forwardRef(function TextareaInput(
    { className = '', rows = 3, ...props },
    ref,
) {
    return (
        <textarea
            {...props}
            rows={rows}
            ref={ref}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
                className
            }
        />
    );
});
