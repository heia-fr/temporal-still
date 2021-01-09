import TemporalEntity from '../entities/TemporalEntity';
import TemporalOperator from './TemporalOperator';
import Eventually from './Eventually';
import WeakUntil from './WeakUntil';
import And from './And';

/**
 * This class represents a 'Until' operator. it inherits from TemporalOperator
 * class. Internally it uses the following equivalence: a U b = <>b & (a W b)
 *
 * @see Eventually
 * @see WeakUntil
 * @see And
 */
export class Until extends (TemporalOperator as any) {

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
        //  a U b = <>b & (a W b)

        let eb: any = new Eventually(this.rightSignal);
        eb = eb.performUnaryOperator();

        let awb: any = new WeakUntil(this.leftSignal, this.rightSignal);
        awb = awb.performBinaryOperator();

        let and: any = new And(eb, awb);
        return and.performBinaryOperator();
    }
}
