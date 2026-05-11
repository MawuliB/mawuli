import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a "YYYY-MM" or "YYYY-MM-DD" date string as "Mon YYYY".
 * Passes "Present" through unchanged. Empty input → "".
 */
@Pipe({ name: 'portfolioDate', standalone: true })
export class PortfolioDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    if (value === 'Present') return 'Present';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}

/**
 * Computes a human duration between two dates ("3 years, 2 months").
 * `endDate === undefined` or `"Present"` resolves to today.
 */
@Pipe({ name: 'portfolioDuration', standalone: true })
export class PortfolioDurationPipe implements PipeTransform {
  transform(startDate: string, endDate?: string | 'Present'): string {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = !endDate || endDate === 'Present' ? new Date() : new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (months < 1) return '< 1 month';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${
      remainingMonths !== 1 ? 's' : ''
    }`;
  }
}
