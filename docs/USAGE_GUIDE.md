# Guia de Uso - Visualização P2P

## Início Rápido

### 1. Iniciar a Aplicação

```bash
npm run start:dev
```

Aguarde a mensagem:
```
Application is running on: http://localhost:3000
```

### 2. Acessar a Interface

Abra seu navegador e acesse:
```
http://localhost:3000
```

## Tutorial Passo a Passo

### Passo 1: Carregar uma Rede

1. **Selecione a Configuração**
   - No painel esquerdo, encontre "📁 Carregar Rede"
   - Clique no dropdown "Configuração (JSON)"
   - Escolha "Rede Exemplo (12 nós)" ou "Rede Pequena (5 nós)"

2. **Carregar**
   - Clique no botão azul "Carregar Rede"
   - Aguarde a mensagem de sucesso em verde
   - A visualização aparecerá automaticamente

3. **Verificar Informações**
   - O painel "📊 Informações da Rede" mostrará:
     - Quantidade de nós
     - Limites de vizinhos
     - Total de recursos

### Passo 2: Explorar a Visualização

#### Interagir com o Grafo

- **Arrastar Nós**: Clique e arraste qualquer círculo azul
- **Zoom**: Use a roda do mouse ou pinça (trackpad)
- **Pan**: Arraste o fundo branco da visualização
- **Reset**: Clique em "Reset Zoom" para voltar ao estado inicial
- **Centralizar**: Clique em "Centralizar" para ajustar o grafo na tela

#### Entender os Elementos

- **Círculos Azuis**: Nós da rede
- **Linhas Cinzas**: Conexões entre nós
- **Números nos Nós**: IDs dos nós (n1, n2, etc.)
- **Badge Vermelho**: Quantidade de recursos no nó

#### Usar Tooltips

- Passe o mouse sobre qualquer nó
- Veja informações detalhadas:
  - ID do nó
  - Recursos armazenados
  - Número de vizinhos

### Passo 3: Realizar uma Busca

1. **Preencher Parâmetros**

   No painel "🔍 Buscar Recurso":

   - **Nó Inicial**: Digite o nó de partida (ex: `n1`)
   - **Recurso**: Digite o recurso a buscar (ex: `r15`)
   - **TTL**: Defina o limite de saltos (ex: `10`)
   - **Algoritmo**: Escolha um dos 4 disponíveis

2. **Executar Busca**
   - Clique no botão verde "Iniciar Busca"
   - Observe a animação na visualização

3. **Observar Animação**
   - **Verde**: Nó inicial da busca
   - **Laranja**: Nós visitados durante a busca
   - **Vermelho**: Nó onde o recurso foi encontrado
   - **Linhas Vermelhas**: Caminho percorrido

4. **Analisar Resultados**

   O painel "📈 Resultados" mostrará:
   - Status (encontrado ou não)
   - Algoritmo utilizado
   - Localização do recurso
   - Total de mensagens trocadas
   - Quantidade de nós visitados
   - Caminho completo

### Passo 4: Comparar Algoritmos

#### Opção 1: Comparação Manual (Individual)

1. **Execute a Mesma Busca**
   - Use os mesmos parâmetros (nó, recurso, TTL)
   - Mude apenas o algoritmo

2. **Compare as Métricas**

   **Flooding**:
   - ✅ Maior probabilidade de encontrar
   - ❌ Muitas mensagens
   - ❌ Visita muitos nós

   **Informed Flooding**:
   - ✅ Usa cache
   - ✅ Menos mensagens em buscas repetidas
   - ⚡ Rápido após primeira busca

   **Random Walk**:
   - ✅ Poucas mensagens
   - ❌ Pode demorar mais
   - ⚡ Econômico em tráfego

   **Informed Random Walk**:
   - ✅ Balanceado
   - ✅ Cache + eficiência
   - ⚡ Melhor para múltiplas buscas

3. **Registre os Resultados**
   - Anote mensagens e nós visitados
   - Compare eficiência
   - Observe padrões visuais

#### Opção 2: Comparação Automática (Todos os Algoritmos)

1. **Localizar a Seção de Comparação**
   - No painel esquerdo, procure "⚖️ Comparar Algoritmos"
   - Esta seção permite executar todos os 4 algoritmos automaticamente

2. **Preencher Parâmetros**
   - **Nó Inicial**: Digite o nó de partida (ex: `n1`)
   - **Recurso**: Digite o recurso a buscar (ex: `r15`)
   - **TTL**: Defina o limite de saltos (ex: `10`)

3. **Executar Comparação**
   - Clique no botão "⚖️ Comparar Todos os Algoritmos"
   - Aguarde enquanto o sistema executa as 4 buscas automaticamente
   - Uma tabela comparativa será exibida

4. **Analisar a Tabela Comparativa**

   A tabela mostra para cada algoritmo:
   - ✅/❌ **Status**: Se encontrou o recurso
   - 🎯 **Localização**: Em qual nó foi encontrado
   - 📨 **Mensagens**: Total de mensagens trocadas
   - 🔍 **Nós Visitados**: Quantos nós foram explorados
   - 🛤️ **Caminho**: Sequência de nós percorridos

5. **Entender os Destaques Visuais**
   - 🟢 **Verde**: Melhor desempenho (menos mensagens/nós)
   - 🔴 **Vermelho**: Pior desempenho (mais mensagens/nós)
   - **Resumo**: Mostra o algoritmo mais eficiente em cada métrica

6. **Interpretar os Resultados**
   - Compare taxa de sucesso entre algoritmos
   - Identifique qual foi mais eficiente em mensagens
   - Identifique qual visitou menos nós
   - Observe trade-offs entre eficiência e garantia de encontrar

### Passo 5: Limpar e Recomeçar

- **Limpar Busca**: Clique em "Limpar" para resetar highlights
- **Nova Busca**: Altere os parâmetros e busque novamente
- **Nova Rede**: Carregue outra configuração

## Exemplos Práticos

### Exemplo 1: Busca Simples

```
Configuração: Rede Pequena (5 nós)
Nó Inicial: n1
Recurso: r4
TTL: 5
Algoritmo: Flooding
```

**Resultado Esperado**:
- Recurso encontrado em n2
- Poucas mensagens (rede pequena)
- Caminho curto

### Exemplo 2: Comparação Manual de Algoritmos

**Setup**:
```
Rede: Rede Exemplo (12 nós)
Nó: n1
Recurso: r15
TTL: 10
```

**Teste 1 - Flooding**:
```
Resultado: Encontrado em n7
Mensagens: ~25
Nós Visitados: ~12
```

**Teste 2 - Random Walk**:
```
Resultado: Encontrado em n7
Mensagens: ~8
Nós Visitados: ~9
```

**Conclusão**: Random Walk foi mais eficiente!

### Exemplo 2.1: Comparação Automática de Algoritmos

**Setup**:
1. Carregue "Rede Média (12 nós)"
2. Localize a seção "⚖️ Comparar Algoritmos"
3. Preencha:
   - Nó Inicial: `n1`
   - Recurso: `r15`
   - TTL: `10`
4. Clique em "Comparar Todos os Algoritmos"

**Resultado Esperado**:

| Algoritmo | Status | Localização | Mensagens | Nós Visitados |
|-----------|--------|-------------|-----------|---------------|
| Flooding | ✅ | n7 | 25 | 12 |
| Informed Flooding | ✅ | n7 | 25 | 12 |
| Random Walk | ✅ | n7 | 8 | 9 |
| Informed Random Walk | ✅ | n7 | 8 | 9 |

**Análise Automática**:
- Taxa de Sucesso: 4/4 algoritmos encontraram
- Mais Eficiente (Mensagens): Random Walk (8 mensagens)
- Mais Eficiente (Nós): Random Walk (9 nós)

**Conclusão**:
- Random Walk e Informed Random Walk tiveram desempenho superior
- Flooding garantiu encontrar mas usou mais recursos
- A tabela destaca automaticamente os melhores e piores valores

### Exemplo 3: Efeito do Cache

**Busca 1 - Informed Flooding**:
```
Nó: n1, Recurso: r15, TTL: 10
Resultado: Encontrado, Mensagens: 20
```

**Busca 2 - Mesmo Recurso**:
```
Nó: n1, Recurso: r15, TTL: 10
Resultado: Encontrado, Mensagens: 0 (cache!)
```

## Dicas e Truques

### Otimizar Visualização

1. **Reorganizar Nós**
   - Arraste nós para posições mais claras
   - Separe grupos densos
   - Crie layout personalizado

2. **Controlar Informações**
   - Desmarque "Mostrar Labels" para visão limpa
   - Use tooltips para ver detalhes sob demanda
   - Zoom para focar em áreas específicas

3. **Melhorar Performance**
   - Use redes menores para testes iniciais
   - Reduza TTL para animações mais rápidas
   - Aguarde animações terminarem antes de nova busca

### Analisar Resultados

1. **Eficiência de Mensagens**
   - Menor = Melhor
   - Compare algoritmos pela métrica
   - Considere taxa de sucesso

2. **Nós Visitados**
   - Indica abrangência da busca
   - Flooding visita mais nós
   - Random Walk visita menos

3. **Caminho Percorrido**
   - Veja rota na animação
   - Entenda topologia da rede
   - Identifique gargalos

### Experimentar

1. **Variar TTL**
   ```
   TTL Baixo (3): Busca local, pode falhar
   TTL Médio (10): Balanceado
   TTL Alto (20): Explora toda rede
   ```

2. **Testar Limites**
   - Busque recursos inexistentes
   - Use TTL = 0
   - Inicie de nós diferentes

3. **Explorar Topologia**
   - Identifique nós centrais
   - Encontre bottlenecks
   - Veja distribuição de recursos

## Cenários de Uso

### Educacional

**Objetivo**: Aprender algoritmos P2P

1. Carregue rede pequena
2. Execute Flooding com TTL baixo
3. Observe como busca se propaga
4. Aumente TTL gradualmente
5. Compare com Random Walk
6. Entenda trade-offs

### Análise de Performance

**Objetivo**: Comparar algoritmos

**Método Manual**:
1. Defina rede de teste
2. Liste recursos a buscar
3. Execute cada algoritmo 5x
4. Registre métricas médias
5. Crie tabela comparativa
6. Documente conclusões

**Método Automático** (Recomendado):
1. Carregue a rede de teste
2. Use a seção "⚖️ Comparar Algoritmos"
3. Execute comparações para diferentes recursos
4. Copie/exporte os resultados da tabela
5. Analise os dados consolidados
6. Identifique padrões e tendências

**Vantagens do Método Automático**:
- ✅ Mais rápido (4 buscas simultâneas)
- ✅ Mesmas condições para todos os algoritmos
- ✅ Destaque visual dos melhores/piores
- ✅ Análise automática incluída
- ✅ Reduz erros de comparação manual

### Validação de Topologia

**Objetivo**: Verificar conectividade

1. Carregue sua rede
2. Selecione nó extremo
3. Busque recurso em outro extremo
4. Use Flooding com TTL alto
5. Verifique se encontra
6. Confirme não-particionamento

### Demonstração

**Objetivo**: Apresentar conceitos

1. Prepare slides de contexto
2. Carregue rede no navegador
3. Explique topologia
4. Execute busca ao vivo
5. Mostre animação
6. Discuta resultados

## Troubleshooting

### Problemas Comuns

**1. Rede não carrega**
- ✅ Verifique se aplicação está rodando
- ✅ Recarregue a página (F5)
- ✅ Veja console (F12) por erros

**2. Visualização não aparece**
- ✅ Aguarde 2-3 segundos
- ✅ Clique em "Centralizar"
- ✅ Teste com rede menor

**3. Busca não funciona**
- ✅ Confirme que rede foi carregada
- ✅ Verifique se nó existe
- ✅ Use recurso válido (veja tooltips)

**4. Animação travada**
- ✅ Aguarde término da animação
- ✅ Clique em "Limpar"
- ✅ Recarregue página se persistir

**5. Performance lenta**
- ✅ Use navegador moderno (Chrome, Firefox, Edge)
- ✅ Feche outras abas
- ✅ Teste com rede menor

## Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| F5 | Recarregar página |
| F11 | Tela cheia |
| F12 | Abrir console |
| Ctrl/Cmd + 0 | Reset zoom navegador |
| Esc | Cancelar ações |

## Melhores Práticas

### Demonstrações

1. ✅ Teste tudo antes de apresentar
2. ✅ Use rede pequena primeiro
3. ✅ Prepare buscas interessantes
4. ✅ Explique cores e símbolos
5. ✅ Compare pelo menos 2 algoritmos

### Análises

1. ✅ Documente configurações
2. ✅ Repita testes para média
3. ✅ Anote observações
4. ✅ Capture screenshots
5. ✅ Compare métricas objetivamente

### Aprendizado

1. ✅ Comece com conceitos básicos
2. ✅ Use visualização para intuição
3. ✅ Experimente ativamente
4. ✅ Faça perguntas sobre resultados
5. ✅ Relacione teoria com prática

## Recursos Adicionais

- [Documentação Completa de Visualização](./VISUALIZATION.md)
- [Como Usar a Comparação de Algoritmos](./COMO_USAR_COMPARACAO.md)
- [Guia da API](./API_GUIDE.md)
- [Arquitetura do Sistema](./ARCHITECTURE.md)
- [README Principal](./README.md)

## Suporte

Problemas? Consulte:
1. Este guia
2. VISUALIZATION.md
3. Console do navegador (F12)
4. Issues no GitHub
