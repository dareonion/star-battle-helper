class JsonMap {
  constructor() {
    this.m = new Map();
    this[Symbol.iterator] = this.entries;
  }

  set(key, value) {
    this.m.set(JSON.stringify(key), value);
    return this;
  }

  has(key) {
    return this.m.has(JSON.stringify(key));
  }

  get(key) {
    return this.m.get(JSON.stringify(key));
  }

  entries() {
    const internal_iterator = this.m.entries();
    const iterator = {
      next: () => {
        const n = internal_iterator.next();
        if (n.done) return {value: n.value, done: true};

        const entry = n.value;
        const [key, value] = entry;
        return {value: [JSON.parse(key), value], done: false};
      }
    }
    return iterator;
  }
}

export {JsonMap};
