export {};

Set.prototype.addAll = function(items) {
	for (let item of items) {
		this.add(item);
	}
};

Set.prototype.deleteAll = function(items) {
	for (let item of items) {
		this.delete(item);
	}
};

Set.prototype.containsAll = function(items) {
	for (let item of items) {
		if (!this.has(item)) {
			return false;
		}
	}
	return true;
}

Set.prototype.contentEquals = function(other) {
	if (this.size != other.size) return false;
	return this.containsAll(other);
}

Set.prototype.retainAll = function(items) {
	for (let item of items) {
		if (items.indexOf(item) < 0) {
			this.delete(item);
		}
	}
}

Set.prototype.first = function() {
	for (let item of this) {
		return item;
	}
	return null;
}
