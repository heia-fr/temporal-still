// https://en.wikipedia.org/wiki/Linear_temporal_logic#Negation_normal_form
// These are the only allowed operators in the Negative Normal Form (NNF)
type NNFOperator = Variable | Constant | Not | And | Or | Next | Until | Release;

export interface ICloneable<T> {
	clone(): T;
}

export interface IEquatable<T> {
	equals(obj: T): boolean;
}

export abstract class Operator implements IEquatable<Operator> {
	abstract equals(op: Operator): boolean;
	abstract toString(): string;

	abstract toNNF(): NNFOperator;

	isValidNNF(): boolean {
		return false;
	}

    processUntils(current: number): number {
        return current;
    }

	negate(): Operator {
		return new Not(this);
	}

	describe(): string {
		return this.constructor.name;
	}
}

export abstract class UnaryOperator extends Operator {
	constructor(public readonly content: Operator) {
		super();
	}

    processUntils(current: number): number {
        return this.content.processUntils(current);
    }

	describe(): string {
		return super.describe() + '(' + this.content.describe() + ')';
	}

	equals(op: Operator): boolean {
		if (!(op instanceof this.constructor)) return false;
		return this.content.equals((op as UnaryOperator).content);
	}
}

export abstract class BinaryOperator extends Operator {
	constructor(public readonly left: Operator, public readonly right: Operator) {
		super();
	}

    processUntils(current: number): number {
        current = this.left.processUntils(current);
        current = this.right.processUntils(current);
        return current;
    }

	describe(): string {
		return super.describe() + '(' + this.left.describe() + ', ' + this.right.describe() + ')';
	}

	equals(op: Operator): boolean {
		if (!(op instanceof this.constructor)) return false;
		const bop = op as BinaryOperator;
		return this.left.equals(bop.left) && this.right.equals(bop.right);
	}
}

export class Formula extends Operator {
	constructor(public readonly name: string, public readonly content: Operator) {
		super();
	}

    processUntils(current: number): number {
        return this.content.processUntils(current);
    }

	toNNF(): NNFOperator {
		return new Formula(this.name, this.content.toNNF());
	}

	isValidNNF(): boolean {
		return this.content.isValidNNF();
	}

	toString(): string {
		return this.name + ' = ' + this.content.toString();
	}

	describe(): string {
		return super.describe() + '(' + this.name + ', ' + this.content.describe() + ')';
	}

	equals(op: Operator): boolean {
		if (!(op instanceof this.constructor)) return false;
		const formula = op as Formula;
		return this.name === formula.name && this.content.equals(formula.content);
	}
}

export class Variable extends Operator {
	constructor(public readonly name: string) {
		super();
	}

	toNNF(): NNFOperator {
		return this;
	}

	isValidNNF(): boolean {
		return true;
	}

	toString(): string {
		return this.name;
	}

	describe(): string {
		return super.describe() + '(' + this.name + ')';
	}

	equals(op: Operator): boolean {
		if (!(op instanceof this.constructor)) return false;
		return this.name === (op as Variable).name;
	}
}

export class Constant extends Operator {
	public static readonly TRUE = new Constant(true);
	public static readonly FALSE = new Constant(false);

	private constructor(private readonly value: boolean) {
		super();
	}

	negate(): Constant {
		return this.value ? Constant.FALSE : Constant.TRUE;
	}

	toNNF(): NNFOperator {
		return this;
	}

	isValidNNF(): boolean {
		return true;
	}

	toString(): string {
		return this.value ? '1' : '0';
	}

	describe(): string {
		return super.describe() + '(' + this.value + ')';
	}

	equals(op: Operator): boolean {
		if (!(op instanceof this.constructor)) return false;
		return this.value === (op as Constant).value;
	}
}

export class Always extends UnaryOperator {
	toNNF(): NNFOperator {
		// []TRUE = TRUE and []FALSE = FALSE
		if (this.content instanceof Constant) return this.content;
		// [][]a = []a
		if (this.content instanceof Always) return this.content.toNNF();

		return new Release(Constant.FALSE, this.content).toNNF();
	}

	toString(): string {
		return '[](' + this.content.toString() + ')';
	}
}

export class Eventually extends UnaryOperator {
	toNNF(): NNFOperator {
		return new Until(Constant.TRUE, this.content).toNNF();
	}

	toString(): string {
		return '<>(' + this.content.toString() + ')';
	}
}

export class Next extends UnaryOperator {
	toNNF(): NNFOperator {
		// X(TRUE) = TRUE and X(FALSE) = FALSE
		if (this.content instanceof Constant) return this.content;

		return new Next(this.content.toNNF());
	}

	isValidNNF(): boolean {
		return this.content.isValidNNF();
	}

	toString(): string {
		return '<>(' + this.content.toString() + ')';
	}
}

export class Not extends UnaryOperator {
	toNNF(): NNFOperator {
		if (this.content instanceof Not) return this.content.content.toNNF();
		if (this.content instanceof Constant) return this.content.negate();
		if (this.content instanceof Variable) return this;

		if (this.content instanceof And) return new Or(new Not(this.content.left), new Not(this.content.right)).toNNF();
		if (this.content instanceof Or) return new And(new Not(this.content.left), new Not(this.content.right)).toNNF();

		if (this.content instanceof Next) return new Next(new Not(this.content.content)).toNNF();
		if (this.content instanceof Eventually) return new Not(new Until(Constant.TRUE, this.content.content)).toNNF();
		if (this.content instanceof Always) return new Not(new Release(Constant.FALSE, this.content.content)).toNNF();

		if (this.content instanceof Until) return new Release(new Not(this.content.left).toNNF(), new Not(this.content.right).toNNF());
		if (this.content instanceof Release) return new Until(new Not(this.content.left).toNNF(), new Not(this.content.right).toNNF());

		// These Operators transform themselves
		if (this.content instanceof WeakUntil) return new Not(this.content.toNNF()).toNNF();
		if (this.content instanceof Implies) return new Not(this.content.toNNF()).toNNF();

		// In NNF, Not can only be in front of Variables
		console.error('Unknown Operator \'' + this.content.constructor.name + '\' encountered in Not.toNNF()', this);
		throw new Error('Unknown Operator \'' + this.content.constructor.name + '\' encountered in Not.toNNF()');
	}

	isValidNNF(): boolean {
		return this.content instanceof Variable;
	}

	negate(): Operator {
		return this.content;
	}

	toString(): string {
		return '!(' + this.content.toString() + ')';
	}
}

export class Implies extends BinaryOperator {
	toNNF(): NNFOperator {
		return new Or(new Not(this.left), this.right).toNNF();
	}

	toString(): string {
		return '(' + this.left.toString() + ') -> (' + this.right.toString() + ')';
	}
}

export class Until extends BinaryOperator {
    public UntilsIndex = -1;

    processUntils(current: number): number {
        this.UntilsIndex = current;
        return super.processUntils(++current);
    }

	toNNF(): NNFOperator {
		// a U FALSE => FALSE
		if (this.right === Constant.FALSE) return Constant.FALSE;

		return new Until(this.left.toNNF(), this.right.toNNF());
	}

	isValidNNF(): boolean {
		return this.left.isValidNNF() && this.right.isValidNNF();
	}

	toString(): string {
		return '(' + this.left.toString() + ') U (' + this.right.toString() + ')';
	}
}

export class Release extends BinaryOperator {
	toNNF(): NNFOperator {
		return new Release(this.left.toNNF(), this.right.toNNF());
	}

	isValidNNF(): boolean {
		return this.left.isValidNNF() && this.right.isValidNNF();
	}

	toString(): string {
		return '(' + this.left.toString() + ') R (' + this.right.toString() + ')';
	}
}

export class WeakUntil extends BinaryOperator {
	toNNF(): NNFOperator {
		return new Release(this.right, new Or(this.right, this.left)).toNNF();
	}

	toString(): string {
		return '(' + this.left.toString() + ') W (' + this.right.toString() + ')';
	}
}

export class Or extends BinaryOperator {
	toNNF(): NNFOperator {
		// Check: TRUE | a = TRUE
		if (Constant.TRUE.equals(this.left)) return Constant.TRUE;
		if (Constant.TRUE.equals(this.right)) return Constant.TRUE;

		// Check: FALSE | a = a
		if (Constant.FALSE.equals(this.left)) return this.right.toNNF();
		if (Constant.FALSE.equals(this.right)) return this.left.toNNF();

		return new Or(this.left.toNNF(), this.right.toNNF());
	}

	isValidNNF(): boolean {
		return this.left.isValidNNF() && this.right.isValidNNF();
	}

	toString(): string {
		return '(' + this.left.toString() + ') | (' + this.right.toString() + ')';
	}
}

export class And extends BinaryOperator {
	toNNF(): NNFOperator {
		// Check: TRUE & a = a
		if (Constant.TRUE.equals(this.left)) return this.right.toNNF();
		if (Constant.TRUE.equals(this.right)) return this.left.toNNF();

		// Check: FALSE & a = FALSE
		if (Constant.FALSE.equals(this.left)) return Constant.FALSE;
		if (Constant.FALSE.equals(this.right)) return Constant.FALSE;

		return new And(this.left.toNNF(), this.right.toNNF());
	}

	isValidNNF(): boolean {
		return this.left.isValidNNF() && this.right.isValidNNF();
	}

	toString(): string {
		return '(' + this.left.toString() + ') & (' + this.right.toString() + ')';
	}
}
