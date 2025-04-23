import { useMemo } from 'react';

export const useYearDifference = (startDate, endDate) => {
  const yearDiff = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    let years = end.getFullYear() - start.getFullYear();

    if (end.getMonth() < start.getMonth() || (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())) {
      years--;
    }

    return years;
  }, [startDate, endDate]);

  return yearDiff;
};
