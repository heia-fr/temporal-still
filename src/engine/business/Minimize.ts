import { BooleanSignal, TemporalEntity } from 'src/engine/entities';

export function minimize(entities: TemporalEntity[], length: [number, number]): BooleanSignal[] {
    const tmp = [];

    // Transform String Signals to Array of 0 and 1
    for (const entity of entities) {
        const body = Array.from(entity.calculateUpdatedFixedPart(length[0]));
        const period = Array.from(entity.calculateUpdatedPeriodicPart(length[1]));
        if (entity instanceof BooleanSignal) {
            tmp.push([body, period, entity.getId()]);
        } else {
            tmp.push([body, period]);
        }
    }

    // For body (j=0) and period (j=1)
    for (const j of [0, 1]) {
        loop2: for (let i = length[j] - 1; i > 0; --i) {
            // If the current value is not the same as the previous,
            // it means that there is a transition, and therefore we
            // cannot remove the current value.
            for (const entity of tmp) {
                if (entity[j][i] !== entity[j][i - 1]) {
                    continue loop2;
                }
            }

            for (const entity of tmp) {
                entity[j].splice(i, 1);
            }
        }
    }

    const minimizeSignal = BooleanSignal.prototype.minimizeSignal;

    const newEntities = [];
    for (const entity of tmp) {
        if (entity.length < 3) continue;
        // Directly call minimizeSignal without
        // creating a temporary BooleanSignal.
        newEntities.push(minimizeSignal.call({
            id: entity[2],
            body: entity[0].join(''),
            period: entity[1].join(''),
        }));
    }
    return newEntities;
}
