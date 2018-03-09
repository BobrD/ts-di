import {ICommand, IHandler} from './Handler';

export class Bus implements IHandler {
    private _handlers: {[type: string]: IHandler} = {};

    addHandler(handler: IHandler, type: string) {
        this._handlers[type] = handler;
    }

    handle(command: ICommand) {
        return this._handlers[command.type].handle(command);
    }
}
