import { Injectable } from '@nestjs/common';
import { ISearchAlgorithm, SearchParams } from '../domain/interfaces/search-algorithm.interface';
import { Network } from '../domain/entities/network.entity';
import { SearchResult } from '../domain/entities/search-result.entity';

@Injectable()
export class FloodingAlgorithm implements ISearchAlgorithm {
  getName(): string {
    return 'Flooding';
  }

  search(network: Network, params: SearchParams): SearchResult {
    const { nodeId, resourceId, ttl } = params;
    const startNode = network.getNode(nodeId);

    if (!startNode) {
      throw new Error(`Start node ${nodeId} not found`);
    }

    const visitedNodes = new Set<string>();
    const path: string[] = [];
    let totalMessages = 0;
    let foundNodeId: string | undefined = undefined;

    const queue: Array<{ nodeId: string; currentTtl: number; currentPath: string[] }> = [
      { nodeId, currentTtl: ttl, currentPath: [nodeId] },
    ];

    while (queue.length > 0 && !foundNodeId) {
      const { nodeId: currentNodeId, currentTtl, currentPath } = queue.shift()!;

      if (visitedNodes.has(currentNodeId) || currentTtl < 0) {
        continue;
      }

      visitedNodes.add(currentNodeId);
      const currentNode = network.getNode(currentNodeId);

      if (!currentNode) {
        continue;
      }

      if (currentNode.hasResource(resourceId)) {
        foundNodeId = currentNodeId;
        path.push(...currentPath);
        console.log(`[Flooding] Recurso ${resourceId} encontrado em ${currentNodeId}`);
        break;
      }

      if (currentTtl > 0) {
        const neighbors = currentNode.getNeighbors();
        for (const neighborId of neighbors) {
          if (!visitedNodes.has(neighborId)) {
            totalMessages++;
            queue.push({
              nodeId: neighborId,
              currentTtl: currentTtl - 1,
              currentPath: [...currentPath, neighborId],
            });
          }
        }
      }
    }

    return new SearchResult(
      resourceId,
      !!foundNodeId,
      foundNodeId,
      totalMessages,
      visitedNodes.size,
      Array.from(visitedNodes),
      path,
    );
  }
}
