export class SearchResult {
  constructor(
    public readonly resourceId: string,
    public readonly found: boolean,
    public readonly locationNodeId: string | undefined,
    public readonly totalMessages: number,
    public readonly totalNodesVisited: number,
    public readonly visitedNodes: string[],
    public readonly path: string[],
  ) {}

  toString(): string {
    return `SearchResult(
      resourceId=${this.resourceId},
      found=${this.found},
      location=${this.locationNodeId || 'not found'},
      messages=${this.totalMessages},
      nodesVisited=${this.totalNodesVisited}
    )`;
  }

  toJSON(): object {
    return {
      resourceId: this.resourceId,
      found: this.found,
      locationNodeId: this.locationNodeId,
      totalMessages: this.totalMessages,
      totalNodesVisited: this.totalNodesVisited,
      visitedNodes: this.visitedNodes,
      path: this.path,
    };
  }
}
