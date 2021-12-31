import Edge from "./Edge";
import GenericNeurone from "./GenericNeurone";
import Params from "./Params";

const sigmoid = (x: number): number => {
  return 1.0 / (1.0 + Math.exp(-x));
};

export default class Neurone implements GenericNeurone {
  public out: number;
  public parents: Edge[];
  constructor(public id: number, public params: Params) {
    this.out = 0;
    this.parents = [];
  }
  addParent(weight: number, source: GenericNeurone) {
    this.parents.push({ weight, source });
  }
  set(x: number) {}
  get() {
    return this.out;
  }
  update(): void {
    const sum = this.parents.reduce<{ sum: number; weights: number }>(
      (acc: { sum: number; weights: number }, x: Edge) => {
        return {
          sum: acc.sum + x.weight * x.source.get(),
          weights: acc.weights + x.weight,
        };
      },
      { sum: 0, weights: 0 }
    );
    this.out = sigmoid(
      this.params.slope * (sum.sum / sum.weights - this.params.mid)
    );
  }
}
