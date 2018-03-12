export interface ResourceInterface {
    resolve(rootDir?: string): Promise<any>;
}

// for node.js env
export class FileResource implements ResourceInterface {
    constructor(public path: string, public name: string) {
    }

    async resolve(rootDir?: string): Promise<any> {
        const absolutePath = rootDir + this.path;

        const file = await import(absolutePath);

        return file[this.name];
    }
}

// for browser env
export class ObjectResource implements ResourceInterface {
    constructor(public object: any) {
    }

    async resolve(rootDir?: string): Promise<any> {
        return this.object;
    }
}