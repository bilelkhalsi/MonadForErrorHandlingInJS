
/**
 * Left represents the sad path.
 */
export class Left {
    constructor(val) {
        this._value = val;
    }
    map() {
        // Left is the sad path
        // so we do nothing
        return this;
    }

    toString() {
        const str = this._value.toString();
        return `Left(${$str})`;
    }
}

/**
 * Right represents the happy path
 */
export class Right {
    constructor(val) {
        this._value = val;
    }

    map(fn) {
        return new Right(
            fn(this._value)
        );
    }

    toString() {
        const str = this._value.toString();
        return `Right(${str})`;
    }
}