# Estrutura do Projeto

## Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│                    (P2P Controller)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│              (Network & Search Services)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼               ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  Algorithms  │ │Validators│ │   Parsers    │
│              │ │          │ │              │
│  - Flooding  │ │ Network  │ │    Config    │
│  - Informed  │ │Validator │ │   Parser     │
│  - Random    │ │          │ │              │
│    Walk      │ │          │ │              │
└──────────────┘ └──────────┘ └──────────────┘
        │              │               │
        └──────────────┼───────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│                    (Core Entities)                           │
│                                                              │
│  - Node: Nó da rede com vizinhos e recursos                 │
│  - Network: Grafo da rede P2P                               │
│  - Resource: Recursos armazenados                           │
│  - SearchResult: Resultado de buscas                        │
└─────────────────────────────────────────────────────────────┘
```

## Árvore de Diretórios Completa

```
p2p/
├── src/
│   ├── domain/                      # Camada de domínio
│   │   ├── entities/               # Entidades principais
│   │   │   ├── node.entity.ts      # Nó da rede
│   │   │   ├── network.entity.ts   # Rede P2P
│   │   │   ├── resource.entity.ts  # Recurso
│   │   │   ├── search-result.entity.ts
│   │   │   └── index.ts
│   │   └── interfaces/             # Contratos
│   │       └── search-algorithm.interface.ts
│   │
│   ├── algorithms/                 # Algoritmos de busca
│   │   ├── flooding.algorithm.ts
│   │   ├── informed-flooding.algorithm.ts
│   │   ├── random-walk.algorithm.ts
│   │   ├── informed-random-walk.algorithm.ts
│   │   └── index.ts
│   │
│   ├── validators/                 # Validadores
│   │   ├── network-validator.ts
│   │   └── index.ts
│   │
│   ├── parsers/                    # Parsers
│   │   ├── network-config.interface.ts
│   │   ├── network-config.parser.ts
│   │   └── index.ts
│   │
│   ├── services/                   # Serviços
│   │   ├── network.service.ts
│   │   ├── search.service.ts
│   │   └── index.ts
│   │
│   ├── p2p/                        # Módulo P2P
│   │   ├── dto/                    # Data Transfer Objects
│   │   │   ├── load-network.dto.ts
│   │   │   └── search-resource.dto.ts
│   │   ├── p2p.controller.ts       # Controller REST
│   │   └── p2p.module.ts           # Módulo NestJS
│   │
│   ├── app.module.ts               # Módulo principal
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                     # Entry point
│
├── config/                         # Configurações de rede
│   ├── network-example.json
│   └── network-small.json
│
├── examples/                       # Exemplos de uso
│   ├── test-algorithms.sh          # Script de teste
│   └── cli-example.ts              # Exemplo CLI
│
├── tests/                          # Testes
│   ├── unit/
│   └── integration/
│
├── ARCHITECTURE.md                 # Documentação arquitetural
├── API_GUIDE.md                    # Guia da API
├── QUICKSTART.md                   # Início rápido
├── STRUCTURE.md                    # Este arquivo
└── README.md                       # Documentação principal
```

## Fluxo de Dados

### 1. Carregamento de Rede

```
JSON Config
    │
    ▼
NetworkConfigParser
    │
    ▼
Network Entity
    │
    ▼
NetworkValidator
    │
    ▼
NetworkService
    │
    ▼
Stored in Memory
```

### 2. Execução de Busca

```
Search Request (DTO)
    │
    ▼
P2PController
    │
    ▼
SearchService
    │
    ├─► Flooding Algorithm
    ├─► Informed Flooding Algorithm
    ├─► Random Walk Algorithm
    └─► Informed Random Walk Algorithm
    │
    ▼
SearchResult
    │
    ▼
JSON Response
```

## Responsabilidades das Camadas

### Domain Layer (Domínio)
- Define entidades principais
- Regras de negócio puras
- Independente de frameworks
- **Responsabilidade**: Lógica de negócio central

### Algorithm Layer (Algoritmos)
- Implementa estratégias de busca
- Padrão Strategy
- Plugáveis e intercambiáveis
- **Responsabilidade**: Lógica de busca

### Validator Layer (Validadores)
- Valida regras de negócio
- Garante consistência da rede
- **Responsabilidade**: Garantia de qualidade

### Parser Layer (Parsers)
- Transforma dados externos em entidades
- Valida formato de entrada
- **Responsabilidade**: Conversão de dados

### Service Layer (Serviços)
- Orquestra operações
- Coordena diferentes componentes
- **Responsabilidade**: Lógica de aplicação

### Presentation Layer (P2P Module)
- Controllers REST
- DTOs para entrada/saída
- **Responsabilidade**: Interface com usuário

## Padrões de Design Utilizados

### 1. Strategy Pattern
```
ISearchAlgorithm (Interface)
    ├─ FloodingAlgorithm
    ├─ InformedFloodingAlgorithm
    ├─ RandomWalkAlgorithm
    └─ InformedRandomWalkAlgorithm
```

### 2. Dependency Injection
- Todos os serviços são injetáveis
- Facilita testes e manutenção

### 3. Repository Pattern (Implícito)
- NetworkService gerencia estado da rede
- Abstrai persistência em memória

### 4. Factory Pattern (Implícito)
- NetworkConfigParser cria entidades

## Princípios SOLID

| Princípio | Aplicação |
|-----------|-----------|
| **S**ingle Responsibility | Cada classe tem uma única responsabilidade |
| **O**pen/Closed | Novos algoritmos podem ser adicionados sem modificar código existente |
| **L**iskov Substitution | Todos os algoritmos implementam ISearchAlgorithm e são intercambiáveis |
| **I**nterface Segregation | Interfaces específicas e focadas |
| **D**ependency Inversion | Dependência em abstrações, não em implementações concretas |

## Extensibilidade

### Adicionar Novo Algoritmo

1. Criar classe em `src/algorithms/`
2. Implementar `ISearchAlgorithm`
3. Registrar em `SearchService`
4. Adicionar ao enum `SearchAlgorithmType`

### Adicionar Nova Validação

1. Adicionar método em `NetworkValidator`
2. Chamar no método `validate()`

### Adicionar Novo Endpoint

1. Adicionar método em `P2PController`
2. Criar DTO se necessário
3. Atualizar documentação da API

## Dependências Principais

- **NestJS**: Framework web
- **TypeScript**: Linguagem
- **Reflect-metadata**: Decorators
- **RxJS**: Programação reativa

## Testes

```
tests/
├── unit/                    # Testes unitários
│   ├── entities/           # Testes de entidades
│   ├── algorithms/         # Testes de algoritmos
│   ├── validators/         # Testes de validadores
│   └── services/           # Testes de serviços
│
└── integration/            # Testes de integração
    └── p2p/               # Testes do módulo P2P
```
