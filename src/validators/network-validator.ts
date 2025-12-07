import { Injectable } from '@nestjs/common';
import { Network } from '../domain/entities/network.entity';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

@Injectable()
export class NetworkValidator {
  validate(network: Network): ValidationResult {
    const errors: string[] = [];

    const partitionedError = this.validateNotPartitioned(network);
    if (partitionedError) {
      errors.push(partitionedError);
    }

    const neighborErrors = this.validateNeighborLimits(network);
    errors.push(...neighborErrors);

    const resourceErrors = this.validateAllNodesHaveResources(network);
    errors.push(...resourceErrors);

    const selfLoopErrors = this.validateNoSelfLoops(network);
    errors.push(...selfLoopErrors);

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateNotPartitioned(network: Network): string | null {
    const nodes = network.getNodes();
    if (nodes.length === 0) {
      return 'Network has no nodes';
    }

    if (nodes.length === 1) {
      return null;
    }

    const visited = new Set<string>();
    const queue: string[] = [nodes[0].id];

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      if (visited.has(currentNodeId)) {
        continue;
      }

      visited.add(currentNodeId);
      const currentNode = network.getNode(currentNodeId);

      if (currentNode) {
        const neighbors = currentNode.getNeighbors();
        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            queue.push(neighborId);
          }
        }
      }
    }

    if (visited.size !== nodes.length) {
      return `Network is partitioned: only ${visited.size} of ${nodes.length} nodes are reachable`;
    }

    return null;
  }

  private validateNeighborLimits(network: Network): string[] {
    const errors: string[] = [];
    const nodes = network.getNodes();

    for (const node of nodes) {
      const neighborCount = node.getNeighborCount();

      if (neighborCount < network.minNeighbors) {
        errors.push(
          `Node ${node.id} has ${neighborCount} neighbors, but minimum is ${network.minNeighbors}`,
        );
      }

      if (neighborCount > network.maxNeighbors) {
        errors.push(
          `Node ${node.id} has ${neighborCount} neighbors, but maximum is ${network.maxNeighbors}`,
        );
      }
    }

    return errors;
  }

  private validateAllNodesHaveResources(network: Network): string[] {
    const errors: string[] = [];
    const nodes = network.getNodes();

    for (const node of nodes) {
      if (node.getResourceCount() === 0) {
        errors.push(`Node ${node.id} has no resources`);
      }
    }

    return errors;
  }

  private validateNoSelfLoops(network: Network): string[] {
    const errors: string[] = [];
    const nodes = network.getNodes();

    for (const node of nodes) {
      if (node.hasNeighbor(node.id)) {
        errors.push(`Node ${node.id} has a self-loop`);
      }
    }

    return errors;
  }
}
