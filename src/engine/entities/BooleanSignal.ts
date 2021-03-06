import _random from 'lodash/random';
import { Symbols, getMinRepeatedSubstring, colors } from 'src/engine/helpers';
import { TemporalEntity } from './TemporalEntity';

/**
 * This class represents a Boolean Signal. The user must provide a string with a
 * specific format. e.g. b = 1010/01 where: 1) 'b' is the boolean signal's
 * identifier 2) '1010' is the boolean signal's fixed part 3) '01' is the
 * boolean signal's periodic part if the parameter 'other' is provided, it must
 * be a valid boolean signal so the newly created object can copy the values of
 * its attributes. PRE: if provided, expressionString must be a valid
 * BooleanSignal string representation e.g. a = 100101/11 PRE: if provided,
 * other must be a valid BooleanSignal object
 *
 * @param string
 *           expressionString a string representation of a BooleanSignal
 * @param BooleanSignal
 *           other a valid BooleanSignal object
 */
export class BooleanSignal extends TemporalEntity {

    public __type = 'BooleanSignal';

    protected body: string;
    protected period: string;
    protected periodStartIndex: number;

    constructor(expressionString: string | null, other: any = null) {
        super('', expressionString, other);

        if (!other) {
            this.content = this.content.trim();

            // holds the the start of the periodic part after extending the fixed part
            this.periodStartIndex = 0;

            const parts = this.content.split(Symbols.getEqual());
            this.id = parts[0].trim();

            const signal = parts[1].split(Symbols.getSlash());
            // the fixed part of the signal
            this.body = signal[0].trim();
            // the periodic part of the signal
            this.period = signal[1].trim();

        } else {
            if (!(other instanceof BooleanSignal) && other.__type !== 'BooleanSignal') {
                throw new TypeError('BooleanSignal: Expected other to be a "BooleanSignal" object');
            }
            this.body = other.body;
            this.period = other.period;
            this.periodStartIndex = other.periodStartIndex;
        }
    }

    minimizeSignal(): BooleanSignal {
        // 1) Simplify Period
        const period = getMinRepeatedSubstring(this.period);

        // 2) Simplify Body
        let body = this.body;
        let len = body.length;
        while (body.endsWith(period, len)) {
            len -= period.length;
        }
        if (len === 0) {
            // We need at least one character
            body = period;
        } else {
            body = body.substr(0, len);
        }

        return new BooleanSignal(this.id + '=' + body + '/' + period);
    }

    getBody(): string {
        return this.body;
    }

    getPeriod(): string {
        return this.period;
    }

    getFixedPartLength(): number {
        return this.body.length;
    }

    getPeriodicPartLength(): number {
        return this.period.length;
    }

    // Override References methods as a signal doesn't depends on any other
    getReferences(): string[] {
        return [];
    }
    setReferences(references: string[]): never {
        throw new Error('BooleanSignal cannot have references');
    }
    hasReference(entityId: string): false {
        return false;
    }
    addReference(entityId: string): never {
        throw new Error('BooleanSignal cannot have references');
    }
    removeReference(entityId: string): never {
        throw new Error('BooleanSignal cannot have references');
    }

    /**
     * this method calculates the new fixed part using the already
     * specified extension length. It must be called after
     * setFixedPartNewLength() method.
     *
     * @return the new fixed part with the extension added
     */
    calculateUpdatedFixedPart(fixedPartNewLength: number): string {
        let i;
        let newBody = this.body;
        // extending the fixed part so it matches the universe's length
        for (i = 0; i < fixedPartNewLength - this.body.length; ++i) {
            newBody += this.period.charAt(i % this.period.length);
        }
        // save the periodic part offset
        this.periodStartIndex = i % this.period.length;
        return newBody;
    }

    /**
     * this method calculates the new periodic part using the already
     * specified extension length. It must be called after
     * setPeriodicPartNewLength() method.
     *
     * @return the new periodic part with the extension added
     */
    calculateUpdatedPeriodicPart(periodicPartNewLength: number): string {
        // if the specified periodicPartNewLength is negative,
        // return what remains from the periodic part by taking into
        // account the offset periodStartIndex
        if (periodicPartNewLength <= 0) {
            return this.period.substring(this.periodStartIndex, this.period.length);
        }

        let newPeriod = Symbols.getEmpty();
        // calculate the new periodic part by using a round robin technique
        for (let i = 0, j = this.periodStartIndex; i < periodicPartNewLength; ++i, ++j) {
            newPeriod += this.period.charAt(j % this.period.length);
        }
        return newPeriod;
    }

    /**
     * this method calculates data to be used by the chart library in order
     * to display this boolean signal. The data is calculates such that
     * each bit of the signal is mapped to a segment of line, say two
     * points ([t0, val0], [t1, val1]). 1) t0, t1, t2, etc. represent the
     * ticks of the chart 2) val0, val1, val2, etc. represent the values of
     * the signal in each tick (0 or 1) For example, the bit 1 is the
     * signal 'a = 10/0' is represented as the couple of points ([0, 1],
     * [1, 1]) and the bit 0 that follows is represented as ([1, 0], [2,
     * 0])
     */
    calculateChartValues(universeLength: [number, number], legendLabel: string | null = null): void {
        const newBody = this.calculateUpdatedFixedPart(universeLength[0]);
        const newPeriod = this.calculateUpdatedPeriodicPart(universeLength[1]);

        const values: number[][] = [];
        let x = 0;
        let nextX = 1;
        let oldZ = Number(newBody.charAt(0));
        let z = oldZ;

        values.push([x, oldZ]);
        values.push([nextX, oldZ]);

        // calculate points for the fixed part
        for (let i = 0, l = newBody.length - 1; i < l; i++) {
            x = i + 1;
            nextX = i + 2;
            z = Number(newBody.charAt(i + 1));
            // if (z != oldZ) {
            values.push([x, z]);
            // }
            values.push([nextX, z]);
            oldZ = z;
        }
        // put a mark to visually show the beginning of the periodic part
        values.push([newBody.length - 0.1, 0.5]);
        values.push([newBody.length + 0.1, 0.5]);
        values.push([newBody.length, z]);
        // calculate points for one period
        for (let i = 0, l = newPeriod.length; i < l; i++) {
            x = newBody.length + i;
            nextX = newBody.length + i + 1;
            z = Number(newPeriod.charAt(i));
            // if (z != oldZ) {
            values.push([x, z]);
            // }
            values.push([nextX, z]);
            oldZ = z;
        }

        const label = legendLabel || 'Signal';
        this.signalChartData = [
            {
                key: label + ' ' + this.getId(),
                values,
                color: colors[_random(0, colors.length - 1)]
            }
        ];
    }
}
