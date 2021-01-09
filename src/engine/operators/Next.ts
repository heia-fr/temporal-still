import TemporalEntity from '../entities/TemporalEntity';
import TemporalOperator from './TemporalOperator';

/**
 * This class represents a 'Next' operator. it inherits from TemporalOperator
 * class and passes an eval() callback to be used it the evaluation of 'NEXT'
 * operation.
 */
export class Next extends (TemporalOperator as any) {

    constructor(entity: TemporalEntity) {
        super((index: number, _start: number, bitStr: string) => {
            // return the signal at time t+1 (either 0 or 1)
            return bitStr[(index + 1) % bitStr.length];
        }, entity);
    }

    performBinaryOperator(): never {
        // Next is not a Binary Operator
        throw new Error('Next: Not implemented method');
    }
}
