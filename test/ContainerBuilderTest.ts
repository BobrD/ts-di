import {ContainerBuilder} from '../src/ContainerBuilder';
import {Handler} from './fixtures/Handler';
import {Definition, Reference} from '../src/Definition';
import {Compiler} from '../src/Compiler';
import {ServiceA} from './fixtures/ServiceA';
import {Tag} from '../src/Definition';
import {BusPass} from './fixtures/BusPass';
import {Bus} from './fixtures/Bus';
import * as path from 'path';

describe('ContainerBuilder', () => {
    it('build container', async () => {
        const builder = new ContainerBuilder(new Compiler(), path.resolve(__dirname + '/../'));


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

        const container = await builder.build();

        const bus = await container.get<Bus>('bus');

        const result = bus.handle({ type: 'SUM', payload: { a: 1, b: 2 } });

        expect(result).toEqual(3);
    });
});
