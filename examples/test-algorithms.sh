#!/bin/bash

# Script para testar e comparar algoritmos de busca P2P

API_URL="http://localhost:3000"
CONFIG_FILE="config/network-example.json"

echo "==================================="
echo "  Teste de Algoritmos P2P"
echo "==================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Carregar a rede
echo -e "${BLUE}1. Carregando a rede...${NC}"
LOAD_RESULT=$(curl -s -X POST "$API_URL/p2p/network/load" \
  -H "Content-Type: application/json" \
  -d @"$CONFIG_FILE")

echo "$LOAD_RESULT" | jq '.'
echo ""

# Verificar se carregou com sucesso
if echo "$LOAD_RESULT" | jq -e '.message | contains("success")' > /dev/null; then
  echo -e "${GREEN}✓ Rede carregada com sucesso${NC}"
else
  echo -e "${YELLOW}✗ Erro ao carregar a rede${NC}"
  exit 1
fi
echo ""

# 2. Obter informações da rede
echo -e "${BLUE}2. Informações da rede:${NC}"
curl -s "$API_URL/p2p/network/info" | jq '.'
echo ""

# 3. Testar todos os algoritmos
echo -e "${BLUE}3. Testando algoritmos de busca...${NC}"
echo ""

NODE_ID="n1"
RESOURCE_ID="r15"
TTL=10

ALGORITHMS=("flooding" "informed_flooding" "random_walk" "informed_random_walk")

echo "Buscando recurso '$RESOURCE_ID' a partir do nó '$NODE_ID' com TTL=$TTL"
echo ""
echo "----------------------------------------"

for ALGO in "${ALGORITHMS[@]}"; do
  echo -e "${YELLOW}Algoritmo: $ALGO${NC}"

  RESULT=$(curl -s -X POST "$API_URL/p2p/search" \
    -H "Content-Type: application/json" \
    -d "{
      \"node_id\": \"$NODE_ID\",
      \"resource_id\": \"$RESOURCE_ID\",
      \"ttl\": $TTL,
      \"algo\": \"$ALGO\"
    }")

  # Extrair métricas
  FOUND=$(echo "$RESULT" | jq -r '.result.found')
  MESSAGES=$(echo "$RESULT" | jq -r '.result.totalMessages')
  NODES_VISITED=$(echo "$RESULT" | jq -r '.result.totalNodesVisited')
  LOCATION=$(echo "$RESULT" | jq -r '.result.locationNodeId')

  if [ "$FOUND" = "true" ]; then
    echo -e "  ${GREEN}✓ Encontrado${NC} em $LOCATION"
  else
    echo -e "  ${YELLOW}✗ Não encontrado${NC}"
  fi

  echo "  Mensagens: $MESSAGES"
  echo "  Nós visitados: $NODES_VISITED"
  echo ""
done

echo "----------------------------------------"
echo ""

# 4. Comparação detalhada
echo -e "${BLUE}4. Comparação detalhada:${NC}"
echo ""

echo "| Algoritmo                  | Encontrado | Mensagens | Nós Visitados |"
echo "|----------------------------|------------|-----------|---------------|"

for ALGO in "${ALGORITHMS[@]}"; do
  RESULT=$(curl -s -X POST "$API_URL/p2p/search" \
    -H "Content-Type: application/json" \
    -d "{
      \"node_id\": \"$NODE_ID\",
      \"resource_id\": \"$RESOURCE_ID\",
      \"ttl\": $TTL,
      \"algo\": \"$ALGO\"
    }")

  FOUND=$(echo "$RESULT" | jq -r '.result.found')
  MESSAGES=$(echo "$RESULT" | jq -r '.result.totalMessages')
  NODES_VISITED=$(echo "$RESULT" | jq -r '.result.totalNodesVisited')

  FOUND_SYMBOL="✗"
  if [ "$FOUND" = "true" ]; then
    FOUND_SYMBOL="✓"
  fi

  printf "| %-26s | %-10s | %-9s | %-13s |\n" "$ALGO" "$FOUND_SYMBOL" "$MESSAGES" "$NODES_VISITED"
done

echo ""
echo -e "${GREEN}Teste concluído!${NC}"
