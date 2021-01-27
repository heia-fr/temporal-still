import { Symbols } from 'src/engine/helpers';
import { TemporalEntity } from '../entities';
import { Operator } from './Operator';

/**
 * This class represents a 'And' operator. it inherits from Operator class and
 * passes an evaluate() callback to be used it the evaluation of 'AND' operation.
 */
export class And extends Operator {

    constructor(lSignal: TemporalEntity, rSignal: TemporalEntity) {
        // call the base class constructor and passing a callback
        // along with the signal to be evaluated.
        //
        // PRE: bit1 and bit2 are expected to have 0 or 1 as a value for
        // this operator to work fine
        super((bit1: string, bit2: string) => {
            if (bit1 === Symbols.getZero() && bit2 === Symbols.getZero()) {
                return Symbols.getZero();
            } else if (bit1 === Symbols.getZero() && bit2 === Symbols.getOne()) {
                return Symbols.getZero();
            } else if (bit1 === Symbols.getOne() && bit2 === Symbols.getZero()) {
                return Symbols.getZero();
            } else if (bit1 === Symbols.getOne() && bit2 === Symbols.getOne()) {
                return Symbols.getOne();
            } else {
                throw new Error('And: bit1 and bit2 must be 0 or 1');
            }
        }, lSignal, rSignal);
    }

    // Override the performUnaryOperator() of the base
    // class so the user can't call it from an 'And' object
    performUnaryOperator(): never {
        throw new Error('Not implemented method');
    }
}
