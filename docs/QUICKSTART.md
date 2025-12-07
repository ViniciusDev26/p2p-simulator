# Guia Rápido de Início

## Setup em 3 Passos

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar a aplicação
```bash
npm run start:dev
```

### 3. Testar a API

#### Carregar uma rede
```bash
curl -X POST http://localhost:3000/p2p/network/load \
  -H "Content-Type: application/json" \
  -d @config/network-example.json
```

#### Executar uma busca
```bash
curl -X POST http://localhost:3000/p2p/search \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": "n1",
    "resource_id": "r15",
    "ttl": 10,
    "algo": "flooding"
  }'
```

## Testar Todos os Algoritmos

Use o script de teste automatizado:

```bash
./examples/test-algorithms.sh
```

## Estrutura Básica

### Entidades Principais

- **Node**: Nó da rede P2P
- **Network**: Rede completa
- **Resource**: Recurso armazenado em um nó
- **SearchResult**: Resultado de uma busca

### Algoritmos Disponíveis

1. `flooding` - Busca por inundação
2. `informed_flooding` - Busca por inundação com cache
3. `random_walk` - Passeio aleatório
4. `informed_random_walk` - Passeio aleatório com cache

### Endpoints da API

- `POST /p2p/network/load` - Carregar rede
- `GET /p2p/network/info` - Informações da rede
- `POST /p2p/search` - Buscar recurso
- `GET /p2p/algorithms` - Listar algoritmos

## Configuração de Rede

Arquivo JSON com:

```json
{
  "num_nodes": 12,
  "min_neighbors": 2,
  "max_neighbors": 4,
  "resources": {
    "n1": ["r1", "r2"],
    "n2": ["r3"]
  },
  "edges": [
    ["n1", "n2"]
  ]
}
```

## Validações Automáticas

- ✅ Conectividade (rede não particionada)
- ✅ Limites de vizinhos
- ✅ Recursos em todos os nós
- ✅ Sem self-loops

## Métricas de Comparação

Ao executar buscas, compare:

- **totalMessages**: Número de mensagens trocadas
- **totalNodesVisited**: Quantidade de nós visitados
- **found**: Se o recurso foi encontrado
- **path**: Caminho percorrido até encontrar

## Dicas

1. Use `flooding` para garantir encontrar o recurso
2. Use `random_walk` para economizar mensagens
3. Use versões `informed_*` para buscas repetidas
4. Ajuste o TTL conforme o tamanho da rede

## Próximos Passos

- Leia a [Documentação da API](./API_GUIDE.md)
- Entenda a [Arquitetura](./ARCHITECTURE.md)
- Veja o [README completo](./README.md)
