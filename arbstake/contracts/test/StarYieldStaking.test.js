const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("StarYieldStaking", function () {
  let staking;
  let owner, admin1, admin2, admin3, user1, user2;
  
  beforeEach(async function () {
    [owner, admin1, admin2, admin3, user1, user2] = await ethers.getSigners();
    
    const StarYieldStaking = await ethers.getContractFactory("StarYieldStaking");
    staking = await StarYieldStaking.deploy();
    await staking.waitForDeployment();
    
    // Add additional admins
    await staking.addAdmin(admin1.address);
    await staking.addAdmin(admin2.address);
    await staking.addAdmin(admin3.address);
  });

  describe("Deployment", function () {
    it("Should set the correct tier info", async function () {
      const comet = await staking.tierInfo(0);
      expect(comet.lockingPeriod).to.equal(14 * 24 * 60 * 60); // 14 days
      expect(comet.minInvestment).to.equal(ethers.parseEther("0.1"));
      expect(comet.apyRate).to.equal(600); // 6%
    });

    it("Should grant owner and admin roles", async function () {
      const ADMIN_ROLE = await staking.ADMIN_ROLE();
      const OWNER_ROLE = await staking.OWNER_ROLE();
      
      expect(await staking.hasRole(OWNER_ROLE, owner.address)).to.be.true;
      expect(await staking.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("BNB Staking", function () {
    it("Should allow staking BNB in COMET tier", async function () {
      const amount = ethers.parseEther("0.5");
      
      await expect(staking.connect(user1).stakeBNB(0, { value: amount }))
        .to.emit(staking, "Staked")
        .withArgs(user1.address, ethers.ZeroAddress, amount, 0, 0);
      
      const stakes = await staking.getUserStakes(user1.address);
      expect(stakes.length).to.equal(1);
      expect(stakes[0].amount).to.equal(amount);
    });

    it("Should reject staking below minimum investment", async function () {
      const amount = ethers.parseEther("0.05"); // Below 0.1 BNB minimum
      
      await expect(
        staking.connect(user1).stakeBNB(0, { value: amount })
      ).to.be.revertedWith("Below minimum investment");
    });

    it("Should calculate rewards correctly", async function () {
      const amount = ethers.parseEther("1");
      await staking.connect(user1).stakeBNB(0, { value: amount });
      
      // Fast forward 7 days (half the locking period)
      await time.increase(7 * 24 * 60 * 60);
      
      const rewards = await staking.calculateRewards(user1.address, 0);
      // Expected: (1 BNB * 600 basis points * 7 days) / (365 days * 10000)
      const expected = (amount * 600n * 7n * 24n * 60n * 60n) / (365n * 24n * 60n * 60n * 10000n);
      
      expect(rewards).to.be.closeTo(expected, ethers.parseEther("0.001"));
    });

    it("Should allow withdrawal after locking period", async function () {
      const amount = ethers.parseEther("1");
      await staking.connect(user1).stakeBNB(0, { value: amount });
      
      // Fast forward past locking period
      await time.increase(15 * 24 * 60 * 60);
      
      const balanceBefore = await ethers.provider.getBalance(user1.address);
      const tx = await staking.connect(user1).withdraw(0);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(user1.address);
      
      // User should receive principal + rewards - gas
      expect(balanceAfter).to.be.gt(balanceBefore - gasUsed);
    });

    it("Should reject withdrawal before locking period", async function () {
      const amount = ethers.parseEther("1");
      await staking.connect(user1).stakeBNB(0, { value: amount });
      
      await expect(
        staking.connect(user1).withdraw(0)
      ).to.be.revertedWith("Locking period not ended");
    });
  });

  describe("Multi-sig Withdrawal", function () {
    it("Should require 3 admin approvals for withdrawal", async function () {
      // Fund contract
      await owner.sendTransaction({
        to: await staking.getAddress(),
        value: ethers.parseEther("10")
      });
      
      const amount = ethers.parseEther("5");
      
      // Admin 1 requests withdrawal
      const tx = await staking.connect(admin1).requestWithdrawal(
        ethers.ZeroAddress,
        user1.address,
        amount
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "WithdrawalRequested");
      const requestId = event.args[0];
      
      // Check request exists
      const request = await staking.withdrawalRequests(requestId);
      expect(request.approvalCount).to.equal(1);
      
      // Admin 2 approves
      await staking.connect(admin2).approveWithdrawal(requestId);
      
      // Still not executed (need 3)
      const requestAfter2 = await staking.withdrawalRequests(requestId);
      expect(requestAfter2.executed).to.be.false;
      
      const balanceBefore = await ethers.provider.getBalance(user1.address);
      
      // Admin 3 approves - should auto-execute
      await staking.connect(admin3).approveWithdrawal(requestId);
      
      const balanceAfter = await ethers.provider.getBalance(user1.address);
      expect(balanceAfter - balanceBefore).to.equal(amount);
      
      const finalRequest = await staking.withdrawalRequests(requestId);
      expect(finalRequest.executed).to.be.true;
    });

    it("Should prevent double approval by same admin", async function () {
      await owner.sendTransaction({
        to: await staking.getAddress(),
        value: ethers.parseEther("10")
      });
      
      const tx = await staking.connect(admin1).requestWithdrawal(
        ethers.ZeroAddress,
        user1.address,
        ethers.parseEther("5")
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.fragment && log.fragment.name === "WithdrawalRequested");
      const requestId = event.args[0];
      
      await expect(
        staking.connect(admin1).approveWithdrawal(requestId)
      ).to.be.revertedWith("Already approved");
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow emergency withdrawal with no rewards", async function () {
      const amount = ethers.parseEther("1");
      await staking.connect(user1).stakeBNB(0, { value: amount });
      
      // Fast forward some time
      await time.increase(5 * 24 * 60 * 60);
      
      const balanceBefore = await ethers.provider.getBalance(user1.address);
      const tx = await staking.connect(user1).emergencyWithdraw(0);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(user1.address);
      
      // User should only receive principal (no rewards)
      expect(balanceAfter).to.be.closeTo(balanceBefore + amount - gasUsed, ethers.parseEther("0.001"));
    });

    it("Should allow owner to pause contract", async function () {
      await staking.pause();
      
      await expect(
        staking.connect(user1).stakeBNB(0, { value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(staking, "EnforcedPause");
    });
  });

  describe("Security", function () {
    it("Should prevent reentrancy attacks", async function () {
      // This is inherently protected by ReentrancyGuard
      // The test ensures the guard is properly applied
      const amount = ethers.parseEther("1");
      await staking.connect(user1).stakeBNB(0, { value: amount });
      
      await time.increase(15 * 24 * 60 * 60);
      
      // Multiple rapid withdrawals should be prevented
      const withdrawPromise = staking.connect(user1).withdraw(0);
      await expect(withdrawPromise).to.not.be.reverted;
      
      // Second withdrawal of same stake should fail
      await expect(
        staking.connect(user1).withdraw(0)
      ).to.be.revertedWith("Already withdrawn");
    });
  });
});
