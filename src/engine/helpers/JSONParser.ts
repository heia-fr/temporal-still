export interface Revivable {
    readonly __type: string;
}

export interface Reviver<R extends Revivable> {
    revive(data: any): R | null;
}

export type ReviverFunction<R extends Revivable> = (data: any) => R | null;

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

    public parse(value: any): any {
        return JSON.parse(value, this.reviver);
    }

    public stringify(value: any): string {
        return JSON.stringify(value);
    }

    public readonly reviver = (key: string, value: any): any => {
        if (typeof value === 'object' &&
            typeof value.__type === 'string') {
            let reviver = this.revivers.get(value.__type);
            if (typeof reviver === 'function') {
                value = reviver(value);
            }
        }
        return value;
    }
}

export const JSONHelper = new JSONParser();
