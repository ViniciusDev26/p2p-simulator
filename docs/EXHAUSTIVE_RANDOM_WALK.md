# Exhaustive Random Walk - Documentação

## 📋 Descrição

O **Exhaustive Random Walk** é um algoritmo híbrido que combina características do Random Walk tradicional com a exploração exaustiva do Flooding.

## 🎯 Conceito

Ao contrário do Random Walk tradicional que:
- Escolhe **um único vizinho aleatório** por passo
- Segue **apenas um caminho** até encontrar ou TTL acabar

O Exhaustive Random Walk:
- **Explora TODOS os vizinhos** não visitados em cada nó
- Cria **múltiplas caminhadas paralelas**
- Continua até encontrar o recurso ou esgotar o TTL em todos os caminhos

## 🔄 Como Funciona

### Algoritmo Passo a Passo:

1. **Inicialização**
   - Começa no nó origem
   - Cria uma queue de caminhos a explorar
   - Cada item na queue representa um caminho independente

2. **Loop Principal**
   ```
   Enquanto (queue não vazia E recurso não encontrado):
     - Remove próximo caminho da queue
     - Visita o nó atual do caminho
     - Verifica se tem o recurso
     - Se sim: PARA e retorna sucesso ✅
     - Se não E TTL > 0:
       - Pega TODOS os vizinhos não visitados neste caminho
       - Para CADA vizinho:
         - Cria um NOVO caminho adicionando este vizinho
         - Adiciona novo caminho na queue
   ```

3. **Características Importantes**
   - Cada caminho mantém seu próprio **histórico de visitados**
   - Um nó pode ser visitado em **caminhos diferentes**
   - Para no **primeiro** recurso encontrado

## 📊 Comparação com Outros Algoritmos

| Algoritmo | Exploração | Caminhos | Mensagens | Garantia |
|---|---|---|---|---|
| **Flooding** | BFS completo | Todos simultâneos | Muitas | Caminho mínimo |
| **Random Walk** | Um vizinho aleatório | Um único | Poucas | Nenhuma |
| **Exhaustive RW** | Todos os vizinhos | Múltiplos paralelos | Intermediário | Encontra se existir |

## 💻 Implementação

### Estrutura da Queue

```typescript
{
  nodeId: string;           // Nó atual
  currentTtl: number;       // TTL restante
  currentPath: string[];    // Caminho percorrido
  visited: Set<string>;     // Nós visitados NESTE caminho
}
```

### Diferencial Principal

```typescript
// Random Walk tradicional:
const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
const chosenNeighbor = unvisitedNeighbors[randomIndex];
// Explora APENAS chosenNeighbor

// Exhaustive Random Walk:
for (const neighbor of unvisitedNeighbors) {
  queue.push({
    nodeId: neighbor,
    currentTtl: currentTtl - 1,
    currentPath: [...currentPath, neighbor],
    visited: new Set([...visited, neighbor])
  });
}
// Explora TODOS os vizinhos não visitados
```

## 🧪 Exemplo de Execução

### Rede de Exemplo:
```
    n1 --- n2 --- n5 (tem r5)
    |      |
    n3 --- n4
```

### Buscar r5 a partir de n1 com TTL=2:

**Random Walk tradicional**:
```
Escolhe aleatoriamente: n1 → n3
n3 não tem r5
Escolhe aleatoriamente: n3 → n4
n4 não tem r5
TTL acabou → FALHA ❌
```

**Exhaustive Random Walk**:
```
Iteração 1 (nó n1):
  Queue: [(n2, TTL=1, [n1,n2]), (n3, TTL=1, [n1,n3])]

Iteração 2 (nó n2):
  Explora vizinhos de n2: [n5, n4]
  Queue: [(n3, TTL=1, [n1,n3]), (n5, TTL=0, [n1,n2,n5]), (n4, TTL=0, [n1,n2,n4])]

Iteração 3 (nó n3):
  Explora vizinhos de n3: [n4]
  Queue: [(n5, TTL=0, [n1,n2,n5]), (n4, TTL=0, [n1,n2,n4]), (n4, TTL=0, [n1,n3,n4])]

Iteração 4 (nó n5):
  TEM r5! ✅
  Retorna caminho: [n1, n2, n5]
```

## 📈 Vantagens e Desvantagens

### ✅ Vantagens:
1. **Mais provável de encontrar** que Random Walk tradicional
2. **Menos mensagens** que Flooding completo
3. **Explora múltiplos caminhos** simultaneamente
4. **Não precisa de cache** para funcionar

### ❌ Desvantagens:
1. **Mais mensagens** que Random Walk tradicional
2. **Não garante caminho mínimo** (para no primeiro encontrado)
3. **Uso de memória** maior (múltiplos caminhos na queue)
4. **Pode explorar mesmos nós** em caminhos diferentes

## 🎮 Como Usar

### Via API:

```bash
curl -X POST http://localhost:3000/p2p/search \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": "n1",
    "resource_id": "r5",
    "ttl": 5,
    "algo": "exhaustive_random_walk"
  }'
```

### Via Interface Web:

1. Carregue uma rede
2. Selecione algoritmo: **"Exhaustive Random Walk"**
3. Preencha: Nó Inicial, Recurso, TTL
4. Clique em **"Buscar"**

### Comparação de Algoritmos:

Na seção **"Comparar Algoritmos"**, o Exhaustive Random Walk agora está incluído automaticamente nas comparações junto com os outros 4 algoritmos.

## 📊 Métricas Retornadas

```json
{
  "resourceId": "r5",
  "found": true,
  "location": "n5",
  "totalMessages": 8,
  "totalNodesVisited": 5,
  "visitedNodes": ["n1", "n2", "n3", "n4", "n5"],
  "path": ["n1", "n2", "n5"]
}
```

## 🔬 Casos de Uso

**Use Exhaustive Random Walk quando**:
- Flooding gera **muitas mensagens demais**
- Random Walk tem **taxa de sucesso baixa**
- Você quer um **meio-termo** entre eficiência e sucesso
- **Não precisa** do caminho mínimo

**NÃO use quando**:
- Precisa **garantir caminho mínimo** → Use Flooding
- Quer **máxima eficiência** em mensagens → Use Random Walk
- Tem **cache disponível** → Use Informed variants

## 🎓 Contexto Acadêmico

O Exhaustive Random Walk pode ser considerado uma variação de:
- **k-Random Walks** (k = grau do nó)
- **Expanding Ring Search** (mas sem controle de TTL incremental)
- **Parallel Random Walks** (múltiplas caminhadas simultâneas)

É útil para demonstrar o **trade-off** entre:
- Exploração (Flooding) vs Exploitation (Random Walk)
- Mensagens vs Taxa de Sucesso
- Determinístico vs Probabilístico

---

## 🚀 Resumo

O **Exhaustive Random Walk** é um algoritmo experimental que explora **todos os caminhos possíveis** dentro do TTL, oferecendo um equilíbrio entre a eficiência do Random Walk tradicional e a completude do Flooding. É ideal para cenários onde você precisa de alta taxa de sucesso mas não pode arcar com o custo total do Flooding.
