import { Symbols } from 'src/engine/helpers';
import { TemporalEntity } from '../entities';
import { Operator } from './Operator';

/**
 * This class represents a 'Not' operator. it inherits from Operator class and
 * passes an evaluate() callback to be used it the evaluation of 'NOT' operation.
 */
export class Not extends Operator {

    constructor(lSignal: TemporalEntity) {
        // Call the base class constructor and passing a callback
        // along with the signal to be evaluated.
        //
        // PRE: bit1 is expected to be 0 or 1 for this operator
        // to work fine
        super((bit1: string) => {
            if (bit1 === Symbols.getZero()) {
                return Symbols.getOne();
            } else if (bit1 === Symbols.getOne()) {
                return Symbols.getZero();
            }
            throw new Error('Not: bit1 must be 0 or 1');
        }, lSignal, null);
    }

    // Override the performBinaryOperator() of the base
    // class so the user can't call it from a 'Not' object
    performBinaryOperator(): never {
        throw new Error('Not implemented method');
    }
}
