import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("SplitWiseGroup contract", function () {
  let owner: SignerWithAddress,
    member1: SignerWithAddress,
    member2: SignerWithAddress,
    member3: SignerWithAddress,
    member4: SignerWithAddress,
    member5: SignerWithAddress,
    splitWiseGroup: Contract;

  const REQUIRED_ETHER_AMOUNT = "1";

  before(async () => {
    [owner, member1, member2, member3, member4, member5] =
      await ethers.getSigners();

    const SplitWiseGroup = await ethers.getContractFactory("SplitWiseGroup");
    splitWiseGroup = await SplitWiseGroup.deploy(
      ethers.utils.parseEther(REQUIRED_ETHER_AMOUNT),
      [member1.address, member2.address, member3.address, member4.address],
      owner.address,
    );
    await splitWiseGroup.deployed();
  });

  describe("Deployment", function () {
    it("Should set the owner correctly", async function () {
      expect(await splitWiseGroup.owner()).to.equal(owner.address);
    });

    it("Should set the required amount correctly", async function () {
      expect(await splitWiseGroup.requiredAmount()).to.equal(
        ethers.utils.parseEther("1"),
      );
    });

    it("Should initialize with isOpen as true", async function () {
      expect(await splitWiseGroup.isSettled()).to.equal(false);
    });

    it("Should add owner as active member during deployment", async function () {
      expect(await splitWiseGroup.isMember(owner.address)).to.equal(true);
      expect(await splitWiseGroup.getActiveMember(0)).to.equal(owner.address);
    });

    it("Should add members to the whitelist during deployment", async function () {
      expect(await splitWiseGroup.isWhitelisted(member1.address)).to.equal(
        true,
      );
      expect(await splitWiseGroup.isWhitelisted(member2.address)).to.equal(
        true,
      );
    });
  });

  describe("Joining the group", function () {
    it("Should allow members to join the group with the required amount", async function () {
      await splitWiseGroup
        .connect(member1)
        .join({ value: ethers.utils.parseEther("1") });
      await splitWiseGroup
        .connect(member2)
        .join({ value: ethers.utils.parseEther("1") });
      await splitWiseGroup
        .connect(member4)
        .join({ value: ethers.utils.parseEther("1") });

      expect(await splitWiseGroup.isMember(member1.address)).to.equal(true);
      expect(await splitWiseGroup.isMember(member2.address)).to.equal(true);
      expect(await splitWiseGroup.isMember(member4.address)).to.equal(true);
    });

    it("Should not allow members to join without sending the required amount", async function () {
      await expect(
        splitWiseGroup
          .connect(member3)
          .join({ value: ethers.utils.parseEther("0.5") }),
      ).to.be.revertedWith("You must send the required amount to join");
    });

    it("Should not allow members to join if already a member", async function () {
      await expect(
        splitWiseGroup
          .connect(member1)
          .join({ value: ethers.utils.parseEther("1") }),
      ).to.be.revertedWith("You are already a member");
    });
  });

  describe("Remove members from the group", function () {
    it("Should allow the owner to remove an active member", async function () {
      // Ensure member1 is an active member
      expect(await splitWiseGroup.isMember(member4.address)).to.be.true;

      // Get the initial length of the activeMembers array
      const initialActiveMembersLength =
        await splitWiseGroup.getActiveMembersCount();

      // Remove member4 from the group
      await splitWiseGroup.removeMember(member4.address);

      // Ensure member4 is no longer an active member
      expect(await splitWiseGroup.isMember(member4.address)).to.be.false;

      // Check if member4's stake is cleared
      expect(await splitWiseGroup.stakes(member4.address)).to.equal(0);

      // Check if member4 is removed from the activeMembers array
      const finalActiveMembersLength =
        await splitWiseGroup.getActiveMembersCount();
      expect(finalActiveMembersLength).to.equal(
        initialActiveMembersLength.sub(1),
      );
    });

    it("Should not allow the owner to remove a non-member address", async function () {
      // Attempt to remove the owner (deployer)
      await expect(
        splitWiseGroup.removeMember(member5.address),
      ).to.be.revertedWith("The address is not a member");

      // Ensure the owner is still an active member
      expect(await splitWiseGroup.isMember(member5.address)).to.be.false;
    });

    it("Should not allow non-owners to remove a member", async function () {
      // Attempt to remove member2 as a non-owner (member1)
      await expect(
        splitWiseGroup.connect(member1).removeMember(member2.address),
      ).to.be.revertedWith("Only the owner can call this function");

      // Ensure member2 is still an active member
      expect(await splitWiseGroup.isMember(member2.address)).to.be.true;
    });
  });

  describe("Settling the group", function () {
    it("Should allow the owner to settle the group and distribute evenly", async function () {
      const tx = await splitWiseGroup.settleGroup();

      await expect(tx).to.changeEtherBalance(
        member1,
        ethers.utils.parseEther("1"),
      );
      await expect(tx).to.changeEtherBalance(
        member2,
        ethers.utils.parseEther("1"),
      );
      expect(await splitWiseGroup.isSettled()).to.equal(true);
    });

    it("Should not allow settling the group multiple times", async function () {
      await expect(splitWiseGroup.settleGroup()).to.be.revertedWith(
        "The group is closed",
      );
    });
  });

  // Add more test cases as needed for other contract functions.
});
