# Análise de Requisitos - Trabalho Acadêmico P2P

## Requisito Completo

> Considere um sistema P2P não estruturado com as seguintes propriedades:
> - Número de nós = 15 (com os nós sendo identificados por 1, 2, 3, …, 15)
> - Número mínimo de vizinhos por nó = 3
> - Número máximo de vizinhos por nó = 4

### a) Desenhe uma topologia para este sistema

**Requisito**: Desenhar topologia, salvar em imagem, e compartilhar link.

**Status**: ✅ **IMPLEMENTADO (Backend) + ⚠️ FALTA (Frontend)**

**O que temos**:
- ✅ Configuração de rede de 15 nós: `config/network-15nodes.json`
- ✅ Visualização D3.js interativa em `http://localhost:3000`
- ✅ Validação automática dos requisitos (min 3, max 4 vizinhos)

**O que falta**:
- ❌ Botão "Exportar como Imagem" (PNG/SVG)
- ❌ Upload/compartilhamento da imagem

**Solução**:
1. Adicionar botão na interface para exportar grafo D3.js
2. Usar `html2canvas` ou `saveSvgAsPng` para salvar
3. Download automático da imagem

---

### b) Analise a topologia criada

**Requisito**:
1. Identificar nó Origem (O) e Destino (D) com distância de **exatos 3 saltos**
2. Ilustrar **melhor caso** e **pior caso** do Random Walk
3. Calcular **probabilidade do melhor caso**

**Status**: ✅ **TOTALMENTE IMPLEMENTADO (Backend) + ⚠️ FALTA (Frontend)**

#### O que temos (Backend):

**Novos Endpoints**:

1. **GET `/p2p/path/suggest?distance=3`**
   - Sugere pares de nós com distância específica
   - Retorna lista de todos os pares (O, D) com exatos 3 saltos
   - Exemplo de resposta:
   ```json
   {
     "targetDistance": 3,
     "pairs": [
       { "origin": "n1", "destination": "n8", "distance": 3 },
       { "origin": "n2", "destination": "n9", "distance": 3 }
     ],
     "total": 15
   }
   ```

2. **GET `/p2p/path/analyze?origin=n1&destination=n8&ttl=3`**
   - Analisa **todos os caminhos possíveis** entre O e D
   - Calcula probabilidades de cada caminho
   - Identifica **melhor caso** (caminho mais curto)
   - Identifica **pior caso** (caminho mais longo dentro do TTL)
   - Exemplo de resposta:
   ```json
   {
     "origin": "n1",
     "destination": "n8",
     "shortestDistance": 3,
     "bestCase": {
       "path": ["n1", "n3", "n7", "n8"],
       "length": 3,
       "probability": 0.0833
     },
     "worstCase": {
       "path": ["n1", "n4", "n9", "n14", "n8"],
       "length": 4,
       "probability": 0.0208
     },
     "allPaths": [...],
     "totalPaths": 12
   }
   ```

#### Como o cálculo de probabilidade funciona:

O `PathAnalyzerService` implementa o cálculo correto para Random Walk:

```typescript
calculatePathProbability(network: Network, path: string[]): number {
  let probability = 1;

  for (let i = 0; i < path.length - 1; i++) {
    const currentNode = path[i];
    const nextNode = path[i + 1];

    // Vizinhos não visitados no caminho até agora
    const unvisitedNeighbors = neighbors.filter(
      n => !path.slice(0, i + 1).includes(n)
    );

    // Probabilidade = 1 / número de vizinhos não visitados
    const pChoice = 1 / unvisitedNeighbors.length;

    probability *= pChoice;
  }

  return probability;
}
```

**Exemplo**:
- Caminho: `n1 → n3 → n7 → n8`
- n1 tem 3 vizinhos não visitados → P = 1/3
- n3 tem 4 vizinhos, 1 já visitado (n1) → P = 1/3
- n7 tem 3 vizinhos, 2 já visitados → P = 1/1 = 1
- **Probabilidade total** = (1/3) × (1/3) × 1 = 1/9 ≈ 0.111

#### O que falta (Frontend):

**Nova Seção na Interface**:
- ❌ Painel "🎯 Análise de Caminhos Random Walk"
- ❌ Input: TTL e distância desejada
- ❌ Botão "Sugerir Pares de Nós"
- ❌ Seleção de nó Origem e Destino
- ❌ Botão "Analisar Caminhos"
- ❌ Visualização dos resultados:
  - Melhor caso (caminho + probabilidade)
  - Pior caso (caminho + probabilidade)
  - Tabela com todos os caminhos possíveis
  - Destaque visual dos caminhos no grafo

---

## Resumo Geral

### ✅ Implementado

**Backend**:
1. ✅ Sistema P2P funcional com 4 algoritmos
2. ✅ Configuração de rede de 15 nós
3. ✅ Validação de topologia (min 3, max 4 vizinhos)
4. ✅ Serviço de análise de caminhos (`PathAnalyzerService`)
5. ✅ Cálculo de menor distância (BFS)
6. ✅ Busca de todos os caminhos possíveis (DFS)
7. ✅ Cálculo de probabilidades para Random Walk
8. ✅ Identificação de melhor/pior caso
9. ✅ Endpoint para sugerir pares de nós
10. ✅ Endpoint para análise completa de caminhos

**Frontend**:
1. ✅ Visualização D3.js interativa
2. ✅ Comparação automática de algoritmos
3. ✅ Templates de rede (5, 12, 15 nós)

### ❌ Falta Implementar

**Frontend**:
1. ❌ Exportar topologia como imagem (PNG/SVG)
2. ❌ Interface para análise de caminhos
3. ❌ Visualização de probabilidades
4. ❌ Destaque visual de melhor/pior caso no grafo

---

## Próximos Passos

### Prioridade ALTA (para atender requisito mínimo):

1. **Exportar Topologia**:
   ```javascript
   // Adicionar botão no HTML
   <button onclick="exportGraph()">📷 Exportar Topologia</button>

   // Função para exportar
   function exportGraph() {
     const svg = document.querySelector('#network-graph');
     saveSvgAsPng(svg, 'topologia-p2p.png');
   }
   ```

2. **Interface de Análise de Caminhos**:
   ```html
   <div class="path-analysis">
     <h3>🎯 Análise Random Walk</h3>

     <!-- Sugestão de pares -->
     <button onclick="suggestPairs(3)">
       Sugerir pares com 3 saltos
     </button>

     <!-- Seleção -->
     <select id="origin"></select>
     <select id="destination"></select>
     <input id="ttl" value="3">

     <!-- Análise -->
     <button onclick="analyzePath()">
       Analisar Caminhos
     </button>

     <!-- Resultados -->
     <div id="results">
       <h4>Melhor Caso</h4>
       <p>Caminho: n1 → n3 → n7 → n8</p>
       <p>Probabilidade: 11.1%</p>

       <h4>Pior Caso</h4>
       <p>Caminho: n1 → n4 → n10 → n14 → n8</p>
       <p>Probabilidade: 2.1%</p>
     </div>
   </div>
   ```

### Prioridade MÉDIA (melhorias):

1. Visualização de todos os caminhos possíveis em tabela
2. Animação do caminho no grafo
3. Comparação visual entre melhor e pior caso
4. Export de relatório em PDF

---

## Como Usar (Atualmente)

### 1. Carregar Rede de 15 Nós

```bash
# Via interface web
1. Acesse http://localhost:3000
2. Selecione template "custom"
3. Cole o conteúdo de config/network-15nodes.json
4. Clique em "Carregar e Visualizar"
```

```bash
# Via API
curl -X POST http://localhost:3000/p2p/network/load \
  -H "Content-Type: application/json" \
  -d @config/network-15nodes.json
```

### 2. Sugerir Pares com 3 Saltos

```bash
curl "http://localhost:3000/p2p/path/suggest?distance=3"
```

### 3. Analisar Caminho Específico

```bash
curl "http://localhost:3000/p2p/path/analyze?origin=n1&destination=n8&ttl=3"
```

---

## Arquivos Criados

1. **`config/network-15nodes.json`** - Configuração da rede de 15 nós
2. **`src/services/path-analyzer.service.ts`** - Serviço de análise de caminhos
3. **`src/p2p/p2p.controller.ts`** - Novos endpoints adicionados
4. **`src/p2p/p2p.module.ts`** - PathAnalyzerService registrado

---

## Conclusão

✅ **Backend**: 100% implementado - Todos os cálculos e análises funcionando

⚠️ **Frontend**: 40% implementado - Falta interface de análise e export de imagem

**Tempo estimado para completar**:
- Export de imagem: ~30 minutos
- Interface de análise: ~2 horas
- **Total**: ~2.5 horas

**Impacto acadêmico**:
- Já é possível fazer TODA a análise via API
- Falta apenas a interface gráfica para facilitar uso
- Pode-se usar Postman/curl para demonstrar
