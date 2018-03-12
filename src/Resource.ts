export interface ResourceInterface<T> {
    resolve(): T;
}

// for node.js env
export class FileResource<T> implements ResourceInterface<T> {
    constructor(public path: string, public name: string) {
    }

    resolve(): any {
        throw new Error('Not implemented.');
    }
}

// for browser env
export class ObjectResource<T> implements ResourceInterface<T> {
    constructor(public object: T) {
    }

    resolve(): T {
        return this.object;
    }
}
