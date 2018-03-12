import {ContainerBuilder} from './ContainerBuilder';
import { Reference} from './Definition';
import {Definition} from './Definition';

export interface FactoryBuilderInterface<T> {
    createFactory(definition: Definition, containerBuilder: ContainerBuilder): Promise<() => Promise<T>>;
}

abstract class AbstractFactoryBuilder<T> implements FactoryBuilderInterface<T> {

    abstract createFactory(definition: Definition, containerBuilder: ContainerBuilder): Promise<() => Promise<T>>;

    protected async resolveArguments(args: any[], containerBuilder: ContainerBuilder) {
        return Promise.all(
            args.map(arg => {
                if (arg instanceof Reference) {
                    return containerBuilder.getFactory(arg.id);
                }

                return () => arg;
            })
        );
    }
}

export class ClassFactoryBuilder<T> extends AbstractFactoryBuilder<T> {

    async createFactory(definition: Definition, containerBuilder: ContainerBuilder): Promise<() => Promise<T>> {
        const classCtr = await containerBuilder.resolveResource(definition.getResource());

        const args = await this.resolveArguments(definition.getArguments(), containerBuilder);

        const calls = [];

        for (const call of definition.getCalls()) {
            const args = await this.resolveArguments(call.args, containerBuilder);

            calls.push([call.methodName, args.map(arg => arg())]);
        }

        return async () => {
            const instance = new classCtr(...args.map(arg => arg()));

            calls.forEach(([name, args]) => instance[name](...args));

            return instance;
        };
    }
}

export class FactoryFactoryBuilder<T> extends AbstractFactoryBuilder<T>  {

    async createFactory(definition: Definition, containerBuilder: ContainerBuilder): Promise<() => Promise<T>> {
        const factoryDefinition = definition.getFactory();

        const factoryCtr = await containerBuilder.resolveResource(factoryDefinition.resource);

        const factory = new factoryCtr;

        const args = await this.resolveArguments(definition.getArguments(), containerBuilder);

        return async () => await factory[factoryDefinition.method](...args.map(arg => arg()));
    }
}