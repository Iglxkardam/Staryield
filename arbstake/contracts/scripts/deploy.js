const hre = require("hardhat");

async function main() {
  console.log("Deploying StarYieldStaking contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy contract
  const StarYieldStaking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = await StarYieldStaking.deploy();
  
  await staking.waitForDeployment();
  const address = await staking.getAddress();

  console.log("StarYieldStaking deployed to:", address);
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", address);
  console.log("Deployer:", deployer.address);
  
  // Wait for block confirmations
  console.log("\nWaiting for block confirmations...");
  await staking.deploymentTransaction().wait(5);
  
  console.log("\n=== Tier Configuration ===");
  const comet = await staking.tierInfo(0);
  const meteor = await staking.tierInfo(1);
  const supernova = await staking.tierInfo(2);
  
  console.log("COMET Tier:");
  console.log("  Locking Period:", comet.lockingPeriod.toString(), "seconds (14 days)");
  console.log("  Min Investment:", hre.ethers.formatEther(comet.minInvestment), "tokens");
  console.log("  APY Rate:", comet.apyRate.toString(), "basis points (6%)");
  
  console.log("\nMETEOR Tier:");
  console.log("  Locking Period:", meteor.lockingPeriod.toString(), "seconds (21 days)");
  console.log("  Min Investment:", hre.ethers.formatEther(meteor.minInvestment), "tokens");
  console.log("  APY Rate:", meteor.apyRate.toString(), "basis points (11%)");
  
  console.log("\nSUPERNOVA Tier:");
  console.log("  Locking Period:", supernova.lockingPeriod.toString(), "seconds (30 days)");
  console.log("  Min Investment:", hre.ethers.formatEther(supernova.minInvestment), "tokens");
  console.log("  APY Rate:", supernova.apyRate.toString(), "basis points (14%)");

  console.log("\n=== Verification Command ===");
  console.log(`npx hardhat verify --network ${hre.network.name} ${address}`);
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    address: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    tiers: {
      comet: {
        lockingPeriod: comet.lockingPeriod.toString(),
        minInvestment: comet.minInvestment.toString(),
        apyRate: comet.apyRate.toString()
      },
      meteor: {
        lockingPeriod: meteor.lockingPeriod.toString(),
        minInvestment: meteor.minInvestment.toString(),
        apyRate: meteor.apyRate.toString()
      },
      supernova: {
        lockingPeriod: supernova.lockingPeriod.toString(),
        minInvestment: supernova.minInvestment.toString(),
        apyRate: supernova.apyRate.toString()
      }
    }
  };
  
  fs.writeFileSync(
    `deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`\nDeployment info saved to deployments/${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
