export interface Hashable {
  hashCode(): string;
}

export class HashSet<T extends Hashable> {
  _data: Array<T>;
  _hashes: { [key: string]: boolean };
  constructor() {
    this._data = [];
    this._hashes = {};
  }

  add(item: T): void {
    let code = item.hashCode();
    if (this._hashes[code] !== true) {
      this._hashes[code] = true;
      this._data.push(item);
    }
  }

  has(item: T): boolean {
    let code = item.hashCode();
    return this._hashes[code] === true;
  }

  forEach(callback: (v: T, i: number) => void): void {
    this._data.forEach(callback);
  }
}
