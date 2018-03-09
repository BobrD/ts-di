import {ServiceA} from './ServiceA';

export interface ICommand {
    type: string;
    payload: any;
}

export interface IHandler {
    handle(command: ICommand): any;
}

export class Handler implements IHandler {
    constructor(private _serviceA: ServiceA) {
    }

    handle(command: {payload: {a: number, b: number}, type: 'SUM'}) {
        return this._serviceA.doWork(command.payload.a, command.payload.b);
    }
}
