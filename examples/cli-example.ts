import { Network, Node, Resource } from '../src/domain/entities';
import { NetworkConfigParser } from '../src/parsers/network-config.parser';
import { NetworkValidator } from '../src/validators/network-validator';
import {
  FloodingAlgorithm,
  InformedFloodingAlgorithm,
  RandomWalkAlgorithm,
  InformedRandomWalkAlgorithm,
} from '../src/algorithms';
import { NetworkConfig } from '../src/parsers/network-config.interface';
import { SearchAlgorithmType } from '../src/domain/interfaces/search-algorithm.interface';

const exampleConfig: NetworkConfig = {
  num_nodes: 12,
  min_neighbors: 2,
  max_neighbors: 4,
  resources: {
    n1: ['r1', 'r2', 'r3'],
    n2: ['r4', 'r5'],
    n3: ['r6', 'r7', 'r8'],
    n4: ['r9'],
    n5: ['r10', 'r11'],
    n6: ['r12', 'r13', 'r14'],
    n7: ['r15'],
    n8: ['r16', 'r17'],
    n9: ['r18', 'r19', 'r20'],
    n10: ['r21'],
    n11: ['r22', 'r23'],
    n12: ['r24', 'r25', 'r26'],
  },
  edges: [
    ['n1', 'n2'],
    ['n1', 'n3'],
    ['n1', 'n4'],
    ['n2', 'n4'],
    ['n2', 'n5'],
    ['n3', 'n6'],
    ['n3', 'n7'],
    ['n4', 'n8'],
    ['n5', 'n8'],
    ['n5', 'n9'],
    ['n6', 'n10'],
    ['n7', 'n10'],
    ['n7', 'n11'],
    ['n8', 'n12'],
    ['n9', 'n12'],
    ['n10', 'n11'],
    ['n11', 'n12'],
  ],
};

function main() {
  console.log('=================================');
  console.log('  Exemplo de Uso - CLI P2P');
  console.log('=================================\n');

  const parser = new NetworkConfigParser();
  const validator = new NetworkValidator();

  console.log('1. Carregando e validando a rede...');
  const network = parser.parse(exampleConfig);

  const validationResult = validator.validate(network);
  if (!validationResult.valid) {
    console.error('❌ Erro na validação da rede:');
    validationResult.errors.forEach((error) => console.error(`  - ${error}`));
    return;
  }
  console.log('✅ Rede carregada e validada com sucesso\n');

  console.log('2. Informações da rede:');
  console.log(`   - Nós: ${network.getNodeCount()}`);
  console.log(`   - Min vizinhos: ${network.minNeighbors}`);
  console.log(`   - Max vizinhos: ${network.maxNeighbors}\n`);

  const algorithms = {
    flooding: new FloodingAlgorithm(),
    informed_flooding: new InformedFloodingAlgorithm(),
    random_walk: new RandomWalkAlgorithm(),
    informed_random_walk: new InformedRandomWalkAlgorithm(),
  };

  const searchParams = {
    nodeId: 'n1',
    resourceId: 'r15',
    ttl: 10,
  };

  console.log('3. Executando buscas...');
  console.log(`   Buscando '${searchParams.resourceId}' a partir de '${searchParams.nodeId}'\n`);

  console.log('┌─────────────────────────┬────────────┬───────────┬───────────────┐');
  console.log('│ Algoritmo               │ Encontrado │ Mensagens │ Nós Visitados │');
  console.log('├─────────────────────────┼────────────┼───────────┼───────────────┤');

  Object.entries(algorithms).forEach(([name, algorithm]) => {
    const result = algorithm.search(network, searchParams);

    const foundSymbol = result.found ? '✓' : '✗';
    const paddedName = name.padEnd(23);
    const paddedFound = foundSymbol.padEnd(10);
    const paddedMessages = result.totalMessages.toString().padEnd(9);
    const paddedNodes = result.totalNodesVisited.toString().padEnd(13);

    console.log(`│ ${paddedName} │ ${paddedFound} │ ${paddedMessages} │ ${paddedNodes} │`);
  });

  console.log('└─────────────────────────┴────────────┴───────────┴───────────────┘\n');

  console.log('4. Detalhes da busca com Flooding:');
  const floodingResult = algorithms.flooding.search(network, searchParams);
  console.log(`   - Recurso encontrado: ${floodingResult.found ? 'Sim' : 'Não'}`);
  console.log(`   - Localização: ${floodingResult.locationNodeId || 'N/A'}`);
  console.log(`   - Total de mensagens: ${floodingResult.totalMessages}`);
  console.log(`   - Nós visitados: ${floodingResult.totalNodesVisited}`);
  console.log(`   - Caminho: ${floodingResult.path.join(' → ')}\n`);

  console.log('5. Testando cache com Informed Flooding:');
  console.log('   Executando primeira busca...');
  const informed1 = algorithms.informed_flooding.search(network, searchParams);
  console.log(`   - Mensagens: ${informed1.totalMessages}`);

  console.log('   Executando segunda busca (deve usar cache)...');
  const informed2 = algorithms.informed_flooding.search(network, searchParams);
  console.log(`   - Mensagens: ${informed2.totalMessages}`);
  console.log(`   - Redução: ${informed1.totalMessages - informed2.totalMessages} mensagens\n`);

  console.log('✅ Exemplo concluído!');
}

main();
