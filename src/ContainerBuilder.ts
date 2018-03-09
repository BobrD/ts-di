import {Tag} from './Definition';
import {ContainerInterface} from './ContainerInterface';
import {Container} from './Container';
import {Resource} from './Resource';
import {Compiler} from './Compiler';
import {Definition} from './Definition';

export class ContainerBuilder {
    private _definitions: {[id: string]: Definition} = {};

    private _factories: {[id: string]: () => any} = {};

    constructor(private _compiler: Compiler, private _projectRootDir: string) {}

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

        const container = new Container();

        for (const id of Object.keys(this._definitions)) {
            const factory = await this.getFactory(id);

            container.set(id, factory, this._definitions[id].isShared());
        }

        return container;
    }

    async getFactory(id: string) {
        if (! this._factories.hasOwnProperty(id)) {
            const definition = this._definitions[id];

            this._factories[id] = await definition.getFactoryBuilder().createFactory(definition, this);
        }

        return this._factories[id];
    }

    async resolveResource(resource: Resource) {
        const absolutePath = this._projectRootDir + resource.path;

        const file = await import(absolutePath);

        return file[resource.name];
    }
}
