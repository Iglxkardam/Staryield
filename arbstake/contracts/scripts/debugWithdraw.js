// Debug Withdrawal Issue
const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const userAddress = signer.address;

  const network = hre.network.name;
  console.log("Network:", network);
  console.log("User:", userAddress);

  const ADDRESSES = {
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

  // Get contracts
  const Staking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = Staking.attach(addresses.staking);

  // Get all user stakes
  console.log("\n📊 Fetching user stakes...");
  const stakes = await staking.getUserStakes(userAddress);

  if (stakes.length === 0) {
    console.log("❌ No stakes found");
    return;
  }

  console.log(`\n✅ Found ${stakes.length} stake(s)\n`);

  // Analyze each stake
  for (let i = 0; i < stakes.length; i++) {
    const stake = stakes[i];
    console.log(`\n━━━━━━━━━━ STAKE #${i} ━━━━━━━━━━`);
    console.log("Amount:", hre.ethers.formatEther(stake.amount), "ETH");
    console.log("Start Time:", new Date(Number(stake.startTime) * 1000).toLocaleString());
    console.log("End Time:", new Date(Number(stake.endTime) * 1000).toLocaleString());
    console.log("Tier:", ["COMET", "METEOR", "SUPERNOVA"][stake.tier]);
    console.log("Token:", stake.token === hre.ethers.ZeroAddress ? "Native (ETH)" : stake.token);
    console.log("Withdrawn:", stake.withdrawn);
    console.log("Rewards Claimed:", hre.ethers.formatEther(stake.rewardsClaimed), "ETH");

    if (stake.withdrawn) {
      console.log("⚠️  Already withdrawn");
      continue;
    }

    // Check if unlocked
    const currentTime = Math.floor(Date.now() / 1000);
    const isUnlocked = currentTime >= Number(stake.endTime);
    console.log("\nStatus:", isUnlocked ? "🔓 UNLOCKED" : "🔒 LOCKED");

    if (!isUnlocked) {
      const timeLeft = Number(stake.endTime) - currentTime;
      const days = Math.floor(timeLeft / 86400);
      const hours = Math.floor((timeLeft % 86400) / 3600);
      console.log(`Time remaining: ${days}d ${hours}h`);
    }

    // Calculate pending rewards
    try {
      const pendingRewards = await staking.calculateRewards(userAddress, i);
      console.log("\n💰 Pending Rewards:", hre.ethers.formatEther(pendingRewards), "ETH");

      // Calculate total payout needed
      const totalPayout = stake.amount + pendingRewards;
      console.log("📊 Total Payout Needed:", hre.ethers.formatEther(totalPayout), "ETH");

      // Check pool balance
      const poolBalance = await hre.ethers.provider.getBalance(addresses.rewardPool);
      console.log("💼 Pool Balance:", hre.ethers.formatEther(poolBalance), "ETH");

      const hasEnoughBalance = poolBalance >= totalPayout;
      console.log("\n" + (hasEnoughBalance ? "✅ Pool has enough balance" : "❌ INSUFFICIENT POOL BALANCE"));

      if (!hasEnoughBalance) {
        const needed = totalPayout - poolBalance;
        console.log("⚠️  Need to add:", hre.ethers.formatEther(needed), "ETH to pool");
      }

      // Try to simulate withdrawal if unlocked
      if (isUnlocked && hasEnoughBalance) {
        console.log("\n🧪 Simulating withdrawal...");
        try {
          await staking.withdraw.staticCall(i);
          console.log("✅ Withdrawal simulation successful - transaction should work!");
        } catch (error) {
          console.log("❌ Withdrawal simulation failed:");
          console.log(error.message);

          // Try to get revert reason
          if (error.data) {
            console.log("Revert data:", error.data);
          }
        }
      }
    } catch (error) {
      console.log("❌ Error calculating rewards:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
