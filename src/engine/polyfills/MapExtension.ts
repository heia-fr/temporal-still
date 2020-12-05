export {};

Map.prototype.merge = function<K, V>(key: K, value: V, map: (first: V, second: V) => V) {
	let existing = this.get(key);
	if (existing != null) {
		value = map(existing, value);
	}
	this.set(key, value);
}
