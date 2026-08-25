export const MARATHI_DIGITS = "०१२३४५६७८९";

export function normalizeDigits(value: string) {
  return value.replace(/[०-९]/g, (digit) => String(MARATHI_DIGITS.indexOf(digit)));
}

export function toMarathiDigits(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\d/g, (digit) => MARATHI_DIGITS[Number(digit)]);
}
