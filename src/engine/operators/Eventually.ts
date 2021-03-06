import { Symbols } from 'src/engine/helpers';
import { TemporalEntity } from '../entities';
import { TemporalOperator } from './TemporalOperator';

/**
 * This class represents a 'Eventually' operator. it inherits from
 * TemporalOperator class and passes an evaluate() callback to be used it the
 * evaluation of 'EVENTUALLY' operation.
 */
export class Eventually extends TemporalOperator {
    constructor(lSignal: TemporalEntity) {
        // call the base class constructor and passing a callback
        // along with the signal to be evaluated.
        //
        // PRE: bitStr is expected to be a set of 0s and 1s
        // index and start are, respectively, the position
        // of the bit to evaluate and the starting point
        // of the evaluation
        super((index: number, start: number, bitStr: string, cutWrapper: { cut: boolean }) => {

            // cut the search if we already know that this bit
            // will be evaluated to 1
            if (cutWrapper.cut) return Symbols.getZero();

            // if the signal is 1 at some time t+k return 1, otherwise return 0
            for (let i = start, j = index, l = bitStr.length; i < l; ++i, ++j) {
                if (bitStr.charAt(j % l) === Symbols.getOne()) return Symbols.getOne();
            }

            cutWrapper.cut = true; // no more execution of the previous for loop
            return Symbols.getZero();
        }, lSignal, null);
    }

    // Override the performBinaryOperator() of the base
    // class so the user can't call it from an 'Eventually' object
    performBinaryOperator(): never {
        throw new Error('Eventually: Not implemented method');
    }
}
