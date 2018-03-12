import {ContainerInterface} from './ContainerInterface';
import {ServiceNotFoundException} from './Exception/ServiceNotFoundException';
import {containerId} from './containerId';

export type Factory<T> = () => T;

type FactoryRecord<T> = {
    factory: Factory<T>;
    shared: boolean;
};

export class Container implements ContainerInterface {
    private _factories: {[id: string]: FactoryRecord<any>} = {};

    private _services: {[id: string]: any} = {};

    has(id: string): boolean {
        return this._factories.hasOwnProperty(id);
    }

    getIds(): string[] {
        return Object.keys(this._factories);
    }

    get<T>(id: string): T {
        if (id === containerId) {
            return this as any;
        }

        if (! this.has(id)) {
            throw new ServiceNotFoundException();
        }

        if (this._services.hasOwnProperty(id)) {
            return this._services[id];
        }

        const {factory, shared} = this._factories[id];

        const service = factory();

        if (! shared) {
            return service;
        }

        return this._services[id] = service;
    }

    set<T>(id: string, factory: Factory<T>, shared: boolean): void {
        this._factories[id] = {factory, shared};
    }

    merge(container: Container) {
        Object.entries(container._factories).forEach(([id, factory]) => this._factories[id] = factory);

        Object.entries(container._services).forEach(([id, service]) => this._services[id] = service);
    }
}
