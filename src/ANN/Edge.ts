import GenericNeurone from "./GenericNeurone";

export default interface Edge {
  weight: number;
  source: GenericNeurone;
}
