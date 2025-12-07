# Arquitetura da Aplicação P2P

## Visão Geral

Esta aplicação implementa um simulador de rede P2P não estruturada com diferentes algoritmos de busca de recursos. A arquitetura segue os princípios de Clean Architecture e Domain-Driven Design (DDD).

## Estrutura de Diretórios

```
src/
├── domain/              # Camada de domínio (entidades e interfaces)
│   ├── entities/       # Entidades do domínio
│   │   ├── node.entity.ts
│   │   ├── network.entity.ts
│   │   ├── resource.entity.ts
│   │   └── search-result.entity.ts
│   └── interfaces/     # Interfaces de contratos
│       └── search-algorithm.interface.ts
│
├── algorithms/         # Implementações dos algoritmos de busca
│   ├── flooding.algorithm.ts
│   ├── informed-flooding.algorithm.ts
│   ├── random-walk.algorithm.ts
│   └── informed-random-walk.algorithm.ts
│
├── validators/         # Validadores de regras de negócio
│   └── network-validator.ts
│
├── parsers/           # Parsers de configuração
│   ├── network-config.interface.ts
│   └── network-config.parser.ts
│
├── services/          # Camada de serviços
│   ├── network.service.ts
│   └── search.service.ts
│
└── p2p/              # Módulo de apresentação (API REST)
    ├── p2p.module.ts
    ├── p2p.controller.ts
    └── dto/
        ├── load-network.dto.ts
        └── search-resource.dto.ts
```

## Camadas da Aplicação

### 1. Domain (Domínio)

A camada de domínio contém as entidades principais e as interfaces que definem os contratos:

#### Entidades:

- **Node**: Representa um nó na rede P2P
  - Mantém lista de vizinhos
  - Armazena recursos locais
  - Implementa cache local para busca informada

- **Network**: Representa a rede P2P completa
  - Gerencia todos os nós
  - Valida limites de vizinhos
  - Fornece operações de grafo

- **Resource**: Representa um recurso armazenado em um nó

- **SearchResult**: Encapsula o resultado de uma operação de busca

#### Interfaces:

- **ISearchAlgorithm**: Interface que define o contrato para algoritmos de busca
- **SearchParams**: Parâmetros de entrada para busca

### 2. Algorithms (Algoritmos)

Implementações dos diferentes algoritmos de busca:

#### Flooding
- Propaga a requisição para todos os vizinhos
- Usa BFS (Breadth-First Search)
- Respeita o TTL (Time To Live)

#### Informed Flooding
- Similar ao Flooding, mas com cache local
- Verifica cache antes de propagar
- Atualiza cache ao encontrar recurso

#### Random Walk
- Escolhe um vizinho aleatório não visitado
- Continua até encontrar ou TTL expirar
- Menos mensagens, mas pode ser mais lento

#### Informed Random Walk
- Similar ao Random Walk com cache
- Usa informação local para acelerar buscas

### 3. Validators (Validadores)

**NetworkValidator**: Valida as regras de negócio da rede:
- Rede não pode estar particionada
- Limites de vizinhos devem ser respeitados
- Todos os nós devem ter recursos
- Não pode haver self-loops

### 4. Parsers

**NetworkConfigParser**: Transforma configuração JSON em entidades de domínio

### 5. Services (Serviços)

#### NetworkService
- Gerencia o ciclo de vida da rede
- Coordena validação e parsing
- Fornece informações sobre a rede

#### SearchService
- Coordena a execução de buscas
- Seleciona o algoritmo apropriado
- Retorna resultados formatados

### 6. P2P Module (Apresentação)

**P2PController**: API REST que expõe as funcionalidades:
- POST `/p2p/network/load` - Carrega configuração da rede
- GET `/p2p/network/info` - Informações sobre a rede
- POST `/p2p/search` - Executa busca por recurso
- GET `/p2p/algorithms` - Lista algoritmos disponíveis

## Fluxo de Dados

### Carregamento da Rede

```
Config JSON → NetworkConfigParser → Network Entity → NetworkValidator → NetworkService
```

### Busca de Recursos

```
SearchDTO → SearchService → Algorithm Selection → ISearchAlgorithm → SearchResult
```

## Princípios Aplicados

### Clean Architecture
- Separação clara entre domínio, aplicação e infraestrutura
- Dependências apontam para dentro (domínio é independente)
- Regras de negócio isoladas na camada de domínio

### Domain-Driven Design (DDD)
- Entidades ricas com comportamento
- Linguagem ubíqua (Node, Network, Resource)
- Agregados bem definidos

### SOLID
- **S**ingle Responsibility: Cada classe tem uma responsabilidade única
- **O**pen/Closed: Novos algoritmos podem ser adicionados sem modificar código existente
- **L**iskov Substitution: Todos os algoritmos implementam ISearchAlgorithm
- **I**nterface Segregation: Interfaces específicas e focadas
- **D**ependency Inversion: Dependência em abstrações (ISearchAlgorithm)

## Extensibilidade

### Adicionar Novo Algoritmo

1. Criar nova classe implementando `ISearchAlgorithm`
2. Registrar no `SearchService`
3. Adicionar ao enum `SearchAlgorithmType`

### Adicionar Novo Validador

1. Criar método no `NetworkValidator`
2. Chamar no método `validate()`

### Adicionar Novo Formato de Config

1. Criar novo parser implementando interface comum
2. Injetar no `NetworkService`
