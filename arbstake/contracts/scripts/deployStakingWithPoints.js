const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * Deploy StarYieldStaking with StarPoints integration
 * This script deploys both contracts and links them together
 */
async function main() {
  console.log("🚀 Starting deployment of StarYield Staking with Star Points...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const networkName = hre.network.name;
  console.log("Network:", networkName);

  // Load existing deployments to get RewardPool address
  const deploymentFile = path.join(__dirname, '../deployments', `${networkName}.json`);
  let deployments = {};
  
  if (fs.existsSync(deploymentFile)) {
    deployments = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    console.log("\n📁 Loaded existing deployments");
  }

  // Check if RewardPool exists
  if (!deployments.rewardPool || !deployments.rewardPool.address) {
    console.error("\n❌ ERROR: RewardPool not found in deployments!");
    console.error("Please deploy RewardPool first using: npm run deploy:reward-pool");
    process.exit(1);
  }

  const rewardPoolAddress = deployments.rewardPool.address;
  console.log("✅ Using RewardPool at:", rewardPoolAddress);

  // Step 1: Deploy StarPoints
  console.log("\n📦 Step 1: Deploying StarPoints contract...");
  const StarPoints = await hre.ethers.getContractFactory("StarPoints");
  const starPoints = await StarPoints.deploy();
  await starPoints.waitForDeployment();
  const starPointsAddress = await starPoints.getAddress();
  console.log("✅ StarPoints deployed to:", starPointsAddress);

  // Step 2: Deploy StarYieldStaking with both RewardPool and StarPoints
  console.log("\n📦 Step 2: Deploying StarYieldStaking contract...");
  const StarYieldStaking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = await StarYieldStaking.deploy(rewardPoolAddress, starPointsAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ StarYieldStaking deployed to:", stakingAddress);

  // Step 3: Authorize staking contract in StarPoints
  console.log("\n🔗 Step 3: Authorizing staking contract in StarPoints...");
  const authTx = await starPoints.addStakingContract(stakingAddress);
  await authTx.wait();
  console.log("✅ Staking contract authorized in StarPoints");

  // Step 4: Authorize staking contract in RewardPool
  console.log("\n🔗 Step 4: Authorizing staking contract in RewardPool...");
  const RewardPool = await hre.ethers.getContractFactory("RewardPool");
  const rewardPool = RewardPool.attach(rewardPoolAddress);
  const authRewardPoolTx = await rewardPool.addStakingContract(stakingAddress);
  await authRewardPoolTx.wait();
  console.log("✅ Staking contract authorized in RewardPool");

  // Save deployment info
  deployments.starPoints = {
    address: starPointsAddress,
    deployedAt: new Date().toISOString()
  };

  deployments.stakingContract = {
    address: stakingAddress,
    rewardPool: rewardPoolAddress,
    starPoints: starPointsAddress,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deployments, null, 2)
  );

  console.log("\n✅ Deployment info saved to:", deploymentFile);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", networkName);
  console.log("\n🎯 Contract Addresses:");
  console.log("  RewardPool:        ", rewardPoolAddress);
  console.log("  StarPoints:        ", starPointsAddress);
  console.log("  StarYieldStaking:  ", stakingAddress);
  console.log("\n🔗 Integrations:");
  console.log("  ✅ StarPoints ← StakingContract authorized");
  console.log("  ✅ RewardPool ← StakingContract authorized");
  console.log("  ✅ StakingContract → RewardPool linked");
  console.log("  ✅ StakingContract → StarPoints linked");
  console.log("=".repeat(60));

  console.log("\n⚠️  NEXT STEPS:");
  console.log("1. Export ABIs: npm run export-abi");
  console.log("2. Update frontend configs with new addresses");
  console.log("3. Fund RewardPool with tokens/BNB for rewards");
  console.log("4. Test staking flow on testnet");

  // Verification commands
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("\n🔍 To verify contracts on block explorer:");
    console.log(`\nnpx hardhat verify --network ${networkName} ${starPointsAddress}`);
    console.log(`\nnpx hardhat verify --network ${networkName} ${stakingAddress} "${rewardPoolAddress}" "${starPointsAddress}"`);
  }

  console.log("\n✨ Deployment completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
