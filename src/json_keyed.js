class JsonMap {
  #m

  constructor() {
    this.#m = new Map();
    this[Symbol.iterator] = this.entries;
  }

  set(key, value) {
    this.#m.set(JSON.stringify(key), value);
    return this;
  }

  get size() {return this.#m.size;}

  has(key) {
    return this.#m.has(JSON.stringify(key));
  }

  get(key) {
    return this.#m.get(JSON.stringify(key));
  }

  entries() {
    const internal_iterator = this.#m.entries();
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
  #s

  constructor() {
    this.#s = new Set();
    this[Symbol.iterator] = this.entries;
  }

  get size() {return this.#s.size;}
  clear() {this.#s.clear();}
  delete(value) {return this.#s.delete(JSON.stringify(value));}
  has(value) {return this.#s.has(JSON.stringify(value));}

  add(value) {
    this.#s.add(JSON.stringify(value));
    return this;
  }

  entries() {
    const internal_iterator = this.#s.entries();
    const iterator = {
      next: () => {
        const n = internal_iterator.next();
        if (n.done) return {value: n.value, done: true};
        const value = n.value[0];
        return {value: JSON.parse(value), done: false};
      }
    }
    return iterator;
  }

  update(...others) {
    for (const other of others) {
      for (const v of other) {
        this.add(v);
      }
    }
  }

  pop() {
    let result = null;
    for (const v of this) {
      result = v;
      break;
    }
    this.delete(result);
    return result;
  }

  static of(arr) {
    const s = new JsonSet();
    for (const v of arr) {
      s.add(v);
    }
    return s;
  }
}

export {JsonMap, JsonSet};
