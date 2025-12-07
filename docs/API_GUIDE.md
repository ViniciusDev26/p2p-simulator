# Guia da API P2P

## Endpoints

### 1. Carregar Rede

**Endpoint:** `POST /p2p/network/load`

**Descrição:** Carrega e valida uma configuração de rede P2P.

**Request Body:**
```json
{
  "num_nodes": 12,
  "min_neighbors": 2,
  "max_neighbors": 4,
  "resources": {
    "n1": ["r1", "r2", "r3"],
    "n2": ["r4", "r5"],
    "n3": ["r6", "r7", "r8"]
  },
  "edges": [
    ["n1", "n2"],
    ["n1", "n3"],
    ["n2", "n3"]
  ]
}
```

**Response (Sucesso):**
```json
{
  "message": "Network loaded successfully",
  "info": {
    "nodeCount": 12,
    "minNeighbors": 2,
    "maxNeighbors": 4,
    "totalResources": 26
  }
}
```

**Response (Erro):**
```json
{
  "message": "Network validation failed",
  "errors": [
    "Network is partitioned: only 5 of 12 nodes are reachable",
    "Node n1 has 1 neighbors, but minimum is 2"
  ]
}
```

### 2. Obter Informações da Rede

**Endpoint:** `GET /p2p/network/info`

**Descrição:** Retorna informações sobre a rede carregada.

**Response:**
```json
{
  "nodeCount": 12,
  "minNeighbors": 2,
  "maxNeighbors": 4,
  "totalResources": 26
}
```

### 3. Buscar Recurso

**Endpoint:** `POST /p2p/search`

**Descrição:** Executa busca por um recurso usando algoritmo especificado.

**Request Body:**
```json
{
  "node_id": "n1",
  "resource_id": "r15",
  "ttl": 10,
  "algo": "flooding"
}
```

**Algoritmos Disponíveis:**
- `flooding` - Busca por inundação
- `informed_flooding` - Busca por inundação informada (com cache)
- `random_walk` - Busca por passeio aleatório
- `informed_random_walk` - Busca por passeio aleatório informada (com cache)

**Response (Recurso Encontrado):**
```json
{
  "algorithm": "flooding",
  "result": {
    "resourceId": "r15",
    "found": true,
    "locationNodeId": "n7",
    "totalMessages": 23,
    "totalNodesVisited": 12,
    "visitedNodes": ["n1", "n2", "n3", "n4", "n5", "n6", "n7", ...],
    "path": ["n1", "n3", "n7"]
  }
}
```

**Response (Recurso Não Encontrado):**
```json
{
  "algorithm": "random_walk",
  "result": {
    "resourceId": "r99",
    "found": false,
    "locationNodeId": null,
    "totalMessages": 10,
    "totalNodesVisited": 11,
    "visitedNodes": ["n1", "n2", "n5", "n8", ...],
    "path": ["n1", "n2", "n5", "n8"]
  }
}
```

### 4. Listar Algoritmos

**Endpoint:** `GET /p2p/algorithms`

**Descrição:** Lista todos os algoritmos de busca disponíveis.

**Response:**
```json
{
  "algorithms": [
    "flooding",
    "informed_flooding",
    "random_walk",
    "informed_random_walk"
  ]
}
```

## Exemplos de Uso com cURL

### Carregar uma rede
```bash
curl -X POST http://localhost:3000/p2p/network/load \
  -H "Content-Type: application/json" \
  -d @config/network-example.json
```

### Buscar um recurso
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

### Obter informações da rede
```bash
curl http://localhost:3000/p2p/network/info
```

### Listar algoritmos
```bash
curl http://localhost:3000/p2p/algorithms
```

## Comparação de Algoritmos

Para comparar os algoritmos, execute a mesma busca com diferentes algoritmos:

```bash
# Flooding
curl -X POST http://localhost:3000/p2p/search \
  -H "Content-Type: application/json" \
  -d '{"node_id": "n1", "resource_id": "r15", "ttl": 10, "algo": "flooding"}'

# Informed Flooding
curl -X POST http://localhost:3000/p2p/search \
  -H "Content-Type: application/json" \
  -d '{"node_id": "n1", "resource_id": "r15", "ttl": 10, "algo": "informed_flooding"}'

# Random Walk
curl -X POST http://localhost:3000/p2p/search \
  -H "Content-Type: application/json" \
  -d '{"node_id": "n1", "resource_id": "r15", "ttl": 10, "algo": "random_walk"}'

# Informed Random Walk
curl -X POST http://localhost:3000/p2p/search \
  -H "Content-Type: application/json" \
  -d '{"node_id": "n1", "resource_id": "r15", "ttl": 10, "algo": "informed_random_walk"}'
```

Compare os resultados observando:
- `totalMessages`: Número total de mensagens trocadas
- `totalNodesVisited`: Número de nós visitados
- Eficiência: Relação entre mensagens enviadas e sucesso na busca
