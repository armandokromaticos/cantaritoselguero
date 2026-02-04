export class EntityInactiveException extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} with id ${id} is inactive`);
    this.name = "EntityInactiveException";
  }
}
