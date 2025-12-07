const API_URL = 'http://localhost:3000';

class P2PApp {
    constructor() {
        this.visualizer = new NetworkVisualizer('#network-graph');
        this.currentNetwork = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Load network
        document.getElementById('loadNetwork').addEventListener('click', () => this.loadNetwork());

        // Search
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearSearch());

        // Controls
        document.getElementById('resetZoom').addEventListener('click', () => this.visualizer.resetZoom());
        document.getElementById('centerGraph').addEventListener('click', () => this.visualizer.centerGraph());
        document.getElementById('showLabels').addEventListener('change', (e) => {
            this.visualizer.toggleLabels(e.target.checked);
        });
        document.getElementById('showResources').addEventListener('change', (e) => {
            this.visualizer.toggleResources(e.target.checked);
        });

        // Network config selector
        document.getElementById('networkConfig').addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                this.showCustomConfigDialog();
            }
        });
    }

    async loadNetwork() {
        const configType = document.getElementById('networkConfig').value;

        if (!configType) {
            this.showStatus('Selecione uma configuração', 'error');
            return;
        }

        try {
            const configFile = configType === 'example' ? 'network-example.json' : 'network-small.json';
            const config = await this.fetchConfig(configFile);

            const response = await fetch(`${API_URL}/p2p/network/load`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors ? data.errors.join(', ') : data.message);
            }

            this.showStatus('Rede carregada com sucesso!', 'success');
            this.updateNetworkInfo(data.info);
            await this.loadGraphData();
        } catch (error) {
            this.showStatus(`Erro: ${error.message}`, 'error');
            console.error('Load network error:', error);
        }
    }

    async fetchConfig(filename) {
        const response = await fetch(`/config/${filename}`);
        if (!response.ok) {
            throw new Error('Failed to fetch config file');
        }
        return response.json();
    }

    async loadGraphData() {
        try {
            const response = await fetch(`${API_URL}/p2p/network/graph`);
            const data = await response.json();

            this.currentNetwork = data;
            this.visualizer.render(data);

            setTimeout(() => {
                this.visualizer.centerGraph();
            }, 100);
        } catch (error) {
            console.error('Load graph error:', error);
        }
    }

    updateNetworkInfo(info) {
        const infoDiv = document.getElementById('networkInfo');
        infoDiv.innerHTML = `
            <p><strong>Nós:</strong> ${info.nodeCount}</p>
            <p><strong>Min Vizinhos:</strong> ${info.minNeighbors}</p>
            <p><strong>Max Vizinhos:</strong> ${info.maxNeighbors}</p>
            <p><strong>Total Recursos:</strong> ${info.totalResources}</p>
        `;
    }

    async performSearch() {
        const startNode = document.getElementById('startNode').value.trim();
        const resourceId = document.getElementById('resourceId').value.trim();
        const ttl = parseInt(document.getElementById('ttl').value);
        const algorithm = document.getElementById('algorithm').value;

        if (!startNode || !resourceId) {
            alert('Preencha o nó inicial e o recurso');
            return;
        }

        if (!this.currentNetwork) {
            alert('Carregue uma rede primeiro');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/p2p/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    node_id: startNode,
                    resource_id: resourceId,
                    ttl: ttl,
                    algo: algorithm
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message);
            }

            this.displaySearchResults(data);
            this.visualizer.highlightSearch(data.result);
        } catch (error) {
            alert(`Erro na busca: ${error.message}`);
            console.error('Search error:', error);
        }
    }

    displaySearchResults(data) {
        const resultsDiv = document.getElementById('searchResults');
        const result = data.result;

        const algorithmName = this.getAlgorithmName(data.algorithm);
        const foundText = result.found ? '✅ Encontrado' : '❌ Não encontrado';
        const foundClass = result.found ? 'success' : 'error';

        resultsDiv.innerHTML = `
            <div class="result-header">
                <p><strong>Algoritmo:</strong> ${algorithmName}</p>
                <p class="${foundClass}"><strong>Status:</strong> ${foundText}</p>
            </div>
            <hr style="margin: 10px 0; border: none; border-top: 1px solid #ddd;">
            <p><strong>Recurso:</strong> ${result.resourceId}</p>
            ${result.found ? `<p><strong>Localização:</strong> ${result.locationNodeId}</p>` : ''}
            <p><strong>Mensagens:</strong> ${result.totalMessages}</p>
            <p><strong>Nós Visitados:</strong> ${result.totalNodesVisited}</p>
            ${result.path.length > 0 ? `<p><strong>Caminho:</strong> ${result.path.join(' → ')}</p>` : ''}
        `;
    }

    getAlgorithmName(algo) {
        const names = {
            'flooding': 'Flooding',
            'informed_flooding': 'Informed Flooding',
            'random_walk': 'Random Walk',
            'informed_random_walk': 'Informed Random Walk'
        };
        return names[algo] || algo;
    }

    clearSearch() {
        this.visualizer.resetHighlight();
        document.getElementById('searchResults').innerHTML = '<p class="placeholder">Nenhuma busca realizada</p>';
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('networkStatus');
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;

        setTimeout(() => {
            statusDiv.className = 'status';
        }, 5000);
    }

    showCustomConfigDialog() {
        // Placeholder for custom config
        alert('Recurso de configuração personalizada em desenvolvimento');
        document.getElementById('networkConfig').value = '';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new P2PApp();
});
