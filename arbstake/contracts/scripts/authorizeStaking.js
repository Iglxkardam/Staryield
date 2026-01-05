const hre = require("hardhat");

async function main() {
  const rewardPoolAddress = process.env.REWARD_POOL_ADDRESS;
  const stakingAddress = process.env.STAKING_ADDRESS;

  if (!rewardPoolAddress || !stakingAddress) {
    console.error("❌ ERROR: Please provide both addresses");
    console.error("Usage: REWARD_POOL_ADDRESS=0x... STAKING_ADDRESS=0x... npx hardhat run scripts/authorizeStaking.js --network <network>");
    process.exit(1);
  }

  console.log("Authorizing StarYieldStaking contract in RewardPool...");
  console.log("RewardPool:", rewardPoolAddress);
  console.log("Staking Contract:", stakingAddress);

  const rewardPool = await hre.ethers.getContractAt("RewardPool", rewardPoolAddress);

  console.log("\nAdding staking contract...");
  const tx = await rewardPool.addStakingContract(stakingAddress);
  console.log("Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("✅ Staking contract authorized!");

  // Verify
  const STAKING_CONTRACT_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("STAKING_CONTRACT_ROLE"));
  const hasRole = await rewardPool.hasRole(STAKING_CONTRACT_ROLE, stakingAddress);
  
  console.log("\n✅ Verification:");
  console.log("Has STAKING_CONTRACT_ROLE:", hasRole);
  
  if (hasRole) {
    console.log("\n🎉 SUCCESS! Staking contract can now request payouts from reward pool");
  } else {
    console.log("\n⚠️ WARNING: Authorization may have failed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
