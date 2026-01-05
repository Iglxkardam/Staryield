const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting ReferralSystem deployment...");

  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log("📍 Network:", network);
  console.log("👤 Deployer:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)));

  // Load deployment info
  const deploymentPath = path.join(__dirname, '../deployments', `${network}.json`);
  let deploymentInfo = {};
  
  if (fs.existsSync(deploymentPath)) {
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    console.log("\n📄 Loaded existing deployment info");
  } else {
    console.log("\n⚠️  No existing deployment found. Make sure RewardPool and StarYieldStaking are deployed first!");
    return;
  }

  // Get RewardPool address
  const rewardPoolAddress = deploymentInfo.rewardPool?.address;
  
  if (!rewardPoolAddress) {
    console.log("❌ RewardPool address not found! Deploy RewardPool first.");
    return;
  }

  console.log("\n🔗 Using RewardPool:", rewardPoolAddress);

  // Deploy ReferralSystem
  console.log("\n📦 Deploying ReferralSystem...");
  const ReferralSystem = await hre.ethers.getContractFactory("ReferralSystem");
  const referralSystem = await ReferralSystem.deploy(rewardPoolAddress);
  await referralSystem.waitForDeployment();
  const referralSystemAddress = await referralSystem.getAddress();

  console.log("✅ ReferralSystem deployed at:", referralSystemAddress);

  // Get StakingContract address
  const stakingAddress = deploymentInfo.stakingContract?.address;
  
  if (stakingAddress) {
    console.log("\n🔗 Setting StakingContract address in ReferralSystem...");
    const tx = await referralSystem.setStakingContract(stakingAddress);
    await tx.wait();
    console.log("✅ StakingContract set successfully");

    // Update StarYieldStaking to use ReferralSystem
    console.log("\n🔗 Updating StarYieldStaking with ReferralSystem address...");
    const StarYieldStaking = await hre.ethers.getContractAt("StarYieldStaking", stakingAddress);
    const updateTx = await StarYieldStaking.updateReferralSystem(referralSystemAddress);
    await updateTx.wait();
    console.log("✅ StarYieldStaking updated successfully");
  } else {
    console.log("\n⚠️  StakingContract not found in deployment info. You'll need to set it manually.");
  }

  // Save deployment info
  deploymentInfo.referralSystem = {
    address: referralSystemAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    network: network,
    tiers: {
      starter: { threshold: 1, commission: "5%" },
      bronze: { threshold: 11, commission: "7%" },
      silver: { threshold: 26, commission: "10%" },
      gold: { threshold: 51, commission: "12%" },
      platinum: { threshold: 100, commission: "15%" }
    }
  };

  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);

  // Display summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 REFERRAL SYSTEM DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:           ", network);
  console.log("ReferralSystem:    ", referralSystemAddress);
  console.log("RewardPool:        ", rewardPoolAddress);
  console.log("StakingContract:   ", stakingAddress || "Not set");
  console.log("=".repeat(60));

  // Verification instructions
  if (network !== "hardhat" && network !== "localhost") {
    console.log("\n📝 To verify contract, run:");
    console.log(`npx hardhat verify --network ${network} ${referralSystemAddress} ${rewardPoolAddress}`);
  }

  console.log("\n✅ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
