import { attribute, Digraph, digraph, Node } from "ts-graphviz";
import GenericNeurone from "./GenericNeurone";
import Neurone from "./Neurone";
import Params from "./Params";
import Perceptron from "./Perceptron";
import Receptor from "./Receptor";

interface GraphToNodeEntry {
  network: GenericNeurone;
  graphNode: Node;
}

const findGraphNode = (
  id: number,
  map: GraphToNodeEntry[]
): Node | undefined => {
  const entry = map.find(({ network }) => network.id == id);
  if (entry) {
    return entry.graphNode;
  }
  return undefined;
};

export class Network {
  public nodes: GenericNeurone[];
  public inputs: Perceptron[];
  public inner: Neurone[];
  public outputs: Receptor[];
  constructor() {
    this.nodes = [];
    this.inputs = [];
    this.inner = [];
    this.outputs = [];
  }
  private getNextId(): number {
    return (
      this.nodes.reduce<number>((acc: number, node: GenericNeurone) => {
        return node.id > acc ? node.id : acc;
      }, -1) + 1
    );
  }

  private findNode(id: number): GenericNeurone | undefined {
    return this.nodes.find((node) => {
      return node.id == id;
    });
  }

  addPerceptron(value: number): number {
    const nextId = this.getNextId();
    const node = new Perceptron(nextId, value);
    this.nodes.push(node);
    this.inputs.push(node);
    return nextId;
  }

  addReceptor(parentId: number): number | undefined {
    const parentNode = this.findNode(parentId);
    if (parentNode) {
      const nextId = this.getNextId();
      const node = new Receptor(nextId, parentNode);
      this.nodes.push(node);
      this.outputs.push(node);
      return nextId;
    }
    return undefined;
  }

  addNeurone(
    weights: { parentId: number; weight: number }[],
    p: Params
  ): number {
    const nextId = this.getNextId();
    const node = new Neurone(nextId, p);
    weights.forEach(({ parentId, weight }) => {
      const parentNode = this.findNode(parentId);
      if (parentNode) {
        node.addParent(weight, parentNode);
      }
    });
    this.nodes.push(node);
    this.inner.push(node);
    return nextId;
  }

  private updateRecusive(done: boolean, valve: number): boolean {
    if (done || valve < 0) {
      return done;
    } else {
      const cycleDone = this.nodes.reduce<boolean>(
        (acc: boolean, node: GenericNeurone) => {
          const prev = node.get();
          node.update();
          const cur = node.get();
          return acc || cur != prev;
        },
        false
      );
      return this.updateRecusive(cycleDone, valve - 1);
    }
  }

  update(): boolean {
    return this.updateRecusive(false, this.nodes.length * 2);
  }

  toGraph(): Digraph {
    let map: { network: GenericNeurone; graphNode: Node }[] = [];
    return digraph("network", (g) => {
      //add vertices
      {
        //add all input nodes to graph and map
        this.inputs.map((input) => {
          const id = input.id.toString();
          const n = g.node(id, {
            [attribute.label]:
              "{input|id : " + id + "| out : " + input.out.toString() + "}",
            [attribute.shape]: "record",
          });
          map.push({ network: input, graphNode: n });
        });
        //add all inner nodes to graph and map
        this.inner.forEach((node) => {
          const id = node.id.toString();
          const n = g.node(id, {
            [attribute.label]:
              "{id : " +
              id +
              "|{mid : " +
              node.params.mid.toString() +
              " | slope : " +
              node.params.slope.toString() +
              "}}",
            [attribute.shape]: "record",
          });
          map.push({ network: node, graphNode: n });
        });
        //add all output nodes to graph and map
        this.outputs.forEach((output) => {
          const id = output.id.toString();
          const n = g.node(id, {
            [attribute.label]:
              "{output|id : " + id + "| out : " + output.out.toString() + "}",
            [attribute.shape]: "record",
          });
          map.push({ network: output, graphNode: n });
        });
      }
      //add edges
      {
        //add edges for neurones
        this.inner.forEach((node) => {
          const u = findGraphNode(node.id, map);
          if (u) {
            node.parents.forEach((parent) => {
              const v = findGraphNode(parent.source.id, map);
              if (v) {
                g.edge([v, u], { [attribute.label]: parent.weight });
              }
            });
          }
        });
        //add edges for outputs
        this.outputs.forEach((node) => {
          const u = findGraphNode(node.id, map);
          if (u) {
            const v = findGraphNode(node.parent.id, map);
            if (v) {
              g.edge([v, u]);
            }
          }
        });
      }
    });
  }
}
