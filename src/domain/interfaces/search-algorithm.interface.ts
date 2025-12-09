import { Network } from '../entities/network.entity';
import { SearchResult } from '../entities/search-result.entity';

export interface SearchParams {
  nodeId: string;
  resourceId: string;
  ttl: number;
}

export interface ISearchAlgorithm {
  search(network: Network, params: SearchParams): SearchResult;
  getName(): string;
}

export enum SearchAlgorithmType {
  FLOODING = 'flooding',
  INFORMED_FLOODING = 'informed_flooding',
  RANDOM_WALK = 'random_walk',
  INFORMED_RANDOM_WALK = 'informed_random_walk',
  EXHAUSTIVE_RANDOM_WALK = 'exhaustive_random_walk',
}
