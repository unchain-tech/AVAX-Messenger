import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// なぜdeploy時のvalueを渡せないのか
// deploy時に渡すことができれば引き出しができるか
// コメントアウトしている部分, getOwnMessagesを受け取りたい
// amountが使えるようになったらそれをreturnして返すようにする

describe("Messenger", function () {
  async function deployContract() {
    // 初めのアドレスはコントラクトのデプロイに使用されます。
    const [owner, otherAccount] = await ethers.getSigners();

    const numOfPendingLimits = 5;

    const Messenger = await hre.ethers.getContractFactory("Messenger");
    //const messenger = await Messenger.deploy(numOfPendingLimits, {
    //  value: 100,
    //});
    const messenger = await Messenger.deploy(numOfPendingLimits);

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

  describe("Change limits", function () {
    it("Should revert with the right error if called by other account", async function () {
      const { messenger, numOfPendingLimits, otherAccount } = await loadFixture(
        deployContract
      );

      await expect(
        messenger.connect(otherAccount).changeNumOfPendingLimits(5)
      ).to.be.revertedWith("You aren't the owner");
    });

    it("Should set the right pending limits", async function () {
      const { messenger, numOfPendingLimits } = await loadFixture(
        deployContract
      );

      const newLimits = numOfPendingLimits + 1;
      await messenger.changeNumOfPendingLimits(newLimits);
      expect(await messenger.numOfPendingLimits()).to.equal(newLimits);
    });
  });

  describe("Post", function () {
    it("Should emit an event on post", async function () {
      const { messenger, otherAccount } = await loadFixture(deployContract);

      await expect(
        messenger.post("first message", otherAccount.address, { value: 1 })
      ).to.emit(messenger, "NewMessage");
    });

    //it("Should set the right Message", async function () {
    //  const { messenger, numOfPendingLimits, otherAccount } = await loadFixture(
    //    deployContract
    //  );

    //  await messenger.post("first message", otherAccount.address, { value: 1 });
    //  const message = await messenger.getOwnMessages();
    //  console.log("====>", message);
    //  expect(message[0].depositInWei).to.equal(1);
    //});
  });

  describe("Post", function () {
    it("Should set the right Message", async function () {
      const { messenger, numOfPendingLimits, otherAccount } = await loadFixture(
        deployContract
      );

      await messenger.post("first message", otherAccount.address, { value: 1 });
      await messenger.connect(otherAccount).accept(0);
      await expect(messenger.connect(otherAccount).accept(0)).to.emit(
        messenger,
        "NewMessage"
      );
    });
  });
});
