export interface RepositoryEntity {
  id: string;
}

export interface CrudRepository<T extends RepositoryEntity, TCreate, TUpdate> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(input: TCreate): Promise<T>;
  update(id: string, updates: TUpdate): Promise<T | null>;
  archive(id: string): Promise<T | null>;
}
