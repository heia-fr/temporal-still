import { ChartData, TemporalEntity } from './TemporalEntity';
import { BooleanSignal } from './BooleanSignal';

/**
 * This class defines a TemporalFormula
 *
 * @param id
 *           the identifier of the temporal formula
 * @param formulaString
 *           the string representation of the formula
 * @param booleanSignal
 *           the evaluated representation of the formula
 * @param references
 *           an array of referenced boolean signals' IDs
 * @param other
 *           an other temporal formula to copy from. It must be a valid
 *           TemporalFormula
 */
export class TemporalFormula extends TemporalEntity {

    public __type = 'TemporalFormula';

    protected booleanSignal: BooleanSignal;

    constructor(
        id: string | null,
        formulaString: string | null,
        booleanSignal: TemporalEntity | null,
        references: string[] | null,
        other: TemporalFormula | null = null
    ) {
        super(id, formulaString, other);

        if (!other) {
            if (!(booleanSignal instanceof BooleanSignal)) {
                throw new TypeError('TemporalFormula: Expected "booleanSignal" to be "BooleanSignal" object');
            }
            if (!(references instanceof Array)) {
                throw new TypeError('TemporalFormula: Expected "references" to be "Array" object');
            }

            // Array of referenced boolean signals
            this.references = references;
            // the evaluated representation of the temporal formula
            this.booleanSignal = new BooleanSignal(null, booleanSignal);
            this.booleanSignal.id = this.id;
        } else {
            this.booleanSignal = new BooleanSignal(null, other.booleanSignal);
        }
    }

    calculateChartValues(universeLength: [number, number]): void {
        return this.booleanSignal.calculateChartValues(universeLength, 'Formula');
    }

    getChartData(): ChartData[] {
        return this.booleanSignal.getChartData();
    }

    getAssociatedSignal(): BooleanSignal {
        return this.booleanSignal;
    }

    calculateUpdatedFixedPart(fixedPartNewLength: number): string {
        return this.booleanSignal.calculateUpdatedFixedPart(fixedPartNewLength);
    }

    calculateUpdatedPeriodicPart(periodicPartNewLength: number): string {
        return this.booleanSignal.calculateUpdatedPeriodicPart(periodicPartNewLength);
    }
}
