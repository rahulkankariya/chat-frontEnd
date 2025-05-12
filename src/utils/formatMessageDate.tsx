import { format, isToday, parseISO } from 'date-fns';

export function formatMessageTime(isoTime?: string | null): string {
  if (!isoTime) return ''; // or return '--' if you prefer a placeholder

  try {
    const date = parseISO(isoTime);
    return isToday(date)
      ? format(date, 'hh:mm a')        // e.g., 08:05 AM
      : format(date, 'dd MMM yyyy');   // e.g., 12 May 2025
  } catch (error) {
    console.error('Invalid date:', isoTime);
    return ''; // fallback in case of parse failure
  }
}
