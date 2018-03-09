export interface ContainerInterface {
    has(id: string): Promise<boolean>;

    get<T>(id: string): Promise<T>;
}
