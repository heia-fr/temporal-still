export {};

declare global {
	interface Map<K, V> {
		merge(key: K, value: V, map: (first: V, second: V) => V): V;
	}
}
