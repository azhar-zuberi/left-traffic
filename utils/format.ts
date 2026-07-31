export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatLogbookDate(isoDate: string): { month: string; day: string } {
  const date = new Date(isoDate);
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
  };
}
