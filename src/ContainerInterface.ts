export const containerId = 'service_container';

export interface ContainerInterface {
    has(id: string): Promise<boolean>;

    get<T>(id: string): Promise<T>;

    getIds(): string[];

    merge(container: ContainerInterface);
}
