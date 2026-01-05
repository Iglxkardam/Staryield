const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  console.log("Testing staking with account:", signer.address);
  console.log("Network:", hre.network.name);
  
  // Get contract address based on network - UPDATED CONTRACTS
  let contractAddress;
  if (hre.network.name === "bscTestnet") {
    contractAddress = "0xC6A791dC3Ca7F7c476a220f97F7eF0680Ec2B710";
  } else if (hre.network.name === "baseSepolia") {
    contractAddress = "0xE27D5CcC3627b04db8482820C35fFF59044794d5";
  } else {
    throw new Error("Unsupported network");
  }
  
  console.log("Contract Address:", contractAddress);
  
  // Get contract instance
  const StarYieldStaking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = StarYieldStaking.attach(contractAddress);
  
  // Check balance before
  const balanceBefore = await hre.ethers.provider.getBalance(signer.address);
  console.log("\nBalance before:", hre.ethers.formatEther(balanceBefore), "tokens");
  
  // Stake 0.05 tokens (testing with available balance)
  const stakeAmount = hre.ethers.parseEther("0.05");
  console.log("\nStaking amount:", hre.ethers.formatEther(stakeAmount), "tokens");
  console.log("Tier: COMET (14 days, 6% APY)");
  
  console.log("\nSending transaction...");
  const tx = await staking.stakeBNB(0, { value: stakeAmount });
  console.log("Transaction hash:", tx.hash);
  
  console.log("Waiting for confirmation...");
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
  
  // Get stake details
  const stakes = await staking.getUserStakes(signer.address);
  const stakeId = stakes.length - 1;
  
  console.log("\n=== Stake Details ===");
  console.log("Stake ID:", stakeId);
  console.log("Amount:", hre.ethers.formatEther(stakes[stakeId].amount), "tokens");
  console.log("Start Time:", new Date(Number(stakes[stakeId].startTime) * 1000).toLocaleString());
  console.log("End Time:", new Date(Number(stakes[stakeId].endTime) * 1000).toLocaleString());
  console.log("Tier:", stakes[stakeId].tier === 0n ? "COMET" : stakes[stakeId].tier === 1n ? "METEOR" : "SUPERNOVA");
  console.log("Token:", stakes[stakeId].token === hre.ethers.ZeroAddress ? "BNB/ETH" : stakes[stakeId].token);
  
  // Calculate expected rewards after full period
  const tierInfo = await staking.tierInfo(0);
  const lockingPeriod = Number(tierInfo.lockingPeriod);
  const apyRate = Number(tierInfo.apyRate);
  
  const expectedRewards = (stakeAmount * BigInt(apyRate) * BigInt(lockingPeriod)) / (BigInt(365 * 24 * 60 * 60) * 10000n);
  console.log("\nExpected rewards after 14 days:", hre.ethers.formatEther(expectedRewards), "tokens");
  console.log("Total to receive:", hre.ethers.formatEther(stakeAmount + expectedRewards), "tokens");
  
  // Check balance after
  const balanceAfter = await hre.ethers.provider.getBalance(signer.address);
  console.log("\nBalance after:", hre.ethers.formatEther(balanceAfter), "tokens");
  console.log("Gas cost:", hre.ethers.formatEther(balanceBefore - balanceAfter - stakeAmount), "tokens");
  
  // Get total staked
  const totalStaked = await staking.totalStakedByUser(signer.address);
  console.log("\nTotal staked by user:", hre.ethers.formatEther(totalStaked), "tokens");
  
  const totalStakedInContract = await staking.totalStakedPerToken(hre.ethers.ZeroAddress);
  console.log("Total staked in contract:", hre.ethers.formatEther(totalStakedInContract), "tokens");
  
  console.log("\n✅ Test staking completed successfully!");
  console.log("\n📝 Notes:");
  console.log("- You can claim rewards anytime: staking.claimRewards(", stakeId, ")");
  console.log("- You can withdraw after locking period ends");
  console.log("- Emergency withdraw available (loses all rewards)");
  
  if (hre.network.name === "bscTestnet") {
    console.log("\n🔗 View on BSCScan:");
    console.log("https://testnet.bscscan.com/tx/" + tx.hash);
  } else {
    console.log("\n🔗 View on BaseScan:");
    console.log("https://sepolia.basescan.org/tx/" + tx.hash);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
