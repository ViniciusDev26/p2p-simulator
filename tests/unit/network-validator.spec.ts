import { NetworkValidator } from '../../src/validators/network-validator';
import { Network } from '../../src/domain/entities/network.entity';
import { Node } from '../../src/domain/entities/node.entity';
import { Resource } from '../../src/domain/entities/resource.entity';

describe('NetworkValidator', () => {
  let validator: NetworkValidator;

  beforeEach(() => {
    validator = new NetworkValidator();
  });

  describe('valid network', () => {
    it('should validate a correct network', () => {
      const network = new Network(2, 3);

      const n1 = new Node('n1');
      const n2 = new Node('n2');
      const n3 = new Node('n3');

      n1.addResource(new Resource('r1', 'n1'));
      n2.addResource(new Resource('r2', 'n2'));
      n3.addResource(new Resource('r3', 'n3'));

      network.addNode(n1);
      network.addNode(n2);
      network.addNode(n3);

      network.addEdge('n1', 'n2');
      network.addEdge('n2', 'n3');
      network.addEdge('n1', 'n3');

      const result = validator.validate(network);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('partitioned network', () => {
    it('should detect partitioned network', () => {
      const network = new Network(1, 2);

      const n1 = new Node('n1');
      const n2 = new Node('n2');
      const n3 = new Node('n3');
      const n4 = new Node('n4');

      [n1, n2, n3, n4].forEach((n) => n.addResource(new Resource('r1', n.id)));

      network.addNode(n1);
      network.addNode(n2);
      network.addNode(n3);
      network.addNode(n4);

      network.addEdge('n1', 'n2');
      network.addEdge('n3', 'n4');

      const result = validator.validate(network);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('partitioned'))).toBe(true);
    });
  });

  describe('neighbor limits', () => {
    it('should detect node with too few neighbors', () => {
      const network = new Network(2, 3);

      const n1 = new Node('n1');
      const n2 = new Node('n2');

      n1.addResource(new Resource('r1', 'n1'));
      n2.addResource(new Resource('r2', 'n2'));

      network.addNode(n1);
      network.addNode(n2);
      network.addEdge('n1', 'n2');

      const result = validator.validate(network);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('minimum'))).toBe(true);
    });

    it('should detect node with too many neighbors', () => {
      const network = new Network(1, 2);

      const n1 = new Node('n1');
      const n2 = new Node('n2');
      const n3 = new Node('n3');
      const n4 = new Node('n4');

      [n1, n2, n3, n4].forEach((n) => n.addResource(new Resource('r1', n.id)));

      network.addNode(n1);
      network.addNode(n2);
      network.addNode(n3);
      network.addNode(n4);

      network.addEdge('n1', 'n2');
      network.addEdge('n1', 'n3');
      network.addEdge('n1', 'n4');

      const result = validator.validate(network);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('maximum'))).toBe(true);
    });
  });

  describe('resources', () => {
    it('should detect node without resources', () => {
      const network = new Network(1, 2);

      const n1 = new Node('n1');
      const n2 = new Node('n2');

      n1.addResource(new Resource('r1', 'n1'));

      network.addNode(n1);
      network.addNode(n2);
      network.addEdge('n1', 'n2');

      const result = validator.validate(network);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('no resources'))).toBe(true);
    });
  });

  describe('self-loops', () => {
    it('should detect self-loop', () => {
      const network = new Network(1, 2);
      const n1 = new Node('n1');
      n1.addResource(new Resource('r1', 'n1'));
      network.addNode(n1);

      expect(() => n1.addNeighbor('n1')).toThrow();
    });
  });
});
