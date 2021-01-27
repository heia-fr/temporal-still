type JSONData = any;

export interface Revivable {
    readonly __type: string;
}

export interface Reviver<R extends Revivable> {
    revive(data: JSONData): R | null;
}

export type ReviverFunction<R extends Revivable> = (data: JSONData) => R | null;

export class JSONParser {

    public readonly revivers = new Map<string, ReviverFunction<Revivable>>();

    public registerClass<R extends Revivable>(type: string, reviver: Reviver<R>): void {
        if (this.revivers.has(type)) {
            throw new Error('Reviver for \"' + type + '\" already registered');
        }
        this.revivers.set(type, reviver.revive.bind(reviver));
    }

    public register<R extends Revivable>(type: string, reviver: ReviverFunction<R>): void {
        if (this.revivers.has(type)) {
            throw new Error('Reviver for \"' + type + '\" already registered');
        }
        this.revivers.set(type, reviver);
    }

    public unregister(type: string): boolean {
        return this.revivers.delete(type);
    }

    public parse(value: string): JSONData {
        return JSON.parse(value, this.reviver);
    }

    public stringify(value: JSONData): string {
        return JSON.stringify(value);
    }

    public readonly reviver = (key: string, value: JSONData): JSONData => {
        if (typeof value === 'object' &&
            typeof value.__type === 'string') {
            const reviver = this.revivers.get(value.__type);
            if (typeof reviver === 'function') {
                value = reviver(value);
            }
        }
        return value;
    }
}

export const JSONHelper = new JSONParser();
