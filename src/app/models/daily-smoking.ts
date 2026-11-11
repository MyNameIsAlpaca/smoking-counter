export type DailySmokingStatus = 'green' | 'yellow' | 'red';

export function getDailySmokingStatus(total: number): DailySmokingStatus {
  if (total <= 75) {
    return 'green';
  }
  return total <= 85 ? 'yellow' : 'red';
}

export function getLocalDateKey(value: string): string {
  const date = new Date(value);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}
