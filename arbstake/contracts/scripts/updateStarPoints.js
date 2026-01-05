// Update Staking Contract to use new StarPoints
const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log("Network:", network);

  const ADDRESSES = {
    baseSepolia: {
      staking: "0x1DaC05A37C42480E723099c8c72C1EaE761eEA2F",
      newStarPoints: "0x72E88377f4dc0429e52370c1875D927B2B29f89F",
    },
  };

  const addresses = ADDRESSES[network];
  if (!addresses) {
    console.error("❌ Network not supported");
    return;
  }

  console.log("\n📍 Addresses:");
  console.log("Staking Contract:", addresses.staking);
  console.log("New StarPoints:", addresses.newStarPoints);

  // Get staking contract
  const Staking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = Staking.attach(addresses.staking);

  // Update StarPoints address
  console.log("\n🔄 Updating StarPoints address in Staking contract...");
  const tx = await staking.updateStarPoints(addresses.newStarPoints);
  console.log("Transaction hash:", tx.hash);

  console.log("⏳ Waiting for confirmation...");
  await tx.wait(2);

  console.log("\n✅ StarPoints updated successfully!");

  // Verify
  const currentStarPoints = await staking.starPoints();
  console.log("\n✓ Verified - Current StarPoints:", currentStarPoints);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
