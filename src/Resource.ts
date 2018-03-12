export interface ResourceInterface {
    resolve(): any;
}

// for node.js env
export class FileResource implements ResourceInterface {
    constructor(public path: string, public name: string) {
    }

    resolve(): any {
        throw new Error('Not implemented.');
    }
}

// for browser env
export class ObjectResource implements ResourceInterface {
    constructor(public object: any) {
    }

    resolve(rootDir?: string): any {
        return this.object;
    }
}
