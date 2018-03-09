import {Definition, MethodCall, Tag} from './Definition';
import {ClassFactoryBuilder} from './FactoryBuilder';
import {Resource} from './Resource';

// todo merge with Definition
export class DefinitionBuilder {
    private _path: string;

    private _name: string;

    private _arguments: string[] = [];

    private _class = false;

    private _shared = true;

    private _id: string;

    private _calls: MethodCall[] = [];

    private _tags: Tag[] = [];

    resource(path: string, name: string): this {
        this._path = path;
        this._name = name;

        this._class = true;

        return this;
    }

    class(ctr: new() => any) {
        const findExport = moduleExport => Object.keys(moduleExport)
            .find(exportName => moduleExport[exportName] === ctr);

        // @ts-ignore
        const ctrModule = module.parent.children.find(module => findExport(module.exports));

        if (void 0 === ctrModule) {
            throw new Error('Module not found');
        }

        this._path = ctrModule.filename;
        this._name = findExport(ctrModule.exports);
        this._class = true;

        return this;
    }

    id(id: string): this {
        this._id = id;

        return this;
    }

    notShared() {
        this._shared = false;
    }

    arguments(...args: any[]): this {
        this._arguments = args;

        return this;
    }

    call(...calls: MethodCall[]): this {
        this._calls = calls;

        return this;
    }

    tags(...tags: Tag[]): this {
        this._tags = tags;

        return this;
    }

    build<T>(): Definition<T> {
        const definition = new Definition<T>();

        if (this._class) {
            definition.factoryBuilder = new ClassFactoryBuilder();
        }

        definition.arguments = this._arguments;
        definition.resource = new Resource(this._path, this._name);
        definition.shared = this._shared;
        definition.calls = this._calls;
        definition.id = this._id;
        definition.tags = this._tags;

        return definition;
    }
}

export class Root {
    private _builders: DefinitionBuilder[] = [];

    define(definer: (builder: DefinitionBuilder) => any) {
        const builder = new DefinitionBuilder();

        this._builders.push(builder);

        definer(builder);

        return this;
    }

    build(): Definition<any>[] {
        return this._builders.map(b => b.build());
    }
}
