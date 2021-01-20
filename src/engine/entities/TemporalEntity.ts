/**
 * This class defines a Temporal entity
 *
 * @param id
 *           the identifier of the temporal entity
 * @param content
 *           the string representation of the entity
 * @param other
 *           an other TemporalEntity to clone
 */
export class TemporalEntity {

    public __type = 'TemporalEntity';

    public id: string;
    protected content: string;
    protected editable: boolean;
    protected references: string[];
    protected referencedBy: string[];
    protected signalChartData: any;

    constructor(id: string | null, content: string | null, other: TemporalEntity | null = null) {
        if (!other) {
            if (typeof id !== 'string') {
                throw new TypeError('TemporalEntity: Expected "id" to be "String" object');
            }
            if (typeof content !== 'string') {
                throw new TypeError('TemporalEntity: Expected "content" to be "String" object');
            }

            this.id = id;
            this.content = content;
            this.editable = false;
            this.references = [];
            this.referencedBy = [];
            this.signalChartData = [];

        } else {
            this.id = other.id;
            this.content = other.content;
            this.editable = other.editable;
            this.references = other.references;
            this.referencedBy = other.referencedBy;
            this.signalChartData = other.signalChartData;
        }
    }

    getId(): string {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }

    isEditorEnabled(): boolean {
        return this.editable;
    }

    setEditorEnabled(enabled: boolean): void {
        this.editable = enabled;
    }

    calculateChartValues(universeLength: [number, number], legendLabel: string | null = null): void {
        throw new Error('Not implemented method');
    }

    getChartData(): any {
        return this.signalChartData;
    }

    calculateUpdatedFixedPart(fixedPartNewLength: number): string {
        throw new Error('Not implemented method');
    }

    calculateUpdatedPeriodicPart(periodicPartNewLength: number): string {
        throw new Error('Not implemented method');
    }

    // Manage references from me
    getReferences(): string[] {
        return this.references;
    }

    setReferences(references: string[]): void {
        this.references = references;
    }

    hasReference(entityId: string | null = null): boolean {
        if (entityId == null) {
            return this.references.length > 0;
        }
        return this.references.indexOf(entityId) >= 0;
    }

    addReference(entityId: string): void {
        if (this.references.indexOf(entityId) === -1) {
            this.references.push(entityId);
        }
    }

    removeReference(entityId: string): void {
        const index = this.references.indexOf(entityId);
        if (index !== -1) this.references.splice(index, 1);
    }

    // Manage references to me
    getReferencedBy(): string[] {
        return this.referencedBy;
    }

    setReferencedBy(referencedBy: string[]): void {
        this.referencedBy = referencedBy;
    }

    isReferenced(): boolean {
        return this.referencedBy.length > 0;
    }

    isReferencedBy(entityId: string): boolean {
        return this.referencedBy.indexOf(entityId) >= 0;
    }

    addReferencedBy(entityId: string): void {
        if (this.referencedBy.indexOf(entityId) === -1) {
            this.referencedBy.push(entityId);
        }
    }

    removeReferencedBy(entityId: string): void {
        const index = this.referencedBy.indexOf(entityId);
        if (index !== -1) this.referencedBy.splice(index, 1);
    }
}
