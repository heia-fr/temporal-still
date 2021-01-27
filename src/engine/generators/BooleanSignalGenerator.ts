import _random from 'lodash/random';
import { Symbols } from 'src/engine/helpers';
import { Universe } from 'src/engine/business';

export const MAX_BODY = 10;
export const MAX_PERIOD = 5;

function generateVarName(universe: Universe): string {
    let id: string;
    do {
        const i = _random(0, Symbols.getCharSet().length - 1);
        id = Symbols.getCharSet().charAt(i);
    } while (universe.containsEntity(id));
    return id;
}

function generateDigits(maxNbDigits: number): string {
    let digits = Symbols.getEmpty();
    const nbDigits = _random(1, maxNbDigits);
    for (let i = 0; i < nbDigits; i++) {
        digits += (_random() === 1 ? Symbols.getOne() : Symbols.getZero());
    }

    return digits;
}

/**
 * Defining BooleanSignalGenerator using the concept of the recursive descent
 * algorithm. The generator makes use of the formulas manager to produce a signals
 * with IDs different from existing formulas
 *
 * The maximum lengths of the signals are:
 *
 * 1) maximum length of the signal's fixed part: 10
 * 2) maximum length of the signal's periodic part: 5
 * 3) maximum number of signals to generate: 5
 */
export function generateBooleanSignals(universe: Universe): string {
    const varName = generateVarName(universe);
    const body = generateDigits(MAX_BODY);
    const period = generateDigits(MAX_PERIOD);
    return varName + ' ' + Symbols.getEqual() + ' ' + body + Symbols.getSlash() + period;
}
