import {Resource} from './Resource';
import {FactoryBuilderInterface} from './FactoryBuilder';

export class Reference {
    constructor(public id: string) {}
}

export class MethodCall {
    constructor(public methodName: string, public args: any[]) {}
}

export class Tag {
    constructor(public name: string, public atribures: {} = {}) {}
}

export class Definition<T> {
    id: string;

    resource: Resource;

    shared: boolean;

    factoryBuilder: FactoryBuilderInterface<T>;

    arguments: any[] = [];

    tags: Tag[] = [];

    calls: MethodCall[] = [];
}
