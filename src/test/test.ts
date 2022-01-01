import { toDot } from "ts-graphviz";
import { Network } from "../ANN/Network";
import { expect } from "chai";
import { describe } from "mocha";

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

describe("test", () => {
  const network1 = createTestBed1();
  //console.log(toDot(network1.toGraph()));
  //console.log("\n-----------------\n");
  network1.update();
  ///console.log(toDot(network1.toGraph()));

  it("should have only one output node", () => {
    expect(network1.outputs).to.have.length(1);
  });
  it("should have the correct output", () => {
    expect(network1.outputs[0])
      .to.have.property("out")
      .approximately(0.034445, 0.000001);
  });
});
