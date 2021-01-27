import { Symbols } from 'src/engine/helpers';
import { Operator } from './Operator';
import { BooleanSignal, TemporalEntity } from 'src/engine/entities';

/**
 * This class represents a base abstract class for all temporal operators used
 * in this application. It implements default behavior for both unary
 * (Eventually, Always) and binary (WeakUntil) temporal operators PRE:
 * operation() must be a valid callback function that handles the logic of one
 * of the temporal operators used in the application
 *
 * @param function
 *           a function provided by derived temporal operators and used to
 *           evaluate the signal(s).
 * @param TemporalEntity
 *           lSignal is the left operand
 * @param TemporalEntity
 *           rSignal is the right operand
 */
export class TemporalOperator extends Operator {
    constructor(operation: Function, lSignal: TemporalEntity, rSignal: TemporalEntity | null) {
        super(operation, lSignal, rSignal);
    }

    /**
     * Override the default behavior of the unary operators class in order to
     * implement the logic for both unary temporal operators
     */
    performUnaryOperator(): BooleanSignal {
        // update both the fixed and periodic parts to
        // evaluate the signal using the universe's length
        const thisBody = this.leftSignal.calculateUpdatedFixedPart(Operator.universeLength[0]);
        const thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(Operator.universeLength[1]);

        // concatenate the fixed and the periodic parts
        // and form a flattened signal. The formed string
        // makes it possible to check the value of each bit by checking the bits in
        // front
        const flattenedSignal = thisBody.concat(thisPeriod);

        // Parse the signal bit by bit and use the evaluate() callback
        // to calculate the result for both parts (fixed and periodic)
        // for example: Always(110/01) == 000/01
        let whole = Symbols.getEmpty();
        const cutWrapper = {
            cut: false
        };
        for (let i = 0; i < thisBody.length; ++i) {
            whole += this.evaluate(i, i, flattenedSignal, cutWrapper);
        }
        whole += Symbols.getSlash();
        for (let i = 0; i < thisPeriod.length; ++i) {
            whole += this.evaluate(i, 0, thisPeriod, cutWrapper);
        }

        // construct and return a fresh signal as a result of the operation
        whole = this.leftSignal.getId() + Symbols.getEqual() + whole;
        return new BooleanSignal(whole);
    }

    /**
     * Override the default behavior for binary temporal operators it has the same
     * logic as performUnaryOperator() but for two operands (see
     * performUnaryOperator() method)
     */
    performBinaryOperator(): BooleanSignal {
        if (!(this.rightSignal instanceof TemporalEntity)) {
            throw new TypeError('TemporalOperator: Expected "rightSignal" to be a "TemporalEntity" object');
        }
        const thisBody = this.leftSignal.calculateUpdatedFixedPart(Operator.universeLength[0]);
        const thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(Operator.universeLength[1]);

        const thatBody = this.rightSignal.calculateUpdatedFixedPart(Operator.universeLength[0]);
        const thatPeriod = this.rightSignal.calculateUpdatedPeriodicPart(Operator.universeLength[1]);

        const lFlattenedSignal = thisBody.concat(thisPeriod);
        const rFlattenedSignal = thatBody.concat(thatPeriod);

        if (lFlattenedSignal.length !== rFlattenedSignal.length) {
            throw new Error('TemporalOperator: Incompatible signals lengths');
        }

        let whole = Symbols.getEmpty();
        for (let i = 0; i < thisBody.length; ++i) {
            whole += this.evaluate(i, i, 0, lFlattenedSignal, rFlattenedSignal);
        }
        whole += Symbols.getSlash();
        for (let i = 0; i < thisPeriod.length; ++i) {
            whole += this.evaluate(i, 0, thisBody.length, thisPeriod, thatPeriod);
        }

        whole = this.leftSignal.getId() + this.rightSignal.getId() + Symbols.getEqual() + whole;
        return new BooleanSignal(whole);
    }
}
