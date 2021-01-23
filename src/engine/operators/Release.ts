import { TemporalEntity } from '../entities';
import { TemporalOperator } from './TemporalOperator';
import { WeakUntil } from './WeakUntil';
import { And } from './And';
import { BooleanSignal } from '../entities';

/**
 * This class represents a 'Release' operator. it inherits from TemporalOperator
 * class. Internally it uses the following equivalence: a R b = b W (a & b)
 *
 * @see WeakUntil
 * @see And
 */
export class Release extends TemporalOperator {

    constructor(left: TemporalEntity, right: TemporalEntity) {
        super(() => {
            throw new Error('Until: Not implemented method');
        }, left, right);
    }

    performUnaryOperator(): never {
        // Until is not a Unary Operator
        throw new Error('Until: Not implemented method');
    }

    performBinaryOperator(): BooleanSignal {
        // Use existing operators to compute current value of the signal:
        //  a R b = b W (b & a)
        const rightSignal = this.rightSignal!;
        return new WeakUntil(
            rightSignal,
            new And(
                rightSignal,
                this.leftSignal
            ).performBinaryOperator()
        ).performBinaryOperator();
    }
}
