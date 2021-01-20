import { JSONParser, Revivable, Reviver } from 'src/engine/helpers/JSONParser';

class Entity1 implements Revivable {
    public readonly __type = 'Entity1';
    constructor(public value = Math.random()) { }
}
class Entity1Reviver implements Reviver<Entity1> {
    revive(data: any): Entity1 {
        return new Entity1(data.value);
    }
}

class Entity2 implements Revivable {
    public readonly __type = 'Entity2';
    constructor(public first: any = Math.random(), public second: any) { }
}
class Entity2Reviver implements Reviver<Entity2> {
    revive(data: any): Entity2 {
        return new Entity2(data.value, data.second);
    }
}

describe('testing "JSONParser"', () => {
    const JSON = new JSONParser();

    JSON.registerClass('Entity1', new Entity1Reviver());
    JSON.registerClass('Entity2', new Entity2Reviver());

    it('Entity1 should be correctly revived', () => {
        const entities = [
            { json: '{"__type":"Entity1","value":456}', value: 456 },
            { json: '{"__type":"Entity1","value":123}', value: 123 },
        ];

        for (const values of entities) {
            const object = JSON.parse(values.json);
            expect(object).toBeInstanceOf(Entity1);

            const entity = object as Entity1;
            expect(entity.value).toEqual(entity.value);
        }
    });

    it('Entity2 should be correctly revived', () => {
        const entities = [
            { json: '{"__type":"Entity2","value":456,"second":"Hello World!"}', first: 456, second: 'Hello World!' },
            { json: '{"__type":"Entity2","value":123,"second":[1,2,"3"]}', first: 123, second: [1, 2, '3'] },
        ];

        for (const values of entities) {
            const object = JSON.parse(values.json);
            expect(object).toBeInstanceOf(Entity2);

            const entity = object as Entity2;
            expect(entity.first).toEqual(values.first);
            expect(entity.second).toEqual(values.second);
        }
    });

    it('Complex structure should be correctly revived', () => {
        const json = `{
            "__type": "Entity2",
            "value": 123,
            "second": {
                "__type": "Entity2",
                "value": {
                    "__type": "TemporalFormula",
                    "content": "f = a & !a"
                },
                "second": {
                    "__type": "Entity1",
                    "value": 789
                }
            }
        }`;

        let object = JSON.parse(json);
        expect(object).toBeInstanceOf(Entity2);

        let entity2 = object as Entity2;
        expect(entity2.first).toEqual(123);

        object = entity2.second;
        expect(object).toBeInstanceOf(Entity2);

        entity2 = object as Entity2;
        // "TemporalFormula" is not registered,
        // therefore the JSON is not revived.
        expect(entity2.first).toEqual({
            __type: 'TemporalFormula',
            content: 'f = a & !a'
        });

        object = entity2.second;
        expect(object).toBeInstanceOf(Entity1);

        const entity1 = object as Entity1;
        expect(entity1.value).toEqual(789);
    });
});
