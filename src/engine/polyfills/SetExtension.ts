export {};

Set.prototype.addAll = function<T>(items: Iterable<T>): void {
	for (let item of items) {
		this.add(item);
	}
};

Set.prototype.deleteAll = function<T>(items: Iterable<T>): void {
	for (let item of items) {
		this.delete(item);
	}
};

Set.prototype.containsAll = function<T>(items: Iterable<T>): boolean {
	for (let item of items) {
		if (!this.has(item)) {
			return false;
		}
	}
	return true;
}

Set.prototype.contentEquals = function<T>(other: Set<T>): boolean {
	if (this.size != other.size) return false;
	return this.containsAll(other);
}

Set.prototype.retainAll = function<T>(items: T[]): void {
	for (let item of items) {
		if (items.indexOf(item) < 0) {
			this.delete(item);
		}
	}
}

Set.prototype.first = function<T>(): T | null {
	for (let item of this) {
		return item;
	}
	return null;
}
