import { SearchAlgorithmType } from '../../domain/interfaces/search-algorithm.interface';

export class SearchResourceDto {
  node_id: string;
  resource_id: string;
  ttl: number;
  algo: SearchAlgorithmType;
}
