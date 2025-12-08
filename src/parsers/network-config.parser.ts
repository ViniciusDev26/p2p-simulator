import { Injectable } from '@nestjs/common';
import { Network, Node, Resource } from '../domain/entities';
import { NetworkConfig } from './network-config.interface';

@Injectable()
export class NetworkConfigParser {
  parse(config: NetworkConfig): Network {
    this.validateConfig(config);

    const network = new Network(config.min_neighbors, config.max_neighbors);

    for (let i = 1; i <= config.num_nodes; i++) {
      const nodeId = `n${i}`;
      const node = new Node(nodeId);
      network.addNode(node);
    }

    for (const [nodeId, resourceIds] of Object.entries(config.resources)) {
      const node = network.getNode(nodeId);
      if (!node) {
        throw new Error(`Node ${nodeId} not found when adding resources`);
      }

      for (const resourceId of resourceIds) {
        const resource = new Resource(resourceId, nodeId);
        node.addResource(resource);
      }
    }

    for (const [nodeId1, nodeId2] of config.edges) {
      network.addEdge(nodeId1, nodeId2);
    }

    return network;
  }

  private validateConfig(config: NetworkConfig): void {
    if (!config.num_nodes || config.num_nodes <= 0) {
      throw new Error('num_nodes must be a positive integer');
    }

    if (config.min_neighbors < 0) {
      throw new Error('min_neighbors must be non-negative');
    }

    if (config.max_neighbors < config.min_neighbors) {
      throw new Error(
        'max_neighbors must be greater than or equal to min_neighbors',
      );
    }

    if (!config.resources || Object.keys(config.resources).length === 0) {
      throw new Error('resources must be defined and non-empty');
    }

    if (!config.edges || !Array.isArray(config.edges)) {
      throw new Error('edges must be defined and be an array');
    }

    for (const edge of config.edges) {
      if (!Array.isArray(edge) || edge.length !== 2) {
        throw new Error('Each edge must be an array of exactly 2 node IDs');
      }

      const [node1, node2] = edge;
      if (node1 === node2) {
        throw new Error(`Self-loop detected: edge from ${node1} to itself`);
      }
    }

    for (const nodeId of Object.keys(config.resources)) {
      const nodeNumber = parseInt(nodeId.substring(1));
      if (
        isNaN(nodeNumber) ||
        nodeNumber < 1 ||
        nodeNumber > config.num_nodes
      ) {
        throw new Error(
          `Invalid node ID in resources: ${nodeId}. Must be between n1 and n${config.num_nodes}`,
        );
      }
    }

    for (const edge of config.edges) {
      for (const nodeId of edge) {
        const nodeNumber = parseInt(nodeId.substring(1));
        if (
          isNaN(nodeNumber) ||
          nodeNumber < 1 ||
          nodeNumber > config.num_nodes
        ) {
          throw new Error(
            `Invalid node ID in edges: ${nodeId}. Must be between n1 and n${config.num_nodes}`,
          );
        }
      }
    }
  }
}
