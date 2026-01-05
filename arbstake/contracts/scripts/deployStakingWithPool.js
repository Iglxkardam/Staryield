const hre = require("hardhat");

async function main() {
  // REPLACE THIS with your deployed RewardPool address
  const REWARD_POOL_ADDRESS = process.env.REWARD_POOL_ADDRESS || "0x0000000000000000000000000000000000000000";

  if (REWARD_POOL_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.error("❌ ERROR: Please set REWARD_POOL_ADDRESS");
    console.error("Run: REWARD_POOL_ADDRESS=0x... npx hardhat run scripts/deployStakingWithPool.js --network <network>");
    process.exit(1);
  }

  console.log("Deploying StarYieldStaking with RewardPool...");
  console.log("RewardPool Address:", REWARD_POOL_ADDRESS);

  const StarYieldStaking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = await StarYieldStaking.deploy(REWARD_POOL_ADDRESS);
  await staking.waitForDeployment();

  const stakingAddress = await staking.getAddress();
  console.log("✅ StarYieldStaking deployed to:", stakingAddress);

  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  await staking.deploymentTransaction().wait(5);

  console.log("\n📋 Deployment Summary:");
  console.log("StarYieldStaking:", stakingAddress);
  console.log("RewardPool:", REWARD_POOL_ADDRESS);

  console.log("\n⚠️ IMPORTANT NEXT STEPS:");
  console.log("1. Add StarYieldStaking as authorized contract in RewardPool:");
  console.log(`   rewardPool.addStakingContract("${stakingAddress}")`);
  console.log("\n2. Fund the RewardPool with liquidity:");
  console.log("   - Send BNB: rewardPool.depositBNB({value: amount})");
  console.log("   - Send tokens: rewardPool.depositToken(tokenAddress, amount)");
  console.log("\n3. Update frontend with new contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
