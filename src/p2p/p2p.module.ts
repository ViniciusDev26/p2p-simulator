import { Module } from '@nestjs/common';
import { P2PController } from './p2p.controller';
import { NetworkService } from '../services/network.service';
import { SearchService } from '../services/search.service';
import { PathAnalyzerService } from '../services/path-analyzer.service';
import { NetworkConfigParser } from '../parsers/network-config.parser';
import { NetworkValidator } from '../validators/network-validator';
import { FloodingAlgorithm } from '../algorithms/flooding.algorithm';
import { InformedFloodingAlgorithm } from '../algorithms/informed-flooding.algorithm';
import { RandomWalkAlgorithm } from '../algorithms/random-walk.algorithm';
import { InformedRandomWalkAlgorithm } from '../algorithms/informed-random-walk.algorithm';
import { ExhaustiveRandomWalkAlgorithm } from '../algorithms/exhaustive-random-walk.algorithm';

@Module({
  controllers: [P2PController],
  providers: [
    NetworkService,
    SearchService,
    PathAnalyzerService,
    NetworkConfigParser,
    NetworkValidator,
    FloodingAlgorithm,
    InformedFloodingAlgorithm,
    RandomWalkAlgorithm,
    InformedRandomWalkAlgorithm,
    ExhaustiveRandomWalkAlgorithm,
  ],
  exports: [NetworkService, SearchService, PathAnalyzerService],
})
export class P2PModule {}
