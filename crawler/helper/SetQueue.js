class SetQueue {
    constructor() {
        this.set = new Set();
    }
    next = () => {
        const values = this.set.values();
        const next = values.next();
        this.set.delete(next.value);
        return next.value;
    };
    [Symbol.iterator] = function* () {
        for (let value of this.set) {
            this.set.delete(value);
            yield value;
        }
    };
    clear = () => this.set.clear();
    add = (item) => this.set.add(item);
    delete = (item) => this.set.delete(item);
    get size() {
        return this.set.size;
    }
    get length() {
        return this.set.size;
    }
}

module.exports = SetQueue;
