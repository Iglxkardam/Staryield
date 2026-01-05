// Fund Reward Pools with Liquidity
// Run this script to add BNB/ETH to reward pools for payouts

const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Funding from account:", signer.address);

  // Get network
  const network = hre.network.name;
  console.log("Network:", network);

  // Reward Pool addresses
  const REWARD_POOLS = {
    bscTestnet: "0x259f2AC8BB77E575ADD1B859D7AFc57Eb5CD05D0",
    baseSepolia: "0x1018Ea97C3540d9dB123392705096f5B93cD46C9",
  };

  const rewardPoolAddress = REWARD_POOLS[network];
  if (!rewardPoolAddress) {
    console.error("❌ Reward pool address not found for network:", network);
    return;
  }

  console.log("Reward Pool:", rewardPoolAddress);

  // Get RewardPool contract
  const RewardPool = await hre.ethers.getContractFactory("RewardPool");
  const rewardPool = RewardPool.attach(rewardPoolAddress);

  // Check current balance
  const currentBalance = await hre.ethers.provider.getBalance(rewardPoolAddress);
  console.log("\n📊 Current Pool Balance:", hre.ethers.formatEther(currentBalance), "native token");

  // Amount to deposit (change this value)
  const depositAmount = hre.ethers.parseEther("0.5"); // 0.5 BNB/ETH - adjust based on your balance
  console.log("\n💰 Depositing:", hre.ethers.formatEther(depositAmount), "native token");

  // Check if signer has enough balance
  const signerBalance = await hre.ethers.provider.getBalance(signer.address);
  console.log("Your balance:", hre.ethers.formatEther(signerBalance), "native token");

  if (signerBalance < depositAmount) {
    console.error("❌ Insufficient balance!");
    return;
  }

  // Deposit to reward pool
  console.log("\n⏳ Sending transaction...");
  const tx = await rewardPool.depositBNB({ value: depositAmount });
  console.log("Transaction hash:", tx.hash);

  console.log("⏳ Waiting for confirmation...");
  await tx.wait(2);

  // Check new balance
  const newBalance = await hre.ethers.provider.getBalance(rewardPoolAddress);
  console.log("\n✅ SUCCESS!");
  console.log("New Pool Balance:", hre.ethers.formatEther(newBalance), "native token");
  console.log("Deposited:", hre.ethers.formatEther(depositAmount), "native token");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
