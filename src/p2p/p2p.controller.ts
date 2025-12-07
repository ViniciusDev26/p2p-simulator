import { Body, Controller, Get, Post, HttpException, HttpStatus } from '@nestjs/common';
import { NetworkService } from '../services/network.service';
import { SearchService } from '../services/search.service';
import { LoadNetworkDto } from './dto/load-network.dto';
import { SearchResourceDto } from './dto/search-resource.dto';

@Controller('p2p')
export class P2PController {
  constructor(
    private readonly networkService: NetworkService,
    private readonly searchService: SearchService,
  ) {}

  @Post('network/load')
  loadNetwork(@Body() loadNetworkDto: LoadNetworkDto) {
    try {
      const validationResult = this.networkService.loadNetwork(loadNetworkDto);

      if (!validationResult.valid) {
        throw new HttpException(
          {
            message: 'Network validation failed',
            errors: validationResult.errors,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: 'Network loaded successfully',
        info: this.networkService.getNetworkInfo(),
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to load network',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('network/info')
  getNetworkInfo() {
    const info = this.networkService.getNetworkInfo();

    if (!info) {
      throw new HttpException(
        {
          message: 'No network loaded',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return info;
  }

  @Post('search')
  searchResource(@Body() searchDto: SearchResourceDto) {
    if (!this.networkService.hasNetwork()) {
      throw new HttpException(
        {
          message: 'No network loaded. Please load a network first.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const network = this.networkService.getNetwork();
      const result = this.searchService.search(
        network,
        {
          nodeId: searchDto.node_id,
          resourceId: searchDto.resource_id,
          ttl: searchDto.ttl,
        },
        searchDto.algo,
      );

      return {
        algorithm: searchDto.algo,
        result: result.toJSON(),
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Search failed',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('algorithms')
  getAvailableAlgorithms() {
    return {
      algorithms: this.searchService.getAvailableAlgorithms(),
    };
  }

  @Get('network/graph')
  getNetworkGraph() {
    if (!this.networkService.hasNetwork()) {
      throw new HttpException(
        {
          message: 'No network loaded',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const network = this.networkService.getNetwork();
    const nodes = network.getNodes();

    const graphNodes = nodes.map((node) => ({
      id: node.id,
      resources: node.getResources().map((r) => r.id),
      neighbors: node.getNeighbors().length,
    }));

    const graphLinks: Array<{ source: string; target: string }> = [];
    const processed = new Set<string>();

    nodes.forEach((node) => {
      node.getNeighbors().forEach((neighborId) => {
        const linkId = [node.id, neighborId].sort().join('-');
        if (!processed.has(linkId)) {
          graphLinks.push({
            source: node.id,
            target: neighborId,
          });
          processed.add(linkId);
        }
      });
    });

    return {
      nodes: graphNodes,
      links: graphLinks,
    };
  }
}
