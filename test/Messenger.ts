import hre, { ethers } from "hardhat";
const { expect } = require("chai");

describe("Messenger", function () {
  it("construct", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const Messenger = await hre.ethers.getContractFactory("Messenger");
    const messenger = await Messenger.deploy();

    expect(await messenger.owner()).to.equal(owner.address);
  });
});
