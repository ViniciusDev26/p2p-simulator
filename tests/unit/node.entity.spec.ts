import { Node } from '../../src/domain/entities/node.entity';
import { Resource } from '../../src/domain/entities/resource.entity';

describe('Node Entity', () => {
  let node: Node;

  beforeEach(() => {
    node = new Node('n1');
  });

  describe('constructor', () => {
    it('should create a node with an id', () => {
      expect(node.id).toBe('n1');
      expect(node.getNeighborCount()).toBe(0);
      expect(node.getResourceCount()).toBe(0);
    });
  });

  describe('neighbors', () => {
    it('should add a neighbor', () => {
      node.addNeighbor('n2');
      expect(node.getNeighborCount()).toBe(1);
      expect(node.hasNeighbor('n2')).toBe(true);
    });

    it('should not add duplicate neighbors', () => {
      node.addNeighbor('n2');
      node.addNeighbor('n2');
      expect(node.getNeighborCount()).toBe(1);
    });

    it('should throw error when adding self as neighbor', () => {
      expect(() => node.addNeighbor('n1')).toThrow('Cannot add self as neighbor');
    });

    it('should remove a neighbor', () => {
      node.addNeighbor('n2');
      node.removeNeighbor('n2');
      expect(node.getNeighborCount()).toBe(0);
      expect(node.hasNeighbor('n2')).toBe(false);
    });

    it('should get all neighbors', () => {
      node.addNeighbor('n2');
      node.addNeighbor('n3');
      const neighbors = node.getNeighbors();
      expect(neighbors).toHaveLength(2);
      expect(neighbors).toContain('n2');
      expect(neighbors).toContain('n3');
    });
  });

  describe('resources', () => {
    it('should add a resource', () => {
      const resource = new Resource('r1', 'n1');
      node.addResource(resource);
      expect(node.getResourceCount()).toBe(1);
      expect(node.hasResource('r1')).toBe(true);
    });

    it('should get a resource', () => {
      const resource = new Resource('r1', 'n1');
      node.addResource(resource);
      const retrieved = node.getResource('r1');
      expect(retrieved).toBe(resource);
    });

    it('should return undefined for non-existent resource', () => {
      expect(node.getResource('r99')).toBeUndefined();
    });

    it('should get all resources', () => {
      const r1 = new Resource('r1', 'n1');
      const r2 = new Resource('r2', 'n1');
      node.addResource(r1);
      node.addResource(r2);
      const resources = node.getResources();
      expect(resources).toHaveLength(2);
      expect(resources).toContain(r1);
      expect(resources).toContain(r2);
    });
  });

  describe('cache', () => {
    it('should update cache', () => {
      node.updateCache('r1', 'n2');
      expect(node.getCachedLocation('r1')).toBe('n2');
    });

    it('should return undefined for non-cached resource', () => {
      expect(node.getCachedLocation('r99')).toBeUndefined();
    });

    it('should clear cache', () => {
      node.updateCache('r1', 'n2');
      node.clearCache();
      expect(node.getCachedLocation('r1')).toBeUndefined();
    });
  });
});
