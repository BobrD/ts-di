import {ContainerBuilder} from './ContainerBuilder';
import {Reference} from './Definition';
import {Definition} from './Definition';

export interface FactoryBuilderInterface<T> {
    createFactory(definition: Definition, containerBuilder: ContainerBuilder): () => T;
}

abstract class AbstractFactoryBuilder<T> implements FactoryBuilderInterface<T> {

    abstract createFactory(definition: Definition, containerBuilder: ContainerBuilder): () => T;

    protected resolveArguments(args: any[], containerBuilder: ContainerBuilder) {
        return args.map(arg => {
            if (arg instanceof Reference) {
                return containerBuilder.get(arg.id);
            }

            return arg;
        });
    }
}

export class ClassFactoryBuilder<T> extends AbstractFactoryBuilder<T> {

    createFactory(definition: Definition, containerBuilder: ContainerBuilder): () => T {
        return () => {
            const classCtr = definition.getResource().resolve();

            const args = this.resolveArguments(definition.getArguments(), containerBuilder);

            const instance = new classCtr(...args);

            definition.getCalls().forEach(({methodName, args}) => {
                instance[methodName](...this.resolveArguments(args, containerBuilder));
            });

            return instance;
        };
    }
}

export class FactoryFactoryBuilder<T> extends AbstractFactoryBuilder<T>  {

    createFactory(definition: Definition, containerBuilder: ContainerBuilder): () => T {
        return () => {
            const {resource, method} = definition.getFactory();

            const factoryCtr = resource.resolve();

            const factory = new factoryCtr();

            const args = this.resolveArguments(definition.getArguments(), containerBuilder);

            return factory[method](...args);
        };
    }
}
