import * as path from 'path';
import { ContainerBuilder } from '../src/ContainerBuilder';
import { Handler } from './fixtures/Handler';
import { Root } from '../src/DefinitionBuilder';
import { Compiler } from '../src/Compiler';
import { ServiceA } from './fixtures/ServiceA';
import { Reference, Tag } from '../src/Definition';
import { BusPass } from './fixtures/BusPass';
import { Bus } from './fixtures/Bus';

describe('ContainerBuilder', () => {
    it('build container', async () => {
        const builder = new ContainerBuilder(new Compiler(), path.resolve(__dirname + '/../'));

        const definitions = new Root()
            .define(b => b
                .id('bus')
                .resource(
                    path.resolve(__dirname, './fixtures/Bus'),
                    'Bus'
                )
            )
            .define(b => b
                .id('handler')
                .resource(
                    path.resolve(__dirname, './fixtures/Handler'),
                    'Handler'
                )
                .arguments(new Reference('service_a'))
                .tags(new Tag('handler', { 'type': 'SUM' }))
            )
            .define(b => b
                .id('service_a')
                .resource(
                    path.resolve(__dirname, './fixtures/ServiceA'),
                    'ServiceA'
                )
            )
            .build()
            ;

        builder.addDefinitions(...definitions);

        builder.getCompiler().addPass(new BusPass());

        const container = await builder.build();

        const bus = await container.get<Bus>('bus');

        const result = bus.handle({ type: 'SUM', payload: { a: 1, b: 2 } });

        expect(result).toEqual(3);
    });
});