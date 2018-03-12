import {ClassFactoryBuilder, FactoryBuilderInterface, FactoryFactoryBuilder} from './FactoryBuilder';
import {FileResource, ObjectResource, ResourceInterface} from './Resource';

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

export class Factory {
    constructor(public resource: ResourceInterface, public method: string) {}
}

export enum ResourceType {
    class = 'class',
    factory = 'factory'
}

export class Definition {
    private _factories = {
        [ResourceType.class]: () => new ClassFactoryBuilder(),
        [ResourceType.factory]: () => new FactoryFactoryBuilder()
    };

    private _arguments: string[] = [];

    private _shared = true;

    private _id: string;

    private _calls: MethodCall[] = [];

    private _tags: Tag[] = [];

    private _factoryBuilder: ClassFactoryBuilder<any>;

    private _resource?: ResourceInterface;

    private _factory?: Factory;

    setResource(path: string, name: string, type: ResourceType): this {
        if (true) {
            throw new Error('File resource not supported in browser env');
        }

        this._resource = this.createResource(path, name);

        this._factoryBuilder = this.createFactoryBuilder(type);

        return this;
    }

    setClass(ctr: any): this {
        this._resource = this.createResource(ctr);

        this._factoryBuilder = this.createFactoryBuilder(ResourceType.class);

        return this;
    }

    setFactory(method: string, path: string, name: string);
    setFactory(method: string, ctr: any);
    setFactory(first: any, second: any, third?: any): this {
        this._factory = new Factory(this.createResource(second, third), first);

        this._factoryBuilder = this.createFactoryBuilder(ResourceType.factory);

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

    getFactory(): Factory | undefined {
        return this._factory;
    }

    isShared() {
        return this._shared;
    }

    private createResource(ctr: any): ResourceInterface;
    private createResource(file: string, path: string): ResourceInterface;
    private createResource(first: any, second?: any) {
        const args = [...arguments].filter(arg => arg !== undefined);

        if (args.length === 2) {
            throw new Error('File resource not supported.');
        }

        if (false) { // todo fot node env should return FileResource
            // @ts-ignore
            const ctrModule = module.parent.children.find(({exports}) => this.findExport(exports, first));

            if (void 0 === ctrModule) {
                throw new Error('Module not found');
            }

            return new FileResource(ctrModule.filename, this.findExport(ctrModule.exports, first))
        }

        return new ObjectResource(first);
    }


    private createFactoryBuilder(type: ResourceType) {
        return this._factories[type]();
    }

    private findExport(moduleExport: {}, ctr: new() => any) {
        return Object.keys(moduleExport)
            .find(exportName => moduleExport[exportName] === ctr);
    }
}

