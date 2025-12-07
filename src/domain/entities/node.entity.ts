import { Resource } from './resource.entity';

export class Node {
  private neighbors: Set<string> = new Set();
  private resources: Map<string, Resource> = new Map();
  private resourceCache: Map<string, string> = new Map();

  constructor(public readonly id: string) {}

  addNeighbor(nodeId: string): void {
    if (nodeId === this.id) {
      throw new Error('Cannot add self as neighbor');
    }
    this.neighbors.add(nodeId);
  }

  removeNeighbor(nodeId: string): void {
    this.neighbors.delete(nodeId);
  }

  getNeighbors(): string[] {
    return Array.from(this.neighbors);
  }

  hasNeighbor(nodeId: string): boolean {
    return this.neighbors.has(nodeId);
  }

  getNeighborCount(): number {
    return this.neighbors.size;
  }

  addResource(resource: Resource): void {
    this.resources.set(resource.id, resource);
  }

  hasResource(resourceId: string): boolean {
    return this.resources.has(resourceId);
  }

  getResource(resourceId: string): Resource | undefined {
    return this.resources.get(resourceId);
  }

  getResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  getResourceCount(): number {
    return this.resources.size;
  }

  updateCache(resourceId: string, nodeId: string): void {
    this.resourceCache.set(resourceId, nodeId);
  }

  getCachedLocation(resourceId: string): string | undefined {
    return this.resourceCache.get(resourceId);
  }

  clearCache(): void {
    this.resourceCache.clear();
  }

  toString(): string {
    return `Node(id=${this.id}, neighbors=${this.neighbors.size}, resources=${this.resources.size})`;
  }
}
