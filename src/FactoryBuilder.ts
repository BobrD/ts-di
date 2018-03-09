import {ContainerBuilder} from './ContainerBuilder';
import {Definition, Reference} from './Definition';

export interface FactoryBuilderInterface<T> {
    createFactory(definition: Definition<T>, containerBuilder: ContainerBuilder): Promise<() => T>;
}

export class ClassFactoryBuilder<T> implements FactoryBuilderInterface<T> {

    async createFactory(definition: Definition<T>, containerBuilder: ContainerBuilder): Promise<() => T> {
        const classCtr = await containerBuilder.resolveResource(definition.resource);

        const args = await this.resolveArguments(definition.arguments, containerBuilder);

        const calls = [];

        for (const call of definition.calls) {
            const args = await this.resolveArguments(call.args, containerBuilder);

            calls.push([call.methodName, args.map(arg => arg())]);
        }

        return () => {
            const instance = new classCtr(...args.map(arg => arg()));

            calls.forEach(([name, args]) => instance[name](...args));

            return instance;
        };
    }

    private async resolveArguments(args: any[], containerBuilder: ContainerBuilder) {
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
