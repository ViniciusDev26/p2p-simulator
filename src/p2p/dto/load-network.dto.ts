import { NetworkConfig } from '../../parsers/network-config.interface';

export class LoadNetworkDto implements NetworkConfig {
  num_nodes: number;
  min_neighbors: number;
  max_neighbors: number;
  resources: Record<string, string[]>;
  edges: string[][];
}
