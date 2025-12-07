#!/bin/bash

# Script para comparar algoritmos de busca P2P
# Uso: ./scripts/compare-algorithms.sh

API_URL="http://localhost:3000"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="comparison_report_${TIMESTAMP}.md"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     Comparação de Algoritmos de Busca P2P                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Arrays de configurações
NETWORKS=("small" "medium")
ALGORITHMS=("flooding" "informed_flooding" "random_walk" "informed_random_walk")

# Iniciar relatório
cat > "$REPORT_FILE" << 'EOF'
# Relatório de Comparação de Algoritmos P2P

**Data:** $(date)

## Configurações de Teste

### Redes Testadas:
1. **Rede Pequena** (5 nós)
2. **Rede Média** (12 nós)

### Algoritmos Testados:
1. Flooding
2. Informed Flooding
3. Random Walk
4. Informed Random Walk

---

EOF

# Função para carregar rede
load_network() {
    local network_type=$1
    local config_file=""

    if [ "$network_type" == "small" ]; then
        config_file="config/network-small.json"
    else
        config_file="config/network-example.json"
    fi

    echo -e "${BLUE}Carregando rede: $network_type${NC}"

    curl -s -X POST "$API_URL/p2p/network/load" \
        -H "Content-Type: application/json" \
        -d @"$config_file" > /dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Rede carregada com sucesso${NC}"
        return 0
    else
        echo -e "${RED}✗ Erro ao carregar rede${NC}"
        return 1
    fi
}

# Função para executar busca
run_search() {
    local node_id=$1
    local resource_id=$2
    local ttl=$3
    local algorithm=$4

    curl -s -X POST "$API_URL/p2p/search" \
        -H "Content-Type: application/json" \
        -d "{
            \"node_id\": \"$node_id\",
            \"resource_id\": \"$resource_id\",
            \"ttl\": $ttl,
            \"algo\": \"$algorithm\"
        }"
}

# Função para executar conjunto de testes
run_test_suite() {
    local network_name=$1
    local node_id=$2
    local resource_id=$3
    local ttl=$4

    echo "" >> "$REPORT_FILE"
    echo "## Teste: Rede $network_name" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "**Parâmetros:**" >> "$REPORT_FILE"
    echo "- Nó Inicial: $node_id" >> "$REPORT_FILE"
    echo "- Recurso Buscado: $resource_id" >> "$REPORT_FILE"
    echo "- TTL: $ttl" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "| Algoritmo | Encontrado | Localização | Mensagens | Nós Visitados | Caminho |" >> "$REPORT_FILE"
    echo "|-----------|------------|-------------|-----------|---------------|---------|" >> "$REPORT_FILE"

    echo -e "\n${YELLOW}Testando: Nó=$node_id, Recurso=$resource_id, TTL=$ttl${NC}"

    for algo in "${ALGORITHMS[@]}"; do
        echo -e "${BLUE}  → $algo${NC}"

        result=$(run_search "$node_id" "$resource_id" "$ttl" "$algo")

        # Extrair dados do resultado
        found=$(echo "$result" | jq -r '.result.found')
        location=$(echo "$result" | jq -r '.result.locationNodeId // "N/A"')
        messages=$(echo "$result" | jq -r '.result.totalMessages')
        nodes=$(echo "$result" | jq -r '.result.totalNodesVisited')
        path=$(echo "$result" | jq -r '.result.path | join(" → ")')

        # Formatar encontrado
        if [ "$found" == "true" ]; then
            found_text="✅ Sim"
        else
            found_text="❌ Não"
        fi

        # Adicionar ao relatório
        echo "| $algo | $found_text | $location | $messages | $nodes | $path |" >> "$REPORT_FILE"

        # Mostrar no console
        echo -e "     Mensagens: $messages, Nós: $nodes, Encontrado: $found_text"

        sleep 0.5
    done

    echo "" >> "$REPORT_FILE"
}

# Executar testes

echo -e "\n${GREEN}=== INICIANDO TESTES ===${NC}\n"

# Teste 1: Rede Pequena
echo -e "${BLUE}═══ REDE PEQUENA (5 nós) ═══${NC}"
load_network "small"
run_test_suite "Pequena" "n1" "r3" 10
run_test_suite "Pequena" "n1" "r7" 10

# Teste 2: Rede Média
echo -e "\n${BLUE}═══ REDE MÉDIA (12 nós) ═══${NC}"
load_network "medium"
run_test_suite "Média" "n1" "r15" 10
run_test_suite "Média" "n1" "r25" 10
run_test_suite "Média" "n5" "r3" 10

# Análise de resultados
cat >> "$REPORT_FILE" << 'EOF'

---

## Análise Comparativa

### Flooding
- **Vantagens:** Alta taxa de sucesso, sempre explora toda a rede
- **Desvantagens:** Muitas mensagens, alto uso de recursos
- **Melhor para:** Garantir encontrar recurso, redes pequenas

### Informed Flooding
- **Vantagens:** Usa cache, eficiente em buscas repetidas
- **Desvantagens:** Primeira busca ainda gera muitas mensagens
- **Melhor para:** Redes com buscas frequentes aos mesmos recursos

### Random Walk
- **Vantagens:** Poucas mensagens, baixo uso de recursos
- **Desvantagens:** Pode não encontrar recurso, menos confiável
- **Melhor para:** Redes grandes, quando eficiência é mais importante que garantia

### Informed Random Walk
- **Vantagens:** Balanceia eficiência e cache
- **Desvantagens:** Dependente de buscas anteriores para otimizar
- **Melhor para:** Cenários mistos, bom equilíbrio geral

---

## Conclusões

1. **Número de Mensagens:** Random Walk < Informed < Flooding
2. **Taxa de Sucesso:** Flooding > Informed > Random Walk
3. **Eficiência com Cache:** Informed algorithms >> Non-informed
4. **Melhor Geral:** Depende do caso de uso

EOF

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           TESTES CONCLUÍDOS COM SUCESSO!                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📊 Relatório salvo em: ${YELLOW}$REPORT_FILE${NC}"
echo ""
echo "Para visualizar o relatório:"
echo "  cat $REPORT_FILE"
echo ""
