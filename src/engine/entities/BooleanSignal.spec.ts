import { BooleanSignal } from 'src/engine/entities';

describe('testing BooleanSignal constructor', () => {

    it('BooleanSignal constructor with uncorrect parameters should throw an exception', () => {
        expect(() => new BooleanSignal(null)).toThrow();
        expect(() => new BooleanSignal(2015 as any)).toThrow();
        expect(() => new BooleanSignal(new Date() as any)).toThrow();
        expect(() => new BooleanSignal(true as any)).toThrow();
        expect(() => new BooleanSignal([] as any)).toThrow();
        expect(() => new BooleanSignal({} as any)).toThrow();

        expect(() => new BooleanSignal('a = 1001/11', 2016)).toThrow();
        expect(() => new BooleanSignal(null, [])).toThrow();
        expect(() => new BooleanSignal('', {})).toThrow();
    });

    it('BooleanSignal constructor with correct parameters should not throw an exception', () => {
        expect(() => new BooleanSignal('a = 100101/101')).not.toThrow();
        expect(() => new BooleanSignal('b = 11/0', null)).not.toThrow();

        expect(() => new BooleanSignal(null, new BooleanSignal('c=1001/01'))).not.toThrow();
    });

    it('BooleanSignal state should be as expected', () => {
        const bs = new BooleanSignal('signal = 10110101/01');

        expect(bs.getId()).toMatch('signal');
        expect(bs.getContent()).toMatch('signal = 10110101/01');
        expect(bs.getBody()).toMatch('10110101');
        expect(bs.getPeriod()).toMatch('01');
        expect(bs.getFixedPartLength()).toEqual(8);
        expect(bs.getPeriodicPartLength()).toEqual(2);
    });

    it('New BooleanSignal should be referenced correctly', () => {
        const bs = new BooleanSignal('signal = 10110101/01');

        expect(bs.getReferencedBy()).toEqual([]);
        expect(bs.isReferenced()).toBe(false);

        bs.addReferencedBy('f');

        expect(bs.getReferencedBy().length).toEqual(1);
        expect(bs.getReferencedBy()).toEqual(['f']);

        bs.addReferencedBy('f');

        expect(bs.getReferencedBy().length).toEqual(1);
        expect(bs.getReferencedBy()).toEqual(['f']);
        expect(bs.isReferenced()).toBe(true);

        bs.addReferencedBy('y');
        bs.addReferencedBy('q');

        expect(bs.getReferencedBy().length).toEqual(3);
        expect(bs.getReferencedBy()).toEqual(['f', 'y', 'q']);
        expect(bs.isReferenced()).toBe(true);

        bs.setReferencedBy(['z', 't']);

        expect(bs.getReferencedBy().length).toEqual(2);
        expect(bs.getReferencedBy()).toEqual(['z', 't']);
        expect(bs.isReferenced()).toBe(true);

        bs.removeReferencedBy('z');

        expect(bs.getReferencedBy().length).toEqual(1);
        expect(bs.getReferencedBy()).toEqual(['t']);
        expect(bs.isReferenced()).toBe(true);

        bs.removeReferencedBy('z');

        expect(bs.getReferencedBy().length).toEqual(1);
        expect(bs.getReferencedBy()).toEqual(['t']);
        expect(bs.isReferenced()).toBe(true);

        bs.removeReferencedBy('t');

        expect(bs.getReferencedBy().length).toEqual(0);
        expect(bs.getReferencedBy()).toEqual([]);
        expect(bs.isReferenced()).toBe(false);
    });

    it('BooleanSignal body and period should be as updated correctly', () => {
        const bs = new BooleanSignal('signal = 10110101/01');

        expect(bs.getBody()).toMatch('10110101');
        expect(bs.getPeriod()).toMatch('01');
        expect(bs.getFixedPartLength()).toEqual(8);
        expect(bs.getPeriodicPartLength()).toEqual(2);

        expect(bs.calculateUpdatedFixedPart(-1)).toMatch('10110101');
        expect(bs.calculateUpdatedPeriodicPart(-1)).toMatch('01');

        expect(bs.calculateUpdatedFixedPart(0)).toMatch('10110101');
        expect(bs.calculateUpdatedPeriodicPart(0)).toMatch('01');

        expect(bs.calculateUpdatedFixedPart(13)).toMatch('1011010101010');
        expect(bs.calculateUpdatedPeriodicPart(10)).toMatch('1010101010');

        expect(bs.getBody()).toMatch('10110101');
        expect(bs.getPeriod()).toMatch('01');
        expect(bs.getFixedPartLength()).toEqual(8);
        expect(bs.getPeriodicPartLength()).toEqual(2);
    });

    it('BooleanSignal chart data should be calculated correctly', () => {
        const bs = new BooleanSignal('signal = 101101/10');

        bs.calculateChartValues([6, 2]);
        const data = bs.getChartData();
        const expectedValues = [[0, 1], [1, 1], [1, 0], [2, 0], [2, 1], [3, 1], [3, 1], [4, 1], [4, 0],
        [5, 0], [5, 1], [6, 1], [5.9, 0.5], [6.1, 0.5], [6, 1], [6, 1], [7, 1], [7, 0], [8, 0]];

        expect(data instanceof Array).toBe(true);
        expect(data.length).toEqual(1);
        expect(data[0] instanceof Object).toBe(true);
        expect(data[0].key).toEqual('Signal ' + bs.getId());
        expect(data[0].values instanceof Array).toBe(true);
        expect(data[0].values.length).toEqual(expectedValues.length);
        expect(data[0].values).toEqual(expectedValues);
    });

    it('BooleanSignal minimizeSignal should be correct', () => {
        const signals = [
            { content: 'A = 00101/01', body: '0', period: '01', },
            { content: 'B = 010101/01', body: '01', period: '01', },
            { content: 'C = 01010/01', body: '01010', period: '01', },
            { content: 'D = 01010/10101010', body: '0', period: '10', },
            { content: 'E = 0000/10101010', body: '0000', period: '10', },
            { content: 'F = 10011/11111111', body: '100', period: '1', },
        ];

        for (const testData of signals) {
            const signal = new BooleanSignal(testData.content);
            const minimized = signal.minimizeSignal();

            expect(signal).not.toBeNull();
            expect(minimized).not.toBeNull();
            expect(minimized.getId()).toEqual(signal.getId());
            expect(minimized.getBody()).toEqual(testData.body);
            expect(minimized.getPeriod()).toEqual(testData.period);
        }
    });
});
