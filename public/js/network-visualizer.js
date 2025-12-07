class NetworkVisualizer {
    constructor(svgSelector) {
        this.svg = d3.select(svgSelector);
        this.width = 0;
        this.height = 0;
        this.simulation = null;
        this.graphData = null;
        this.showLabels = true;
        this.showResources = false;

        this.initSVG();
    }

    initSVG() {
        const container = this.svg.node().parentElement;
        this.width = container.clientWidth - 40;
        this.height = container.clientHeight - 40;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });

        this.svg.call(zoom);

        // Main group
        this.g = this.svg.append('g');

        // Groups for links and nodes
        this.linkGroup = this.g.append('g').attr('class', 'links');
        this.nodeGroup = this.g.append('g').attr('class', 'nodes');

        // Store zoom behavior for reset
        this.zoom = zoom;
    }

    render(data) {
        this.graphData = data;

        // Clear existing elements
        this.linkGroup.selectAll('*').remove();
        this.nodeGroup.selectAll('*').remove();

        if (!data || !data.nodes || data.nodes.length === 0) {
            return;
        }

        // Create force simulation
        this.simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links)
                .id(d => d.id)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(40));

        // Create links
        const link = this.linkGroup
            .selectAll('line')
            .data(data.links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', '#999')
            .attr('stroke-width', 2);

        // Create nodes
        const node = this.nodeGroup
            .selectAll('g')
            .data(data.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', (event, d) => this.dragStarted(event, d))
                .on('drag', (event, d) => this.dragging(event, d))
                .on('end', (event, d) => this.dragEnded(event, d)));

        // Add circles to nodes
        node.append('circle')
            .attr('r', 20)
            .attr('fill', '#3b82f6')
            .attr('stroke', '#1e40af')
            .attr('stroke-width', 2);

        // Add labels to nodes
        const labels = node.append('text')
            .attr('dy', 5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => d.id)
            .style('display', this.showLabels ? 'block' : 'none');

        // Add resource count badge with background
        const resourceBadge = node.filter(d => d.resources.length > 0)
            .append('g')
            .attr('class', 'resource-badge');

        // Add circle background for badge
        resourceBadge.append('circle')
            .attr('cx', 15)
            .attr('cy', -15)
            .attr('r', 10)
            .attr('fill', '#ef4444')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Add count text
        resourceBadge.append('text')
            .attr('x', 15)
            .attr('y', -15)
            .attr('dy', 4)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .text(d => d.resources.length);

        // Add tooltips
        node.append('title')
            .text(d => `${d.id}\nRecursos: ${d.resources.join(', ') || 'nenhum'}\nVizinhos: ${d.neighbors}`);

        // Update positions on tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        this.nodes = node;
        this.links = link;
        this.labels = labels;
    }

    highlightSearch(result) {
        if (!result || !this.nodes) return;

        // Reset all nodes
        this.resetHighlight();

        const visitedSet = new Set(result.visitedNodes || []);
        const pathSet = new Set(result.path || []);

        // Highlight nodes
        this.nodes.select('circle')
            .attr('fill', d => {
                if (d.id === result.locationNodeId) return '#ef4444'; // Found
                if (d.id === result.path[0]) return '#10b981'; // Start
                if (visitedSet.has(d.id)) return '#f59e0b'; // Visited
                return '#3b82f6'; // Normal
            })
            .attr('r', d => {
                if (d.id === result.locationNodeId) return 25;
                if (d.id === result.path[0]) return 25;
                return 20;
            });

        // Highlight path
        if (result.path && result.path.length > 1) {
            this.highlightPath(result.path);
        }

        // Animate visited nodes
        this.animateVisitedNodes(result.visitedNodes || []);
    }

    highlightPath(path) {
        const pathLinks = [];
        for (let i = 0; i < path.length - 1; i++) {
            pathLinks.push({ source: path[i], target: path[i + 1] });
        }

        this.links.attr('class', d => {
            const isInPath = pathLinks.some(pl =>
                (pl.source === d.source.id && pl.target === d.target.id) ||
                (pl.source === d.target.id && pl.target === d.source.id)
            );
            return isInPath ? 'link link-highlight' : 'link';
        });
    }

    animateVisitedNodes(visitedNodes) {
        visitedNodes.forEach((nodeId, index) => {
            setTimeout(() => {
                this.nodes.filter(d => d.id === nodeId)
                    .select('circle')
                    .transition()
                    .duration(300)
                    .attr('r', 25)
                    .transition()
                    .duration(300)
                    .attr('r', 20);
            }, index * 100);
        });
    }

    resetHighlight() {
        if (!this.nodes || !this.links) return;

        this.nodes.select('circle')
            .attr('fill', '#3b82f6')
            .attr('r', 20);

        this.links.attr('class', 'link');
    }

    toggleLabels(show) {
        this.showLabels = show;
        if (this.labels) {
            this.labels.style('display', show ? 'block' : 'none');
        }
    }

    toggleResources(show) {
        this.showResources = show;
        // Implementation for showing resources can be added
    }

    resetZoom() {
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);
    }

    centerGraph() {
        if (!this.graphData || !this.graphData.nodes) return;

        const bounds = this.g.node().getBBox();
        const fullWidth = this.width;
        const fullHeight = this.height;
        const width = bounds.width;
        const height = bounds.height;
        const midX = bounds.x + width / 2;
        const midY = bounds.y + height / 2;

        const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
        const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity
                .translate(translate[0], translate[1])
                .scale(scale));
    }

    dragStarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragging(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragEnded(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
