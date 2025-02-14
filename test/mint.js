const chai = require("chai");
const { expect } = chai;
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
describe("PodCastNFT free mint", function () {
  let Contract, contract;

  beforeEach(async function () {
    Contract = await ethers.getContractFactory("PodCastNFT");
  });

  it("can mint for admin", async function () {
    const [owner, user1] = await ethers.getSigners();
    contract = await Contract.deploy([owner.address], false);
    await contract.deployed();

    const mintTx = await contract.mint(
      "https://example.com/podcast.png",
      "Podcast Contributor",
      "",
      "10000",
      user1.address
    );
    await mintTx.wait();
    expect(await contract.ownerOf(1)).to.be.equal(user1.address);
  });

  it("users have community Membership", async function () {
    const [owner, user1, user2] = await ethers.getSigners();
    contract = await Contract.deploy([owner.address], false);
    await contract.deployed();

    let mintTx = await contract.mint(
      "https://example.com/podcast.png",
      "Podcast Contributor",
      "",
      "10000",
      user1.address
    );
    await mintTx.wait();

    mintTx = await contract.mint(
      "https://example.com/podcast.png",
      "Podcast Contributor",
      "Henkaku Community Member",
      "10000",
      user2.address
    );
    await mintTx.wait();

    expect(await contract.isCommunityMember(1)).to.be.equal(false);
    expect(await contract.isCommunityMember(2)).to.be.equal(true);
  });

  it("cannot mint twice for the same user(owner)", async function () {
    const [owner, user1] = await ethers.getSigners();
    contract = await Contract.deploy([owner.address], false);
    await contract.deployed();

    const mintTx = await contract.mint(
      "https://example.com/podcast.png",
      "Podcast Contributor",
      "",
      "10000",
      user1.address
    );
    await mintTx.wait();

    await expect(
        contract.mint(
          "https://example.com/podcast.png",
          "Podcast Contributor",
          "epic",
          "10000",
          user1.address
        )
    ).eventually.to.rejectedWith(Error)
  });
});
