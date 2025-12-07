# Como Usar a Comparação de Algoritmos

## Acesso à Interface

Abra o navegador e acesse: **http://localhost:3000**

## Passo a Passo

### 1. Carregar uma Rede

Primeiro, você precisa carregar uma configuração de rede:

- **Opção 1**: Selecione um template pré-configurado:
  - "Rede Pequena (5 nós)" - ideal para testes rápidos
  - "Rede Média (12 nós)" - cenário mais complexo

- **Opção 2**: Escolha "Personalizado" para editar/criar sua própria rede

Depois clique em **"🚀 Carregar e Visualizar"**

### 2. Executar a Comparação

No painel esquerdo, procure pela seção **"⚖️ Comparar Algoritmos"**:

1. **Nó Inicial**: Digite o ID do nó que vai iniciar a busca (ex: `n1`)
2. **Recurso**: Digite o ID do recurso que você quer encontrar (ex: `r15`)
3. **TTL**: Defina o Time-To-Live (padrão: 10)
4. Clique em **"⚖️ Comparar Todos os Algoritmos"**

### 3. Visualizar os Resultados

Uma tabela comparativa será exibida com:

- ✅/❌ **Status**: Se o algoritmo encontrou o recurso
- 🎯 **Localização**: Em qual nó o recurso foi encontrado
- 📨 **Mensagens**: Total de mensagens trocadas na rede
- 🔍 **Nós Visitados**: Quantos nós foram visitados
- 🛤️ **Caminho**: Sequência de nós percorridos

### 4. Análise dos Resultados

A tabela destaca automaticamente:

- 🟢 **Verde** = Melhor desempenho (menos mensagens/nós)
- 🔴 **Vermelho** = Pior desempenho (mais mensagens/nós)

Um resumo mostra:
- Taxa de sucesso geral
- Algoritmo mais eficiente em mensagens
- Algoritmo mais eficiente em nós visitados

## Exemplo Prático

```
1. Carregar template "Rede Média (12 nós)"
2. Na seção de comparação:
   - Nó Inicial: n1
   - Recurso: r15
   - TTL: 10
3. Clicar em "Comparar Todos os Algoritmos"
4. Ver tabela comparativa com os 4 resultados
```

## Interpretando os Resultados

### Flooding
- ✅ Alta taxa de sucesso
- ❌ Muitas mensagens
- 💡 Melhor quando: precisa garantir encontrar o recurso

### Informed Flooding
- ✅ Usa cache, mais eficiente em buscas repetidas
- ❌ Primeira busca ainda gera muitas mensagens
- 💡 Melhor quando: há buscas frequentes aos mesmos recursos

### Random Walk
- ✅ Poucas mensagens
- ❌ Pode não encontrar o recurso
- 💡 Melhor quando: eficiência é mais importante que garantia

### Informed Random Walk
- ✅ Balanceia eficiência e cache
- ❌ Depende de buscas anteriores
- 💡 Melhor quando: cenários mistos, bom equilíbrio

## Dicas

- Teste com diferentes valores de TTL para ver o impacto
- Compare os mesmos parâmetros em redes diferentes (pequena vs média)
- Execute múltiplas comparações para ver como o cache dos algoritmos "informed" melhora o desempenho
