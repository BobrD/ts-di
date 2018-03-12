
export interface ContainerInterface {
    has(id: string): boolean;

    get<T>(id: string): T;

    getIds(): string[];

    merge(container: ContainerInterface);
}
