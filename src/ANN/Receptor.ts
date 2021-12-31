import GenericNeurone from "./GenericNeurone";

export default class Receptor implements GenericNeurone {
  public out: number;

  constructor(public id: number, public parent: GenericNeurone) {
    this.out = 0;
  }
  set(x: number) {
    this.out = x;
  }
  get(): number {
    return this.out;
  }
  update() {
    this.out = this.parent.get();
  }
}
