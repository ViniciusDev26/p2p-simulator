import { Injectable } from '@nestjs/common';
import { Network } from '../domain/entities/network.entity';

export interface PathInfo {
  path: string[];
  length: number;
  probability: number;
}

export interface PathAnalysisResult {
  origin: string;
  destination: string;
  shortestDistance: number;
  allPaths: PathInfo[];
  bestCase: PathInfo;
  worstCase: PathInfo;
  totalPaths: number;
}

@Injectable()
export class PathAnalyzerService {
  /**
   * Encontra todos os caminhos entre dois nós até um TTL máximo
   */
  findAllPaths(
    network: Network,
    origin: string,
    destination: string,
    maxTtl: number,
  ): string[][] {
    const allPaths: string[][] = [];
    const visited = new Set<string>();

    const dfs = (currentNode: string, path: string[]) => {
      if (path.length > maxTtl + 1) {
        return;
      }

      if (currentNode === destination) {
        allPaths.push([...path]);
        return;
      }

      visited.add(currentNode);

      const node = network.getNode(currentNode);
      if (!node) return;

      const neighbors = node.getNeighbors();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path, neighbor]);
        }
      }

      visited.delete(currentNode);
    };

    dfs(origin, [origin]);
    return allPaths;
  }

  /**
   * Calcula a menor distância entre dois nós (BFS)
   */
  findShortestDistance(
    network: Network,
    origin: string,
    destination: string,
  ): number {
    if (origin === destination) return 0;

    const queue: Array<{ node: string; distance: number }> = [
      { node: origin, distance: 0 },
    ];
    const visited = new Set<string>();
    visited.add(origin);

    while (queue.length > 0) {
      const { node: currentNode, distance } = queue.shift()!;

      const node = network.getNode(currentNode);
      if (!node) continue;

      const neighbors = node.getNeighbors();
      for (const neighbor of neighbors) {
        if (neighbor === destination) {
          return distance + 1;
        }

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ node: neighbor, distance: distance + 1 });
        }
      }
    }

    return -1; // Não encontrado
  }

  /**
   * Calcula a probabilidade de um caminho específico no Random Walk
   */
  calculatePathProbability(network: Network, path: string[]): number {
    if (path.length <= 1) return 1;

    let probability = 1;

    for (let i = 0; i < path.length - 1; i++) {
      const currentNodeId = path[i];
      const nextNodeId = path[i + 1];

      const currentNode = network.getNode(currentNodeId);
      if (!currentNode) return 0;

      const neighbors = currentNode.getNeighbors();
      const unvisitedNeighbors = neighbors.filter(
        (n) => !path.slice(0, i + 1).includes(n),
      );

      if (unvisitedNeighbors.length === 0) return 0;

      // Probabilidade de escolher o próximo nó entre os não visitados
      const pChoice = 1 / unvisitedNeighbors.length;

      // Verificar se o próximo nó está nos não visitados
      if (!unvisitedNeighbors.includes(nextNodeId)) {
        return 0; // Caminho inválido
      }

      probability *= pChoice;
    }

    return probability;
  }

  /**
   * Análise completa de caminhos entre dois nós
   */
  analyzePaths(
    network: Network,
    origin: string,
    destination: string,
    ttl: number,
  ): PathAnalysisResult {
    // Encontrar menor distância
    const shortestDistance = this.findShortestDistance(
      network,
      origin,
      destination,
    );

    if (shortestDistance === -1) {
      throw new Error(
        `No path found between ${origin} and ${destination}`,
      );
    }

    // Encontrar todos os caminhos possíveis
    const allPathsRaw = this.findAllPaths(network, origin, destination, ttl);

    // Calcular probabilidades
    const allPaths: PathInfo[] = allPathsRaw.map((path) => ({
      path,
      length: path.length - 1, // número de saltos
      probability: this.calculatePathProbability(network, path),
    }));

    // Ordenar por comprimento
    allPaths.sort((a, b) => a.length - b.length);

    // Identificar melhor e pior caso
    const pathsWithinTTL = allPaths.filter((p) => p.length <= ttl);

    if (pathsWithinTTL.length === 0) {
      throw new Error(`No paths found within TTL ${ttl}`);
    }

    const bestCase = pathsWithinTTL[0]; // Caminho mais curto
    const worstCase = pathsWithinTTL[pathsWithinTTL.length - 1]; // Caminho mais longo

    return {
      origin,
      destination,
      shortestDistance,
      allPaths: pathsWithinTTL,
      bestCase,
      worstCase,
      totalPaths: pathsWithinTTL.length,
    };
  }

  /**
   * Sugere pares de nós com distância específica
   */
  findNodePairsWithDistance(
    network: Network,
    targetDistance: number,
  ): Array<{ origin: string; destination: string; distance: number }> {
    const pairs: Array<{
      origin: string;
      destination: string;
      distance: number;
    }> = [];
    const nodes = network.getNodes();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const origin = nodes[i].id;
        const destination = nodes[j].id;
        const distance = this.findShortestDistance(
          network,
          origin,
          destination,
        );

        if (distance === targetDistance) {
          pairs.push({ origin, destination, distance });
        }
      }
    }

    return pairs;
  }
}
