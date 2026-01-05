const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  console.log("Updating tier minimums for testing...");
  console.log("Account:", signer.address);
  console.log("Network:", hre.network.name);
  
  // Get contract address
  let contractAddress;
  if (hre.network.name === "bscTestnet") {
    contractAddress = "0x1018Ea97C3540d9dB123392705096f5B93cD46C9";
  } else if (hre.network.name === "baseSepolia") {
    contractAddress = "0xb8f0F532B8A8386a93d577860a085663b8796132";
  } else {
    throw new Error("Unsupported network");
  }
  
  const StarYieldStaking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = StarYieldStaking.attach(contractAddress);
  
  console.log("\nUpdating COMET tier minimum to 0.01...");
  const tx = await staking.updateTierInfo(
    0, // COMET tier
    14 * 24 * 60 * 60, // 14 days
    hre.ethers.parseEther("0.01"), // 0.01 minimum for testing
    600 // 6% APY
  );
  
  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("✅ Tier updated successfully!");
  
  const tierInfo = await staking.tierInfo(0);
  console.log("\nCOMET Tier (updated):");
  console.log("  Min Investment:", hre.ethers.formatEther(tierInfo.minInvestment));
  console.log("  Locking Period:", Number(tierInfo.lockingPeriod) / 86400, "days");
  console.log("  APY:", Number(tierInfo.apyRate) / 100, "%");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
