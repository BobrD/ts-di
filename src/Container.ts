import {ContainerInterface} from './ContainerInterface';
import {ServiceNotFoundException} from './Exception/ServiceNotFoundException';

type FactoryRecord<T> = {
    factory: () => T;
    shared: boolean;
};

export class Container implements ContainerInterface {
    private _factories = new Map<string, FactoryRecord<any>>();

    private _services = new Map<string, any>();

    async has(id: string): Promise<boolean> {
        return this._factories.has(id);
    }

    async get<T>(id: string): Promise<T> {
        if (! await this.has(id)) {
            throw new ServiceNotFoundException();
        }

        const {factory, shared} = this._factories.get(id);

        if (! shared) {
            return factory();
        }

        if (! this._services.has(id)) {
            this._services.set(id, factory());
        }

        return this._services.get(id);
    }

    set<T>(id: string, factory: () => T, shared: boolean): void {
        this._factories.set(id, {factory, shared});
    }
}
