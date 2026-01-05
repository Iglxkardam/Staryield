// Check if Staking Contract is authorized in Reward Pool
const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log("Network:", network);

  const ADDRESSES = {
    bscTestnet: {
      rewardPool: "0x259f2AC8BB77E575ADD1B859D7AFc57Eb5CD05D0",
      staking: "0xC0e13855dEcA38359243c27f10b0106Cf5B96E5D",
    },
    baseSepolia: {
      rewardPool: "0x1018Ea97C3540d9dB123392705096f5B93cD46C9",
      staking: "0x1DaC05A37C42480E723099c8c72C1EaE761eEA2F",
    },
  };

  const addresses = ADDRESSES[network];
  if (!addresses) {
    console.error("❌ Network not supported");
    return;
  }

  console.log("\n📍 Addresses:");
  console.log("Reward Pool:", addresses.rewardPool);
  console.log("Staking Contract:", addresses.staking);

  // Get contracts
  const RewardPool = await hre.ethers.getContractFactory("RewardPool");
  const rewardPool = RewardPool.attach(addresses.rewardPool);

  // Check authorization
  const STAKING_CONTRACT_ROLE = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("STAKING_CONTRACT_ROLE")
  );

  console.log("\n🔐 Checking Authorization...");
  const isAuthorized = await rewardPool.hasRole(
    STAKING_CONTRACT_ROLE,
    addresses.staking
  );

  console.log("Staking Contract Authorized:", isAuthorized ? "✅ YES" : "❌ NO");

  // Check pool balance
  const balance = await hre.ethers.provider.getBalance(addresses.rewardPool);
  console.log("\n💰 Pool Balance:", hre.ethers.formatEther(balance), "native token");

  // Check if staking contract has correct reward pool address
  const Staking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = Staking.attach(addresses.staking);
  
  const configuredRewardPool = await staking.rewardPool();
  console.log("\n🔗 Staking Contract Configuration:");
  console.log("Configured Reward Pool:", configuredRewardPool);
  console.log("Expected Reward Pool:", addresses.rewardPool);
  console.log("Match:", configuredRewardPool.toLowerCase() === addresses.rewardPool.toLowerCase() ? "✅ YES" : "❌ NO");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
