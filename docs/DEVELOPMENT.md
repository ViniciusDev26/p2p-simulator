# Guia de Desenvolvimento

## Ambiente de Desenvolvimento

### Requisitos
- Node.js >= 18.x
- npm >= 9.x
- Git

### Configuração Inicial
```bash
# Clonar repositório
git clone <repo-url>
cd p2p

# Instalar dependências
npm install

# Verificar instalação
npm run build
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo watch
npm run start:debug        # Inicia com debug

# Build
npm run build             # Compila o projeto
npm run start:prod        # Roda versão compilada

# Testes
npm run test              # Testes unitários
npm run test:watch        # Testes em modo watch
npm run test:cov          # Cobertura de código
npm run test:e2e          # Testes end-to-end

# Qualidade de código
npm run lint              # Verifica linting
npm run format            # Formata código
```

## Estrutura de Desenvolvimento

### Criando Nova Entidade

1. Criar arquivo em `src/domain/entities/`
2. Exportar em `src/domain/entities/index.ts`
3. Criar testes em `tests/unit/`

Exemplo:
```typescript
// src/domain/entities/minha-entidade.entity.ts
export class MinhaEntidade {
  constructor(public readonly id: string) {}
}

// src/domain/entities/index.ts
export * from './minha-entidade.entity';
```

### Adicionando Novo Algoritmo

1. Criar classe em `src/algorithms/`
2. Implementar `ISearchAlgorithm`
3. Registrar em `SearchService`
4. Adicionar ao enum `SearchAlgorithmType`
5. Criar testes

Exemplo:
```typescript
// src/algorithms/meu-algoritmo.algorithm.ts
import { Injectable } from '@nestjs/common';
import { ISearchAlgorithm, SearchParams } from '../domain/interfaces/search-algorithm.interface';
import { Network, SearchResult } from '../domain/entities';

@Injectable()
export class MeuAlgorithm implements ISearchAlgorithm {
  getName(): string {
    return 'Meu Algoritmo';
  }

  search(network: Network, params: SearchParams): SearchResult {
    // Implementação
  }
}

// src/domain/interfaces/search-algorithm.interface.ts
export enum SearchAlgorithmType {
  // ... existentes
  MEU_ALGORITMO = 'meu_algoritmo',
}

// src/services/search.service.ts
constructor(
  // ... existentes
  private readonly meuAlgorithm: MeuAlgorithm,
) {
  this.algorithms = new Map([
    // ... existentes
    [SearchAlgorithmType.MEU_ALGORITMO, this.meuAlgorithm],
  ]);
}
```

### Adicionando Nova Validação

```typescript
// src/validators/network-validator.ts
private validateMinhaRegra(network: Network): string[] {
  const errors: string[] = [];
  // Implementar validação
  return errors;
}

// Adicionar ao método validate()
validate(network: Network): ValidationResult {
  const errors: string[] = [];

  // ... validações existentes
  const minhaRegra = this.validateMinhaRegra(network);
  errors.push(...minhaRegra);

  return { valid: errors.length === 0, errors };
}
```

### Adicionando Novo Endpoint

```typescript
// src/p2p/p2p.controller.ts
@Get('meu-endpoint')
meuEndpoint() {
  // Implementação
}

// Criar DTO se necessário
// src/p2p/dto/meu-endpoint.dto.ts
export class MeuEndpointDto {
  campo: string;
}
```

## Padrões de Código

### Naming Conventions
- Classes: PascalCase (`NetworkService`)
- Arquivos: kebab-case (`network.service.ts`)
- Interfaces: PascalCase com prefixo I (`ISearchAlgorithm`)
- Constantes: UPPER_SNAKE_CASE (`MAX_TTL`)
- Variáveis/funções: camelCase (`searchResource`)

### Organização de Imports
```typescript
// 1. Imports de bibliotecas externas
import { Injectable } from '@nestjs/common';

// 2. Imports de domínio/interfaces
import { ISearchAlgorithm } from '../domain/interfaces';

// 3. Imports de entidades
import { Network, SearchResult } from '../domain/entities';

// 4. Imports locais
import { Helper } from './helper';
```

### Comentários
```typescript
// Evitar comentários óbvios
// BAD
// Adiciona um nó
node.add();

// GOOD
// Valida conectividade usando BFS para garantir que todos os nós são alcançáveis
this.validateConnectivity(network);
```

## Debugging

### VSCode Launch Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
  "args": ["${workspaceFolder}/src/main.ts"],
  "env": {
    "NODE_ENV": "development"
  }
}
```

### Logs
```typescript
// Usar o logger do NestJS
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(NetworkService.name);

this.logger.log('Network loaded successfully');
this.logger.error('Failed to validate network', error);
this.logger.debug('Search params', params);
```

## Testes

### Estrutura de Teste
```typescript
describe('MinhaClasse', () => {
  let instance: MinhaClasse;

  beforeEach(() => {
    instance = new MinhaClasse();
  });

  describe('método', () => {
    it('should comportamento esperado', () => {
      // Arrange
      const input = 'valor';

      // Act
      const result = instance.método(input);

      // Assert
      expect(result).toBe('esperado');
    });
  });
});
```

### Testes de Algoritmos
```typescript
describe('MeuAlgorithm', () => {
  let algorithm: MeuAlgorithm;
  let network: Network;

  beforeEach(() => {
    algorithm = new MeuAlgorithm();
    network = createTestNetwork(); // Helper
  });

  it('should encontrar recurso quando existe', () => {
    const result = algorithm.search(network, {
      nodeId: 'n1',
      resourceId: 'r1',
      ttl: 10,
    });

    expect(result.found).toBe(true);
    expect(result.locationNodeId).toBe('n1');
  });

  it('should respeitar TTL', () => {
    const result = algorithm.search(network, {
      nodeId: 'n1',
      resourceId: 'r99',
      ttl: 0,
    });

    expect(result.found).toBe(false);
    expect(result.totalMessages).toBe(0);
  });
});
```

## Performance

### Métricas
- Tempo de resposta da API: < 100ms para redes pequenas (< 50 nós)
- Memória: < 100MB para redes médias (< 500 nós)
- Build time: < 10s

### Otimizações
```typescript
// Use Set para buscas rápidas
const visited = new Set<string>();

// Cache resultados quando apropriado
private cache = new Map<string, Result>();

// Evite loops desnecessários
const found = nodes.find(n => n.id === targetId); // GOOD
const found = nodes.filter(n => n.id === targetId)[0]; // BAD
```

## Troubleshooting

### Problemas Comuns

#### Build falha
```bash
# Limpar e reconstruir
rm -rf dist node_modules
npm install
npm run build
```

#### Testes falhando
```bash
# Verificar configuração do Jest
npm run test -- --verbose

# Rodar teste específico
npm run test -- node.entity.spec.ts
```

#### API não responde
```bash
# Verificar porta
lsof -i :3000

# Verificar logs
tail -f logs/app.log
```

## Git Workflow

### Branches
- `main` - produção
- `develop` - desenvolvimento
- `feature/nome` - novas features
- `fix/nome` - correções

### Commits
```bash
# Formato
<tipo>: <descrição>

# Tipos
feat: nova funcionalidade
fix: correção de bug
docs: documentação
test: testes
refactor: refatoração
style: formatação
chore: tarefas gerais

# Exemplos
feat: add BFS algorithm
fix: correct TTL validation
docs: update API guide
test: add network validator tests
```

### Pull Requests
1. Criar branch a partir de `develop`
2. Implementar feature/fix
3. Adicionar testes
4. Atualizar documentação
5. Criar PR para `develop`
6. Code review
7. Merge

## Ferramentas Úteis

### Extensões VSCode Recomendadas
- ESLint
- Prettier
- Jest Runner
- GitLens
- REST Client
- Thunder Client (testar API)

### Comandos Úteis
```bash
# Ver estrutura do projeto
tree -I 'node_modules|dist' -L 3

# Contar linhas de código
find src -name "*.ts" | xargs wc -l

# Buscar TODOs
grep -r "TODO" src/

# Analisar bundle size
npm run build --report
```

## Recursos Adicionais

### Documentação
- [NestJS Docs](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Docs](https://jestjs.io/docs)

### Arquitetura
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD](https://martinfowler.com/tags/domain%20driven%20design.html)
- [SOLID](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

## Checklist antes de Commit

- [ ] Código compila sem erros
- [ ] Testes passam
- [ ] Lint passa
- [ ] Documentação atualizada
- [ ] Sem console.logs
- [ ] Sem código comentado
- [ ] Tipos TypeScript corretos
- [ ] Imports organizados
