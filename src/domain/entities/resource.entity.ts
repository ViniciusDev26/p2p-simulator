export class Resource {
  constructor(
    public readonly id: string,
    public readonly nodeId: string,
  ) {}

  equals(other: Resource): boolean {
    return this.id === other.id && this.nodeId === other.nodeId;
  }

  toString(): string {
    return `Resource(id=${this.id}, nodeId=${this.nodeId})`;
  }
}
