export {};

declare global {
	interface Set<T> {
		addAll(items: Iterable<T>): void;
		deleteAll(items: Iterable<T>): void;
		containsAll(items: Iterable<T>): boolean;
		contentEquals(others: Set<T>): boolean;
		first(): T | null;
	}
}
