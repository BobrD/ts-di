import {Tag} from './Definition';
import {containerId, ContainerInterface} from './ContainerInterface';
import {Container} from './Container';
import {ResourceInterface} from './Resource';
import {Compiler} from './Compiler';
import {Definition} from './Definition';

export class ContainerBuilder {
    private _definitions: {[id: string]: Definition} = {};

    private _factories: {[id: string]: () => any} = {};

    private _loading: string[] = [];

    private _container = new Container();

    constructor(private _compiler: Compiler, private _projectRootDir?: string) {}

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

    async build(): Promise<ContainerInterface> {
        this._compiler.compile(this);

        for (const id of Object.keys(this._definitions)) {
            const factory = await this.getFactory(id);

            this._container.set(id, factory, this._definitions[id].isShared());
        }

        return this._container;
    }

    merge(builder: ContainerBuilder) {
        Object.entries(builder._definitions).forEach(([id, definition]) => this._definitions[id] = definition);

        Object.entries(builder._factories).forEach(([id, factory]) => this._factories[id] = factory);
    }

    async getFactory(id: string) {
        if (id === containerId) {
            return () => this._container;
        }

        if (-1 !== this._loading.findIndex(c => c === id)) {
            throw new Error('Circle reference.');
        }

        this._loading.push(id);

        if (! this._factories.hasOwnProperty(id)) {
            const definition = this._definitions[id];

            if (undefined === definition) {
                throw new Error(`Definition with id: "${id}" not found.`);
            }

            this._factories[id] = await definition.getFactoryBuilder().createFactory(definition, this);
        }

        this._loading = this._loading.filter(c => c !== id);

        return this._factories[id];
    }

    async resolveResource(resource: ResourceInterface) {
        return resource.resolve(this._projectRootDir);
    }
}
