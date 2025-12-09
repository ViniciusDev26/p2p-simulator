import { Injectable } from '@nestjs/common';
import {
  ISearchAlgorithm,
  SearchParams,
} from '../domain/interfaces/search-algorithm.interface';
import { Network } from '../domain/entities/network.entity';
import { SearchResult } from '../domain/entities/search-result.entity';

@Injectable()
export class ExhaustiveRandomWalkAlgorithm implements ISearchAlgorithm {
  getName(): string {
    return 'Exhaustive Random Walk';
  }

  search(network: Network, params: SearchParams): SearchResult {
    const { nodeId, resourceId, ttl } = params;
    const startNode = network.getNode(nodeId);

    if (!startNode) {
      throw new Error(`Start node ${nodeId} not found`);
    }

    const visitedNodes = new Set<string>();
    let foundPath: string[] = [];
    let totalMessages = 0;
    let foundNodeId: string | undefined = undefined;

    // Queue de caminhos a explorar
    // Cada item é um caminho independente (random walk)
    const queue: Array<{
      nodeId: string;
      currentTtl: number;
      currentPath: string[];
      visited: Set<string>; // Visited específico deste caminho
    }> = [
      {
        nodeId,
        currentTtl: ttl,
        currentPath: [nodeId],
        visited: new Set([nodeId]),
      },
    ];

    while (queue.length > 0 && !foundNodeId) {
      const { nodeId: currentNodeId, currentTtl, currentPath, visited } =
        queue.shift()!;

      // Marca como globalmente visitado (para estatísticas)
      visitedNodes.add(currentNodeId);

      const currentNode = network.getNode(currentNodeId);
      if (!currentNode) {
        continue;
      }

      // Verifica se encontrou o recurso
      if (currentNode.hasResource(resourceId)) {
        foundNodeId = currentNodeId;
        foundPath = currentPath;
        console.log(
          `[Exhaustive Random Walk] Recurso ${resourceId} encontrado em ${currentNodeId}`,
        );
        break;
      }

      // Se ainda tem TTL, escolhe um vizinho aleatório não visitado NESTE caminho
      if (currentTtl > 0) {
        const neighbors = currentNode.getNeighbors();
        const unvisitedNeighbors = neighbors.filter((n) => !visited.has(n));

        if (unvisitedNeighbors.length > 0) {
          // Escolhe aleatoriamente um dos vizinhos não visitados
          const randomIndex = Math.floor(
            Math.random() * unvisitedNeighbors.length,
          );
          const chosenNeighbor = unvisitedNeighbors[randomIndex];

          totalMessages++;

          // Adiciona o vizinho escolhido à queue
          const newVisited = new Set(visited);
          newVisited.add(chosenNeighbor);

          queue.push({
            nodeId: chosenNeighbor,
            currentTtl: currentTtl - 1,
            currentPath: [...currentPath, chosenNeighbor],
            visited: newVisited,
          });

          // DIFERENCIAL: Também explora outros vizinhos não visitados
          // com probabilidade decrescente ou sempre (para ser exaustivo)
          for (let i = 0; i < unvisitedNeighbors.length; i++) {
            if (i === randomIndex) continue; // Já adicionamos esse

            const otherNeighbor = unvisitedNeighbors[i];
            totalMessages++;

            const otherVisited = new Set(visited);
            otherVisited.add(otherNeighbor);

            queue.push({
              nodeId: otherNeighbor,
              currentTtl: currentTtl - 1,
              currentPath: [...currentPath, otherNeighbor],
              visited: otherVisited,
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
      foundPath,
    );
  }
}
