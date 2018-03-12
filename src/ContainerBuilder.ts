import {Tag} from './Definition';
import {ContainerInterface} from './ContainerInterface';
import {Container} from './Container';
import {Compiler} from './Compiler';
import {Definition} from './Definition';
import {containerId} from './containerId';

export class ContainerBuilder implements ContainerInterface {
    private _definitions: {[id: string]: Definition} = {};

    private _factories: {[id: string]: () => any} = {};

    private _loading: string[] = [];

    private _container = new Container();

    constructor(private _compiler: Compiler) {}

    has(id: string): boolean {
        return this._definitions.hasOwnProperty(id);
    }

    get<T>(id: string): T {
        return this._container.get<T>(id);
    }

    getIds(): string[] {
        return this._container.getIds();
    }

    addDefinitions<T>(...definitions: Definition[]) {
        definitions.forEach(definition => this._definitions[definition.getId()] = definition);
    }

    getDefinitions(): Definition[] {
        return Object.keys(this._definitions).map(id => this._definitions[id]);
    }

    findDefinition(id: string): Definition | undefined {
        return this.getDefinitions().find(d => d.getId() === id);
    }

    getCompiler(): Compiler {
        return this._compiler;
    }

    removeDefinition(id: string): void {
        delete this._definitions[id];
    }

    hasDefinition(id: string): boolean {
        return this._definitions.hasOwnProperty(id);
    }

    getServiceIds(): string[] {
        return Object.keys(this._definitions);
    }

    findTaggedServiceIds(name: string): string[] {
        return this
            .getDefinitions()
            .filter(def => -1 !== def.getTags().findIndex(t => t.name === name))
            .map(def => def.getId())
        ;
    }

    findTags(): Tag[] {
        const allTags = {};

        this.getDefinitions()
            .forEach(def => def.getTags().forEach(tag => allTags[tag.name] = tag))
        ;

        return Object.values(allTags);
    }

    findUnusedTags() {
        // todo
    }

    build(): ContainerInterface {
        this._compiler.compile(this);

        for (const id of Object.keys(this._definitions)) {
            const factory = this.getFactory(id);

            this._container.set(id, factory, this._definitions[id].isShared());
        }

        return this._container;
    }

    merge(builder: ContainerBuilder): void {
        Object.entries(builder._definitions).forEach(([id, definition]) => this._definitions[id] = definition);

        Object.entries(builder._factories).forEach(([id, factory]) => this._factories[id] = factory);
    }

    private getFactory(id: string): () => any {
        if (id === containerId) {
            return () => this._container;
        }

        if (-1 !== this._loading.findIndex(c => c === id)) {
            throw new Error('Circle reference.');
        }

        if (this._factories.hasOwnProperty(id)) {
            return this._factories[id];
        }

        this._loading.push(id);

        const definition = this._definitions[id];

        this._factories[id] = definition.getFactoryBuilder().createFactory(definition, this);

        this._loading = this._loading.filter(c => c !== id);

        return this._factories[id];
    }
}
