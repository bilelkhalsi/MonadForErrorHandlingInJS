
/**
 * Either represents a Left or Right value.
 */
export class Either {

    constructor(val) {
        this._value = val;
    }

    static left(val) {
        return new Left(val);
    }

    static right(val) {
        return new Right(val);
    }

    map(fn) {
        // Left is the sad path
        // so we do nothing
        return (this instanceof Left) ? this : new Right(fn(this._value));
    }

    flatMap(fn) {
        // Left is the sad path
        // so we do nothing
        return (this instanceof Left) ? this : fn(this._value);
    }

    toString() {
        const str = this._value.toString();
        if (this instanceof Left) {
            return `Left(${str})`;
        }
        if (this instanceof Right) {
            return `Right(${str})`;
        }

    }

}

/**
 * Left represents the sad path.
 */
export class Left extends Either {
    constructor(val) {
        super(val)
    }

    static of(val) {
        return new Left(val);
    }

}

/**
 * Right represents the happy path
 */
export class Right extends Either {

    constructor(val) {
        super(val);
    }
    static of(val) {
        return new Right(val);
    }
}