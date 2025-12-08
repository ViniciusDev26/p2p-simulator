export interface NetworkConfig {
  num_nodes: number;
  min_neighbors: number;
  max_neighbors: number;
  resources: Record<string, string[]>;
  edges: string[][];
}

export interface SearchConfig {
  node_id: string;
  resource_id: string;
  ttl: number;
  algo:
    | 'flooding'
    | 'informed_flooding'
    | 'random_walk'
    | 'informed_random_walk';
}
