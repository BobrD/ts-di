import {ContainerBuilder} from './ContainerBuilder';

export interface CompilerPassInterface {
    process(containerBuilder: ContainerBuilder): void;
}

export class Compiler {
    private _passes: CompilerPassInterface[] = [];

    addPass(pass: CompilerPassInterface) {
        this._passes.push(pass);
    }

    compile(containerBuilder: ContainerBuilder): void {
        this._passes.forEach(pass => pass.process(containerBuilder));
    }
}
