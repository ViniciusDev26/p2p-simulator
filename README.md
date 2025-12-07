# P2P Network Simulator

Simulador de rede P2P com visualização interativa e comparação de algoritmos de busca.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm run start:dev
```

Acesse: **http://localhost:3000**

## 🎯 Funcionalidades

- ✅ **Visualização Interativa** - Grafo D3.js com drag, zoom e pan
- ✅ **4 Algoritmos de Busca**:
  - Flooding
  - Informed Flooding
  - Random Walk
  - Informed Random Walk
- ✅ **Comparação Automática** - Execute todos os algoritmos e compare resultados
- ✅ **Editor de Configuração** - Crie e edite redes customizadas
- ✅ **Templates Prontos** - Redes pequena (5 nós) e média (12 nós)
- ✅ **Métricas Detalhadas** - Mensagens trocadas, nós visitados, caminhos

## 📊 Como Usar a Comparação de Algoritmos

1. Carregue uma rede (template ou personalizada)
2. Na seção "⚖️ Comparar Algoritmos":
   - Digite nó inicial (ex: `n1`)
   - Digite recurso (ex: `r15`)
   - Clique em "Comparar Todos os Algoritmos"
3. Veja a tabela comparativa com destaque visual:
   - 🟢 Verde = Melhor desempenho
   - 🔴 Vermelho = Pior desempenho

## 📚 Documentação

**[📑 Índice Completo da Documentação](./docs/INDEX.md)**

### Documentos Principais

- [📖 Guia de Uso Completo](./docs/USAGE_GUIDE.md) - Tutorial passo a passo
- [⚖️ Como Usar a Comparação](./docs/COMO_USAR_COMPARACAO.md) - Guia de comparação de algoritmos
- [⚡ Quickstart](./docs/QUICKSTART.md) - Início rápido em 5 minutos

### Documentação Técnica

- [🏗️ Arquitetura](./docs/ARCHITECTURE.md) - Estrutura e design
- [🔌 API Guide](./docs/API_GUIDE.md) - Endpoints REST
- [🎨 Visualização](./docs/VISUALIZATION.md) - Sistema D3.js
- [📁 Estrutura](./docs/STRUCTURE.md) - Organização do projeto
- [📝 Desenvolvimento](./docs/DEVELOPMENT.md) - Guia para desenvolvedores
- [📋 Checklist](./docs/CHECKLIST.md) - Funcionalidades
- [📊 Resumo do Projeto](./docs/PROJECT_SUMMARY.md) - Visão geral

## 🛠️ Tecnologias

- **Backend**: NestJS, TypeScript
- **Frontend**: D3.js v7, HTML5, CSS3
- **Arquitetura**: Clean Architecture + DDD

## 📦 Scripts

```bash
npm run start:dev    # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start:prod   # Executar build de produção
npm run lint         # Verificar código
```

## 🎓 Conceitos P2P

### Algoritmos de Busca

#### Flooding
- Propaga busca para todos os vizinhos
- Alta taxa de sucesso
- Muitas mensagens

#### Informed Flooding
- Flooding com cache local
- Eficiente em buscas repetidas
- Aprende com buscas anteriores

#### Random Walk
- Escolhe caminho aleatório
- Poucas mensagens
- Pode não encontrar

#### Informed Random Walk
- Random walk com cache
- Balanceia eficiência e aprendizado
- Melhor para múltiplas buscas

## 📈 Métricas de Comparação

- **Mensagens Trocadas**: Total de mensagens enviadas na rede
- **Nós Visitados**: Quantidade de nós explorados
- **Taxa de Sucesso**: Porcentagem de algoritmos que encontraram o recurso
- **Caminho**: Sequência de nós percorridos

## 🔍 Exemplo de Uso

```json
{
  "num_nodes": 5,
  "min_neighbors": 2,
  "max_neighbors": 3,
  "resources": {
    "n1": ["r1", "r2"],
    "n2": ["r3"],
    "n3": ["r4", "r5"],
    "n4": ["r6"],
    "n5": ["r7", "r8"]
  },
  "edges": [
    ["n1", "n2"],
    ["n1", "n3"],
    ["n2", "n3"],
    ["n2", "n4"],
    ["n3", "n5"],
    ["n4", "n5"]
  ]
}
```

## 🤝 Contribuindo

Este é um projeto acadêmico para estudo de algoritmos de busca em redes P2P.

## 📄 Licença

MIT
