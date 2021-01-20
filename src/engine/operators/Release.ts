import { TemporalEntity } from '../entities/TemporalEntity';
import TemporalOperator from './TemporalOperator';
import WeakUntil from './WeakUntil';
import And from './And';

/**
 * This class represents a 'Release' operator. it inherits from TemporalOperator
 * class. Internally it uses the following equivalence: a R b = b W (a & b)
 *
 * @see WeakUntil
 * @see And
 */
export class Release extends (TemporalOperator as any) {

    constructor(left: TemporalEntity, right: TemporalEntity) {
        super(() => {
            throw new Error('Until: Not implemented method');
        }, left, right);
    }

    performUnaryOperator(): never {
        // Until is not a Unary Operator
        throw new Error('Until: Not implemented method');
    }

    performBinaryOperator(): TemporalEntity {
        // Use existing operators to compute current value of the signal:
        //  a R b = b W (b & a)

        let and: any = new And(this.rightSignal, this.leftSignal);
        and = and.performBinaryOperator();

        let awb: any = new WeakUntil(this.rightSignal, and);
        return awb.performBinaryOperator();
    }
}
