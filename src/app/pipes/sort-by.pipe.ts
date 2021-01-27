import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

    transform<T>(values: T[], column: string = '', order: 'asc' | 'desc' = 'asc'): T[] {
        if (!values || values.length <= 1) {
            return values;
        }

        let sorted: T[];
        if (!column || column === '') {
            sorted = values.sort();
        } else {
            sorted = values.sort((a: any, b: any) => {
                const p1 = a[column];
                const p2 = b[column];
                return p1 > p2 ? 1 : (p1 < p2 ? -1 : 0);
            });
        }

        return order === 'asc' ? sorted : sorted.reverse();
    }
}
