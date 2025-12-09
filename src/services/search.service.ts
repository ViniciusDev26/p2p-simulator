import { Injectable } from '@nestjs/common';
import { Network } from '../domain/entities/network.entity';
import { SearchResult } from '../domain/entities/search-result.entity';
import {
  ISearchAlgorithm,
  SearchParams,
  SearchAlgorithmType,
} from '../domain/interfaces/search-algorithm.interface';
import { FloodingAlgorithm } from '../algorithms/flooding.algorithm';
import { InformedFloodingAlgorithm } from '../algorithms/informed-flooding.algorithm';
import { RandomWalkAlgorithm } from '../algorithms/random-walk.algorithm';
import { InformedRandomWalkAlgorithm } from '../algorithms/informed-random-walk.algorithm';
import { ExhaustiveRandomWalkAlgorithm } from '../algorithms/exhaustive-random-walk.algorithm';

@Injectable()
export class SearchService {
  private algorithms: Map<SearchAlgorithmType, ISearchAlgorithm>;

  constructor(
    private readonly floodingAlgorithm: FloodingAlgorithm,
    private readonly informedFloodingAlgorithm: InformedFloodingAlgorithm,
    private readonly randomWalkAlgorithm: RandomWalkAlgorithm,
    private readonly informedRandomWalkAlgorithm: InformedRandomWalkAlgorithm,
    private readonly exhaustiveRandomWalkAlgorithm: ExhaustiveRandomWalkAlgorithm,
  ) {
    this.algorithms = new Map([
      [SearchAlgorithmType.FLOODING, this.floodingAlgorithm],
      [SearchAlgorithmType.INFORMED_FLOODING, this.informedFloodingAlgorithm],
      [SearchAlgorithmType.RANDOM_WALK, this.randomWalkAlgorithm],
      [
        SearchAlgorithmType.INFORMED_RANDOM_WALK,
        this.informedRandomWalkAlgorithm,
      ],
      [
        SearchAlgorithmType.EXHAUSTIVE_RANDOM_WALK,
        this.exhaustiveRandomWalkAlgorithm,
      ],
    ]);
  }

  search(
    network: Network,
    params: SearchParams,
    algorithmType: SearchAlgorithmType,
  ): SearchResult {
    const algorithm = this.algorithms.get(algorithmType);

    if (!algorithm) {
      throw new Error(`Unknown algorithm type: ${algorithmType}`);
    }

    return algorithm.search(network, params);
  }

  getAvailableAlgorithms(): string[] {
    return Array.from(this.algorithms.keys());
  }
}
