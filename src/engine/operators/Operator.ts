import { Symbols } from 'src/engine/helpers';
import { BooleanSignal, TemporalEntity } from 'src/engine/entities';

/**
 * This class represents a base abstract class for all logical operators used in
 * this application. It implements default behavior for both unary (Not,
 * Eventually, Always) and binary (And, Or, WeakUntil) operators PRE:
 * operation() must be a valid callback function that handles the logic of one
 * of the logical operators used in the application
 *
 * @param function
 *           a function provided by derived Operators and used to evaluate the
 *           signal(s).
 * @param TemporalEntity
 *           lSignal is the left operand
 * @param TemporalEntity
 *           rSignal is the right operand
 */
export class Operator {
    protected static universeLength: [number, number] = [0, 1];

    // This is the length of the universe to be used
    // by all the concrete operators
    static setUniverseLength(universeLength: [number, number]): void {
        this.universeLength = universeLength;
    }

    constructor(
        protected readonly evaluate: Function,
        protected readonly leftSignal: TemporalEntity,
        protected readonly rightSignal: TemporalEntity | null,
    ) {
    }

    // implement the default behavior for unary operators
    performUnaryOperator(): BooleanSignal {
        // update both the fixed and periodic parts of the signal to
        // evaluate using the universe's length
        const thisBody = this.leftSignal.calculateUpdatedFixedPart(Operator.universeLength[0]);
        const thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(Operator.universeLength[1]);

        // Parse the signal bit by bit and use the.evaluate() callback
        // to calculate the result for both parts (fixed and periodic)
        // for example: Not(101/10) == 010/01
        let whole = Symbols.getEmpty();
        for (let i = 0; i < thisBody.length; ++i) {
            whole += this.evaluate(thisBody.charAt(i));
        }
        whole += Symbols.getSlash();
        for (let i = 0; i < thisPeriod.length; ++i) {
            whole += this.evaluate(thisPeriod.charAt(i));
        }

        // construct and return a fresh signal as a result of the operation
        whole = this.leftSignal.getId() + Symbols.getEqual() + whole;
        return new BooleanSignal(whole, null);
    }

    /**
     * implement the default behavior for binary operators it has the same
     * logic as performUnaryOperator() but for two operands (see
     * performUnaryOperator() method)
     */
    performBinaryOperator(): BooleanSignal {
        if (!(this.rightSignal instanceof TemporalEntity)) {
            throw new TypeError('Operator: Expected "rightSignal" to be a "TemporalEntity" object');
        }

        const thisBody = this.leftSignal.calculateUpdatedFixedPart(Operator.universeLength[0]);
        const thisPeriod = this.leftSignal.calculateUpdatedPeriodicPart(Operator.universeLength[1]);

        const thatBody = this.rightSignal.calculateUpdatedFixedPart(Operator.universeLength[0]);
        const thatPeriod = this.rightSignal.calculateUpdatedPeriodicPart(Operator.universeLength[1]);

        if (thisBody.length !== thatBody.length) {
            throw new Error('Operator: Incompatible fixed part lengths');
        }
        if (thisPeriod.length !== thatPeriod.length) {
            throw new Error('Operator: Incompatible periodic part lengths');
        }

        let whole = Symbols.getEmpty();
        for (let i = 0; i < thisBody.length; ++i) {
            whole += this.evaluate(thisBody.charAt(i), thatBody.charAt(i));
        }
        whole += Symbols.getSlash();
        for (let i = 0; i < thisPeriod.length; ++i) {
            whole += this.evaluate(thisPeriod.charAt(i), thatPeriod.charAt(i));
        }

        whole = this.leftSignal.getId() + this.rightSignal.getId() + Symbols.getEqual() + whole;
        return new BooleanSignal(whole);
    }
}
