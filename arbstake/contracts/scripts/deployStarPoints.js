const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Starting StarPoints deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance));

  const networkName = hre.network.name;
  console.log("Network:", networkName);

  // Deploy StarPoints
  console.log("\n📦 Deploying StarPoints contract...");
  const StarPoints = await hre.ethers.getContractFactory("StarPoints");
  const starPoints = await StarPoints.deploy();
  await starPoints.waitForDeployment();
  const starPointsAddress = await starPoints.getAddress();

  console.log("✅ StarPoints deployed to:", starPointsAddress);

  // Load existing deployments
  const deploymentFile = path.join(__dirname, '../deployments', `${networkName}.json`);
  let deployments = {};

  if (fs.existsSync(deploymentFile)) {
    deployments = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  }

  // Update deployment info
  deployments.starPoints = {
    address: starPoints.address,
    deployedAt: new Date().toISOString()
  };

  // Save deployment info
  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deployments, null, 2)
  );

  console.log("\n✅ Deployment info saved to:", deploymentFile);

  // If there's an existing staking contract, authorize it
  if (deployments.stakingContract) {
    console.log("\n🔗 Authorizing existing staking contract...");
    const tx = await starPoints.addStakingContract(deployments.stakingContract.address);
    await tx.wait();
    console.log("✅ Staking contract authorized:", deployments.stakingContract.address);
  }

  console.log("\n📋 Summary:");
  console.log("StarPoints Address:", starPoints.address);
  if (deployments.stakingContract) {
    console.log("Linked to Staking Contract:", deployments.stakingContract.address);
  }

  console.log("\n⚠️  NEXT STEPS:");
  console.log("1. Verify contract on block explorer (if mainnet/testnet)");
  if (!deployments.stakingContract) {
    console.log("2. Deploy or update StarYieldStaking contract with StarPoints address");
  } else {
    console.log("2. Update existing StarYieldStaking contract to use new StarPoints");
    console.log("   Call: stakingContract.updateStarPoints('" + starPoints.address + "')");
  }
  console.log("3. Run: npm run export-abi to update frontend ABIs");

  // Verification info
  if (networkName !== "hardhat" && networkName !== "localhost") {
    console.log("\n🔍 To verify on block explorer, run:");
    console.log(`npx hardhat verify --network ${networkName} ${starPoints.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
