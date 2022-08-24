import hre from "hardhat";

describe("Messenger", function () {
  it("construct", async function () {
    const Lock = await hre.ethers.getContractFactory("Messenger");
    const lock = await Lock.deploy();
  });
});
