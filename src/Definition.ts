import {ClassFactoryBuilder, FactoryBuilderInterface} from './FactoryBuilder';
import {Resource} from './Resource';

export class Reference {
    constructor(public id: string) {
    }
}

export class MethodCall {
    constructor(public methodName: string, public args: any[]) {
    }
}

export class Tag {
    constructor(public name: string, public atribures: {} = {}) {
    }
}

export class Definition {
    private _arguments: string[] = [];

    private _shared = true;

    private _id: string;

    private _calls: MethodCall[] = [];

    private _tags: Tag[] = [];

    private _factoryBuilder: ClassFactoryBuilder<any>;

    private _resource: Resource;

    setResource(path: string, name: string): this {
        this._resource = new Resource(path, name);

        this._factoryBuilder = new ClassFactoryBuilder();

        return this;
    }

    setClass(ctr: new() => any) {
        // @ts-ignore
        const ctrModule = module.parent.children.find(({exports}) => this.findExport(exports, ctr));

        if (void 0 === ctrModule) {
            throw new Error('Module not found');
        }

        this._resource = new Resource(ctrModule.filename, this.findExport(ctrModule.exports, ctr));

        this._factoryBuilder = new ClassFactoryBuilder();

        return this;
    }

    setId(id: string): this {
        this._id = id;

        return this;
    }

    markAsNotShared() {
        this._shared = false;
    }

    addArguments(...args: any[]): this {
        this._arguments = args;

        return this;
    }

    addMethodCalls(...calls: MethodCall[]): this {
        this._calls = calls;

        return this;
    }

    addTags(...tags: Tag[]): this {
        this._tags = tags;

        return this;
    }

    getResource() {
        return this._resource;
    }

    getArguments(): string[] {
        return this._arguments;
    }

    getId(): string {
        return this._id;
    }

    getCalls(): MethodCall[] {
        return this._calls;
    }

    getTags(): Tag[] {
        return this._tags;
    }

    getFactoryBuilder(): FactoryBuilderInterface<any> {
        return this._factoryBuilder;
    }

    isShared() {
        return this._shared;
    }

    private findExport(moduleExport: {}, ctr: new() => any) {
        return Object.keys(moduleExport)
            .find(exportName => moduleExport[exportName] === ctr);
    }
}

