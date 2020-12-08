export {};

Map.prototype.merge = function(key, value, map) {
	let existing = this.get(key);
	if (existing != null) {
		value = map(existing, value);
	}
	this.set(key, value);
}
