import GenericNeurone from "./GenericNeurone";

export default class Perceptron implements GenericNeurone {
  constructor(public id: number, public out: number) {}
  set(x: number) {
    this.out = x;
  }
  get(): number {
    return this.out;
  }
  update() {}
}
