import {ICommand, IHandler} from './Handler';

export type HandlerMap = {[type: string]: IHandler};

export class Bus implements IHandler {
    private _handlers: HandlerMap = {};

    addHandler(handler: IHandler, type: string) {
        this._handlers[type] = handler;
    }

    getHandlers(): HandlerMap {
        return this._handlers;
    }

    handle(command: ICommand) {
        return this._handlers[command.type].handle(command);
    }
}
