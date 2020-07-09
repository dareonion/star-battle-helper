class JsonMap {
  constructor() {
    this.m = new Map();
    this.size = this.m.size;
    this[Symbol.iterator] = this.entries;
  }

  set(key, value) {
    this.m.set(JSON.stringify(key), value);
    this.size = this.m.size;
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

class JsonSet {
  constructor() {
    this.s = new Set();
    this.size = this.s.size;
    this[Symbol.iterator] = this.entries;
  }

  clear() {
    this.s.clear();
    this.size = this.s.size;
  }

  delete(value) {
    return this.s.delete(JSON.stringify(value));
    this.size = this.s.size;
  }

  has(value) {return this.s.has(JSON.stringify(value));}

  add(value) {
    this.s.add(JSON.stringify(value));
    this.size = this.s.size;
    return this;
  }

  entries() {
    const internal_iterator = this.s.entries();
    const iterator = {
      next: () => {
        const n = internal_iterator.next();
        if (n.done) return {value: n.value, done: true};

        const entry = n.value;
        return {value: JSON.parse(entry), done: false};
      }
    }
    return iterator;
  }
}

export {JsonMap, JsonSet};
