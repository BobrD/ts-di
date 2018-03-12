import {ClassFactoryBuilder, FactoryBuilderInterface, FactoryFactoryBuilder} from './FactoryBuilder';
import {ObjectResource, ResourceInterface} from './Resource';

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

export class Definition {
    private _arguments: string[] = [];

    private _shared = true;

    private _id: string;

    private _calls: MethodCall[] = [];

    private _tags: Tag[] = [];

    private _factoryBuilder: ClassFactoryBuilder<any>;

    private _resource?: ResourceInterface;

    private _factory?: Factory;

    setClass(ctr: any): this {
        this._resource = new ObjectResource(ctr);

        this._factoryBuilder = new ClassFactoryBuilder();

        return this;
    }

    setFactory(method: string, ctr: any): this {
        this._factory = new Factory(new ObjectResource(ctr), method);

        this._factoryBuilder = new FactoryFactoryBuilder();

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
}

