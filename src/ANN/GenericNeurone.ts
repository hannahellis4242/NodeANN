export default interface GenericNeurone {
  out: number;
  id: number;
  get(): number;
  set(x: number): void;
  update(): void;
}
