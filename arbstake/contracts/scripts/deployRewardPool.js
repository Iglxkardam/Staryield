const hre = require("hardhat");

async function main() {
  console.log("Deploying RewardPool...");

  const RewardPool = await hre.ethers.getContractFactory("RewardPool");
  const rewardPool = await RewardPool.deploy();
  await rewardPool.waitForDeployment();

  const rewardPoolAddress = await rewardPool.getAddress();
  console.log("✅ RewardPool deployed to:", rewardPoolAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await rewardPool.deploymentTransaction().wait(5);

  console.log("\n📋 Deployment Summary:");
  console.log("RewardPool:", rewardPoolAddress);
  console.log("\n⚠️ IMPORTANT: Save this address to deploy StarYieldStaking!");
  console.log("\nNext steps:");
  console.log("1. Fund the reward pool with liquidity (BNB/ETH and tokens)");
  console.log("2. Deploy StarYieldStaking with this reward pool address");
  console.log("3. Add StarYieldStaking as authorized staking contract in reward pool");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
