/** Ghana Cedi (GHS) display helper used across billing, pharmacy, lab, and reports. */
export const CURRENCY_CODE = 'GHS';
export const CURRENCY_SYMBOL = 'GH₵';

export function formatMoney(value) {
    const amount = Number(value);
    const safe = Number.isFinite(amount) ? amount : 0;

    return `${CURRENCY_SYMBOL} ${safe.toLocaleString('en-GH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}
