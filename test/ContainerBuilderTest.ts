import {ContainerBuilder} from '../src/ContainerBuilder';
import {Handler} from './fixtures/Handler';
import {Definition, Reference} from '../src/Definition';
import {Compiler} from '../src/Compiler';
import {ServiceA} from './fixtures/ServiceA';
import {Tag} from '../src/Definition';
import {BusPass} from './fixtures/BusPass';
import {Bus} from './fixtures/Bus';

describe('ContainerBuilder', () => {
    it('build container', () => {
        const builder = new ContainerBuilder(new Compiler());


        builder.addDefinitions(
            new Definition()
                .setId('bus')
                .setClass(Bus),

            new Definition()
                .setId('handler')
                .setClass(Handler)
                .addArguments(new Reference('service_a'))
                .addTags(new Tag('handler', {'type': 'SUM'})),

            new Definition()
                .setId('service_a')
                .setClass(ServiceA)
        );

        builder.getCompiler().addPass(new BusPass());

        const container = builder.build();

        const bus = container.get<Bus>('bus');

        const result = bus.handle({ type: 'SUM', payload: { a: 1, b: 2 } });

        const handler = container.get('handler');

        expect(result).toEqual(3);
        expect(handler).toBe(bus.getHandlers()['SUM']);
    });
});
