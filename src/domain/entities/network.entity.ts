import { Node } from './node.entity';
import { Resource } from './resource.entity';

export class Network {
  private nodes: Map<string, Node> = new Map();

  constructor(
    public readonly minNeighbors: number,
    public readonly maxNeighbors: number,
  ) {
    if (minNeighbors < 0) {
      throw new Error('minNeighbors must be non-negative');
    }
    if (maxNeighbors < minNeighbors) {
      throw new Error('maxNeighbors must be greater than or equal to minNeighbors');
    }
  }

  addNode(node: Node): void {
    this.nodes.set(node.id, node);
  }

  getNode(nodeId: string): Node | undefined {
    return this.nodes.get(nodeId);
  }

  hasNode(nodeId: string): boolean {
    return this.nodes.has(nodeId);
  }

  getNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  getNodeCount(): number {
    return this.nodes.size;
  }

  addEdge(nodeId1: string, nodeId2: string): void {
    const node1 = this.getNode(nodeId1);
    const node2 = this.getNode(nodeId2);

    if (!node1) {
      throw new Error(`Node ${nodeId1} not found`);
    }
    if (!node2) {
      throw new Error(`Node ${nodeId2} not found`);
    }
    if (nodeId1 === nodeId2) {
      throw new Error('Cannot create edge from node to itself');
    }

    node1.addNeighbor(nodeId2);
    node2.addNeighbor(nodeId1);
  }

  removeEdge(nodeId1: string, nodeId2: string): void {
    const node1 = this.getNode(nodeId1);
    const node2 = this.getNode(nodeId2);

    if (node1) {
      node1.removeNeighbor(nodeId2);
    }
    if (node2) {
      node2.removeNeighbor(nodeId1);
    }
  }

  findResourceLocation(resourceId: string): string | undefined {
    for (const node of this.nodes.values()) {
      if (node.hasResource(resourceId)) {
        return node.id;
      }
    }
    return undefined;
  }

  getAllResources(): Map<string, Resource[]> {
    const resourceMap = new Map<string, Resource[]>();
    for (const node of this.nodes.values()) {
      resourceMap.set(node.id, node.getResources());
    }
    return resourceMap;
  }

  toString(): string {
    return `Network(nodes=${this.nodes.size}, minNeighbors=${this.minNeighbors}, maxNeighbors=${this.maxNeighbors})`;
  }
}
