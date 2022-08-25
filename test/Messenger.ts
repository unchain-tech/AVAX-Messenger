import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Messenger", function () {
  async function deployContract() {
    // 初めのアドレスはコントラクトのデプロイに使用されます。
    const [owner, otherAccount] = await ethers.getSigners();

    const numOfPendingLimits = 5;

    const Messenger = await hre.ethers.getContractFactory("Messenger");
    const messenger = await Messenger.deploy(numOfPendingLimits);
    //const lock = await Lock.deploy(unlockTime, { value: lockedAmount }); //ガス代が必要なら付け足す

    return { messenger, numOfPendingLimits, owner, otherAccount };
  }

  it("Should set the right number of pending message limits", async function () {
    const { messenger, numOfPendingLimits } = await loadFixture(deployContract);

    expect(await messenger.numOfPendingLimits()).to.equal(numOfPendingLimits);
  });

  it("Should revert with the right error if called too soon", async function () {
    const { messenger, owner, otherAccount } = await loadFixture(
      deployContract
    );
  });
});
