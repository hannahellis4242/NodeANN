import { toDot } from "ts-graphviz";
import { Network } from "./ANN/Network";

const createTestBed1 = (): Network => {
  const network = new Network();
  const input1 = network.addPerceptron(1);
  const input2 = network.addPerceptron(2);
  const mid1 = network.addNeurone(
    [
      { parentId: input1, weight: 2 },
      { parentId: input2, weight: 4 },
    ],
    { mid: 2, slope: 10 }
  );
  const output1 = network.addReceptor(mid1);
  return network;
};

const network1 = createTestBed1();
console.log(toDot(network1.toGraph()));
network1.update();
console.log(toDot(network1.toGraph()));
