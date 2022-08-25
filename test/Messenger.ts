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

  describe("Deployment", function () {
    it("Should set the right number of pending message limits", async function () {
      const { messenger, numOfPendingLimits } = await loadFixture(
        deployContract
      );

      expect(await messenger.numOfPendingLimits()).to.equal(numOfPendingLimits);
    });

    it("Should set the right owner", async function () {
      const { messenger, owner } = await loadFixture(deployContract);

      expect(await messenger.owner()).to.equal(owner.address);
    });
  });

  describe("Post", function () {
    it("Should set the right number of pending message limits", async function () {
      const { messenger, numOfPendingLimits, otherAccount } = await loadFixture(
        deployContract
      );

      await expect(
        messenger.post("first message", otherAccount.address, { value: 1 })
      ).to.emit(messenger, "NewMessage");
    });
  });
});
