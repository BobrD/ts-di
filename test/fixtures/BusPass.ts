import {CompilerPassInterface} from '../../src/Compiler';
import {ContainerBuilder} from '../../src/ContainerBuilder';
import {MethodCall, Reference, Tag} from '../../src/Definition';

export class BusPass implements CompilerPassInterface {

    process(containerBuilder: ContainerBuilder): void {
        const handlerIds = containerBuilder.findTaggedServiceIds('handler');

        const busDefinition = containerBuilder.findDefinition('bus');

        handlerIds.forEach(id => {
            const handlerDefinition = containerBuilder.findDefinition(id);

            const tag: Tag = handlerDefinition.tags.find(tag => tag.name === 'handler');

            busDefinition.calls.push(
                new MethodCall(
                    'addHandler',
                    [new Reference(id), tag.atribures['type']]
                )
            );
        });
    }
}
