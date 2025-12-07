# Visualização da Rede P2P

## Visão Geral

A aplicação agora inclui uma interface web interativa completa para visualizar e analisar redes P2P em tempo real usando D3.js.

## Acesso

Após iniciar a aplicação, acesse:

```
http://localhost:3000
```

## Funcionalidades

### 1. Visualização Gráfica da Rede

#### Características
- **Grafo Interativo**: Visualização em tempo real da topologia da rede
- **Nós Coloridos**: Cada nó é representado por um círculo colorido
- **Arestas Dinâmicas**: Conexões entre nós exibidas como linhas
- **Force-Directed Layout**: Layout automático usando física de forças
- **Drag & Drop**: Arraste nós para reorganizar o grafo
- **Zoom & Pan**: Navegue pela rede com zoom e pan

#### Cores dos Nós
- 🔵 **Azul**: Nó normal
- 🟢 **Verde**: Nó inicial da busca
- 🟠 **Laranja**: Nó visitado durante a busca
- 🔴 **Vermelho**: Nó onde o recurso foi encontrado

### 2. Carregamento de Rede

#### Opções Disponíveis
1. **Rede Exemplo (12 nós)**: Rede complexa para testes
2. **Rede Pequena (5 nós)**: Rede simples para demonstrações
3. **Personalizado**: Upload de configuração customizada (em desenvolvimento)

#### Processo
1. Selecione uma configuração no dropdown
2. Clique em "Carregar Rede"
3. Aguarde a validação e visualização

### 3. Informações da Rede

Painel exibe:
- **Nós**: Quantidade total de nós
- **Min Vizinhos**: Mínimo de vizinhos permitido
- **Max Vizinhos**: Máximo de vizinhos permitido
- **Total Recursos**: Quantidade total de recursos na rede

### 4. Busca Interativa

#### Parâmetros
- **Nó Inicial**: ID do nó que inicia a busca (ex: n1)
- **Recurso**: ID do recurso a buscar (ex: r15)
- **TTL**: Time To Live - limite de saltos (1-50)
- **Algoritmo**: Escolha entre 4 algoritmos disponíveis

#### Algoritmos Disponíveis
1. **Flooding**: Busca por inundação
2. **Informed Flooding**: Busca por inundação com cache
3. **Random Walk**: Passeio aleatório
4. **Informed Random Walk**: Passeio aleatório com cache

#### Execução
1. Preencha os parâmetros
2. Clique em "Iniciar Busca"
3. Observe a animação em tempo real
4. Veja os resultados no painel

### 5. Animação de Busca

#### Recursos Visuais
- **Highlight de Nós**: Nós visitados são destacados
- **Caminho Destacado**: Arestas do caminho ficam vermelhas
- **Animação Sequencial**: Nós pulsam conforme são visitados
- **Efeito de Pulso**: Indicação visual de atividade

### 6. Controles de Visualização

#### Botões Disponíveis
- **Reset Zoom**: Restaura zoom original
- **Centralizar**: Centraliza e ajusta zoom ao grafo

#### Checkboxes
- **Mostrar Labels**: Exibe/oculta IDs dos nós
- **Mostrar Recursos**: Exibe/oculta recursos (em desenvolvimento)

### 7. Painel de Resultados

Exibe após cada busca:
- **Algoritmo**: Nome do algoritmo utilizado
- **Status**: ✅ Encontrado ou ❌ Não encontrado
- **Recurso**: ID do recurso buscado
- **Localização**: Nó onde foi encontrado (se aplicável)
- **Mensagens**: Total de mensagens trocadas
- **Nós Visitados**: Quantidade de nós visitados
- **Caminho**: Sequência de nós percorridos

## Como Usar

### Workflow Completo

1. **Iniciar a Aplicação**
```bash
npm run start:dev
```

2. **Acessar Interface**
   - Abra o navegador em `http://localhost:3000`

3. **Carregar Rede**
   - Selecione "Rede Exemplo (12 nós)"
   - Clique em "Carregar Rede"
   - Aguarde a visualização aparecer

4. **Realizar Busca**
   - Nó Inicial: `n1`
   - Recurso: `r15`
   - TTL: `10`
   - Algoritmo: `flooding`
   - Clique em "Iniciar Busca"

5. **Observar Resultados**
   - Veja a animação na visualização
   - Leia os resultados no painel
   - Compare diferentes algoritmos

6. **Comparar Algoritmos**
   - Execute a mesma busca com algoritmos diferentes
   - Compare métricas (mensagens, nós visitados)
   - Observe diferenças na animação

## Componentes Técnicos

### Frontend

#### HTML (`public/index.html`)
- Estrutura da página
- Painéis laterais
- Área de visualização
- Controles interativos

#### CSS (`public/css/styles.css`)
- Design responsivo
- Gradientes modernos
- Animações suaves
- Layout em grid

#### JavaScript (`public/js/`)

**network-visualizer.js**
- Classe `NetworkVisualizer`
- Renderização D3.js
- Física de forças
- Animações de busca
- Controles de zoom/pan

**app.js**
- Classe `P2PApp`
- Comunicação com API
- Event handlers
- Atualização de UI

### Backend

#### Novo Endpoint

**GET /p2p/network/graph**

Retorna dados formatados para D3.js:

```json
{
  "nodes": [
    {
      "id": "n1",
      "resources": ["r1", "r2", "r3"],
      "neighbors": 3
    }
  ],
  "links": [
    {
      "source": "n1",
      "target": "n2"
    }
  ]
}
```

#### Configuração

**Arquivos Estáticos**
- Servidos via `@nestjs/serve-static`
- Pasta `public/` para interface
- Pasta `config/` para JSONs

**CORS Habilitado**
- Permite requisições do frontend
- Configurado em `main.ts`

## Interações Avançadas

### Arrastar Nós
- Clique e arraste qualquer nó
- Reorganize o layout manualmente
- Física readapta automaticamente

### Zoom e Pan
- **Scroll**: Zoom in/out
- **Arrastar fundo**: Pan pela área
- **Duplo clique**: Reset zoom
- **Botões**: Reset e Centralizar

### Tooltips
- Passe o mouse sobre nós
- Veja informações detalhadas:
  - ID do nó
  - Recursos armazenados
  - Número de vizinhos

## Performance

### Otimizações
- Force simulation eficiente
- Renderização SVG otimizada
- Animações CSS quando possível
- Debouncing de eventos

### Limites Recomendados
- **Nós**: < 100 para performance ideal
- **TTL**: < 20 para animações fluídas
- **Frequência**: Aguarde animações terminarem

## Arquitetura da Visualização

```
┌─────────────────────────────────────┐
│         Browser (Frontend)          │
│                                     │
│  ┌──────────┐      ┌─────────────┐ │
│  │   HTML   │─────▶│     CSS     │ │
│  └──────────┘      └─────────────┘ │
│       │                             │
│       ▼                             │
│  ┌──────────────────────────────┐  │
│  │       JavaScript             │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  NetworkVisualizer     │  │  │
│  │  │  - D3.js rendering     │  │  │
│  │  │  - Force simulation    │  │  │
│  │  │  - Animation           │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  ┌────────────────────────┐  │  │
│  │  │      P2PApp            │  │  │
│  │  │  - API calls           │  │  │
│  │  │  - Event handling      │  │  │
│  │  │  - UI updates          │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└─────────────────┬───────────────────┘
                  │ HTTP/REST
                  ▼
┌─────────────────────────────────────┐
│      NestJS Backend (API)           │
│                                     │
│  ┌──────────────────────────────┐  │
│  │    P2PController             │  │
│  │  - /p2p/network/load         │  │
│  │  - /p2p/network/graph ⬅ NEW │  │
│  │  - /p2p/search               │  │
│  │  - /p2p/algorithms           │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  ServeStaticModule           │  │
│  │  - Serve /public             │  │
│  │  - Serve /config             │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Troubleshooting

### Rede não carrega
- Verifique se o backend está rodando
- Abra o console do navegador (F12)
- Verifique erros de CORS
- Confirme que o arquivo JSON é válido

### Visualização não aparece
- Aguarde alguns segundos após carregar
- Clique em "Centralizar"
- Verifique console por erros JavaScript
- Recarregue a página (F5)

### Busca não funciona
- Confirme que a rede foi carregada
- Verifique se o nó inicial existe
- Confirme que o TTL é > 0
- Veja erros no painel de resultados

### Performance lenta
- Reduza o tamanho da rede
- Diminua o TTL
- Desative animações complexas
- Use navegador moderno

## Próximas Melhorias

### Planejadas
- [ ] Upload de configuração personalizada
- [ ] Exportação de imagem da visualização
- [ ] Visualização de recursos nos nós
- [ ] Histórico de buscas
- [ ] Comparação lado a lado de algoritmos
- [ ] Estatísticas em tempo real
- [ ] Modos de layout alternativos
- [ ] Dark mode
- [ ] Responsive mobile

### Em Desenvolvimento
- [ ] WebSocket para atualizações em tempo real
- [ ] Animação passo a passo com controles
- [ ] Replay de buscas anteriores
- [ ] Gráficos de performance

## Tecnologias Utilizadas

### Frontend
- **D3.js v7**: Visualização de dados
- **Vanilla JavaScript**: Lógica da aplicação
- **HTML5/CSS3**: Interface moderna
- **Fetch API**: Comunicação HTTP

### Backend
- **NestJS**: Framework
- **@nestjs/serve-static**: Arquivos estáticos
- **CORS**: Cross-Origin Resource Sharing

## Conclusão

A visualização D3.js torna a aplicação P2P muito mais intuitiva e educacional, permitindo:

✅ Compreensão visual da topologia
✅ Análise interativa de algoritmos
✅ Comparação facilitada de resultados
✅ Experiência de aprendizado aprimorada
✅ Debugging visual de redes

A interface é moderna, responsiva e fácil de usar, tornando o simulador P2P uma ferramenta poderosa para estudo e análise de redes descentralizadas.
