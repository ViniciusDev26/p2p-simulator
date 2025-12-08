import { Injectable } from '@nestjs/common';
import {
  ISearchAlgorithm,
  SearchParams,
} from '../domain/interfaces/search-algorithm.interface';
import { Network } from '../domain/entities/network.entity';
import { SearchResult } from '../domain/entities/search-result.entity';

@Injectable()
export class InformedRandomWalkAlgorithm implements ISearchAlgorithm {
  getName(): string {
    return 'Informed Random Walk';
  }

  search(network: Network, params: SearchParams): SearchResult {
    const { nodeId, resourceId, ttl } = params;
    const startNode = network.getNode(nodeId);

    if (!startNode) {
      throw new Error(`Start node ${nodeId} not found`);
    }

    const cachedLocation = startNode.getCachedLocation(resourceId);
    if (cachedLocation) {
      const cachedNode = network.getNode(cachedLocation);
      if (cachedNode && cachedNode.hasResource(resourceId)) {
        return new SearchResult(
          resourceId,
          true,
          cachedLocation,
          0,
          1,
          [nodeId],
          [nodeId, cachedLocation],
        );
      }
    }

    const visitedNodes = new Set<string>();
    const path: string[] = [];
    let totalMessages = 0;
    let foundNodeId: string | undefined = undefined;
    let currentNodeId = nodeId;
    let currentTtl = ttl;

    while (currentTtl >= 0 && !foundNodeId) {
      visitedNodes.add(currentNodeId);
      path.push(currentNodeId);

      const currentNode = network.getNode(currentNodeId);
      if (!currentNode) {
        break;
      }

      const cachedLoc = currentNode.getCachedLocation(resourceId);
      if (cachedLoc) {
        const cachedNode = network.getNode(cachedLoc);
        if (cachedNode && cachedNode.hasResource(resourceId)) {
          foundNodeId = cachedLoc;
          path.push(cachedLoc);
          this.updateCachesAlongPath(network, path, resourceId, cachedLoc);
          break;
        }
      }

      if (currentNode.hasResource(resourceId)) {
        foundNodeId = currentNodeId;
        this.updateCachesAlongPath(network, path, resourceId, currentNodeId);
        break;
      }

      if (currentTtl === 0) {
        break;
      }

      const neighbors = currentNode.getNeighbors();
      const unvisitedNeighbors = neighbors.filter((n) => !visitedNodes.has(n));

      if (unvisitedNeighbors.length === 0) {
        break;
      }

      const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
      currentNodeId = unvisitedNeighbors[randomIndex];
      totalMessages++;
      currentTtl--;
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

  private updateCachesAlongPath(
    network: Network,
    path: string[],
    resourceId: string,
    locationNodeId: string,
  ): void {
    for (const nodeId of path) {
      const node = network.getNode(nodeId);
      if (node) {
        node.updateCache(resourceId, locationNodeId);
      }
    }
  }
}
