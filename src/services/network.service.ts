import { Injectable } from '@nestjs/common';
import { Network } from '../domain/entities/network.entity';
import { NetworkConfig } from '../parsers/network-config.interface';
import { NetworkConfigParser } from '../parsers/network-config.parser';
import {
  NetworkValidator,
  ValidationResult,
} from '../validators/network-validator';

@Injectable()
export class NetworkService {
  private network: Network | null = null;

  constructor(
    private readonly configParser: NetworkConfigParser,
    private readonly validator: NetworkValidator,
  ) {}

  loadNetwork(config: NetworkConfig): ValidationResult {
    this.network = this.configParser.parse(config);
    const validationResult = this.validator.validate(this.network);

    if (!validationResult.valid) {
      this.network = null;
    }

    return validationResult;
  }

  getNetwork(): Network {
    if (!this.network) {
      throw new Error(
        'Network not loaded. Please load a valid network configuration first.',
      );
    }
    return this.network;
  }

  hasNetwork(): boolean {
    return this.network !== null;
  }

  clearNetwork(): void {
    this.network = null;
  }

  getNetworkInfo(): {
    nodeCount: number;
    minNeighbors: number;
    maxNeighbors: number;
    totalResources: number;
  } | null {
    if (!this.network) {
      return null;
    }

    let totalResources = 0;
    for (const node of this.network.getNodes()) {
      totalResources += node.getResourceCount();
    }

    return {
      nodeCount: this.network.getNodeCount(),
      minNeighbors: this.network.minNeighbors,
      maxNeighbors: this.network.maxNeighbors,
      totalResources,
    };
  }
}
