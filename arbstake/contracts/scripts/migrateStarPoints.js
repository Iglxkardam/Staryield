// Migrate stake data from old StarPoints to new StarPoints
const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const userAddress = signer.address;

  const network = hre.network.name;
  console.log("Network:", network);
  console.log("User:", userAddress);

  const ADDRESSES = {
    baseSepolia: {
      staking: "0x1DaC05A37C42480E723099c8c72C1EaE761eEA2F",
      oldStarPoints: "0xdADaF4d4e8450862E44447F5EcFBfc9fccc76d41",
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
  console.log("Old StarPoints:", addresses.oldStarPoints);
  console.log("New StarPoints:", addresses.newStarPoints);

  // Get contracts
  const Staking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = Staking.attach(addresses.staking);

  const OldStarPoints = await hre.ethers.getContractFactory("StarPoints");
  const oldStarPoints = OldStarPoints.attach(addresses.oldStarPoints);

  const NewStarPoints = await hre.ethers.getContractFactory("StarPoints");
  const newStarPoints = NewStarPoints.attach(addresses.newStarPoints);

  // Get all user stakes
  console.log("\n📊 Fetching user stakes...");
  const stakes = await staking.getUserStakes(userAddress);

  if (stakes.length === 0) {
    console.log("❌ No stakes found");
    return;
  }

  console.log(`✅ Found ${stakes.length} stake(s)\n`);

  // Authorize staking contract in new StarPoints if not already
  console.log("🔐 Checking authorization...");
  const STAKING_ROLE = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("STAKING_CONTRACT_ROLE")
  );
  const isAuthorized = await newStarPoints.hasRole(STAKING_ROLE, addresses.staking);

  if (!isAuthorized) {
    console.log("⚠️  Staking contract not authorized, authorizing now...");
    const authTx = await newStarPoints.addStakingContract(addresses.staking);
    await authTx.wait();
    console.log("✅ Authorized!");
  } else {
    console.log("✅ Already authorized");
  }

  // Migrate each active stake
  console.log("\n🔄 Migrating stakes to new StarPoints contract...\n");

  for (let i = 0; i < stakes.length; i++) {
    const stake = stakes[i];

    if (stake.withdrawn) {
      console.log(`Stake #${i}: ⏭️  Skipped (already withdrawn)`);
      continue;
    }

    try {
      // Check if already initialized in new contract
      const stakeInfo = await newStarPoints.stakePoints(userAddress, i);

      if (stakeInfo.active) {
        console.log(`Stake #${i}: ✅ Already migrated`);
        continue;
      }

      // Initialize in new contract
      console.log(`Stake #${i}: 🔄 Initializing (${hre.ethers.formatEther(stake.amount)} ETH)...`);
      const tx = await newStarPoints.initializeStake(userAddress, i, stake.amount);
      await tx.wait();
      console.log(`Stake #${i}: ✅ Migrated successfully`);

    } catch (error) {
      console.log(`Stake #${i}: ❌ Error -`, error.message);
    }
  }

  console.log("\n✅ Migration complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
