import {CompilerPassInterface} from '../../src/Compiler';
import {ContainerBuilder} from '../../src/ContainerBuilder';
import {Tag} from '../../src/Definition';
import {MethodCall, Reference} from "../../src/Definition";

export class BusPass implements CompilerPassInterface {

    process(containerBuilder: ContainerBuilder): void {
        const handlerIds = containerBuilder.findTaggedServiceIds('handler');

        const busDefinition = containerBuilder.findDefinition('bus');

        handlerIds.forEach(id => {
            const handlerDefinition = containerBuilder.findDefinition(id);

            const tag: Tag = handlerDefinition.getTags().find(tag => tag.name === 'handler');

            busDefinition.addMethodCalls(
                new MethodCall(
                    'addHandler',
                    [new Reference(id), tag.atribures['type']]
                )
            );
        });
    }
}
