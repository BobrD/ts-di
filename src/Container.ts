import {containerId, ContainerInterface} from './ContainerInterface';
import {ServiceNotFoundException} from './Exception/ServiceNotFoundException';

type FactoryRecord<T> = {
    factory: () => T;
    shared: boolean;
};

export class Container implements ContainerInterface {
    private _factories: {[id: string]: FactoryRecord<any>} = {};

    private _services: {[id: string]: any} = {};

    async has(id: string): Promise<boolean> {
        return this._factories.hasOwnProperty(id);
    }

    getIds(): string[] {
        return Object.keys(this._factories);
    }

    async get<T>(id: string): Promise<T> {
        if (id === containerId) {
            return this as any;
        }

        if (! await this.has(id)) {
            throw new ServiceNotFoundException();
        }

        if (this._services.hasOwnProperty(id)) {
            return this._services[id];
        }

        const {factory, shared} = this._factories[id];

        const service = await factory();

        if (! shared) {
            return service;
        }

        return this._services[id] = service;
    }

    set<T>(id: string, factory: () => T, shared: boolean): void {
        this._factories[id] = {factory, shared};
    }

    merge(container: Container) {
        Object.entries(container._factories).forEach(([id, factory]) => this._factories[id] = factory);

        Object.entries(container._services).forEach(([id, service]) => this._services[id] = service);
    }
}
