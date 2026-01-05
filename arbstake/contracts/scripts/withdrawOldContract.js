const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  
  console.log("Withdrawing from old contract with account:", signer.address);
  console.log("Network:", hre.network.name);
  
  // OLD contract addresses
  let oldContractAddress;
  if (hre.network.name === "bscTestnet") {
    oldContractAddress = "0x1018Ea97C3540d9dB123392705096f5B93cD46C9";
  } else if (hre.network.name === "baseSepolia") {
    oldContractAddress = "0xb8f0F532B8A8386a93d577860a085663b8796132";
  } else {
    throw new Error("Unsupported network");
  }
  
  console.log("Old Contract Address:", oldContractAddress);
  
  // Get contract instance
  const StarYieldStaking = await hre.ethers.getContractFactory("StarYieldStaking");
  const staking = StarYieldStaking.attach(oldContractAddress);
  
  // Check contract balance
  const contractBalance = await hre.ethers.provider.getBalance(oldContractAddress);
  console.log("\nOld Contract Balance:", hre.ethers.formatEther(contractBalance), "tokens");
  
  if (contractBalance === 0n) {
    console.log("✅ Contract already empty, nothing to withdraw");
    return;
  }
  
  // Get user stakes
  const stakes = await staking.getUserStakes(signer.address);
  console.log("\nYour stakes:", stakes.length);
  
  if (stakes.length === 0) {
    console.log("No stakes found for your address");
    console.log("\n⚠️ There are funds in the contract but not yours.");
    console.log("To withdraw ALL contract funds as admin, use adminWithdraw function.");
    
    // Try admin withdrawal
    try {
      console.log("\n🔐 Attempting admin withdrawal of all funds...");
      const tx = await staking.adminWithdraw(
        hre.ethers.ZeroAddress, // native currency
        signer.address, // send to yourself
        contractBalance
      );
      
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("✅ Successfully withdrew all contract funds!");
      
    } catch (error) {
      console.log("❌ Admin withdrawal failed:", error.message);
      console.log("\nPossible reasons:");
      console.log("- You don't have admin role");
      console.log("- Old contract doesn't have adminWithdraw function");
      console.log("- Need to use emergency withdraw functions instead");
    }
    
    return;
  }
  
  // Withdraw each stake
  for (let i = 0; i < stakes.length; i++) {
    const stake = stakes[i];
    
    if (stake.withdrawn) {
      console.log(`\nStake ${i}: Already withdrawn`);
      continue;
    }
    
    console.log(`\n=== Processing Stake ${i} ===`);
    console.log("Amount:", hre.ethers.formatEther(stake.amount), "tokens");
    console.log("Tier:", stake.tier === 0n ? "COMET" : stake.tier === 1n ? "METEOR" : "SUPERNOVA");
    console.log("End Time:", new Date(Number(stake.endTime) * 1000).toLocaleString());
    
    const now = Math.floor(Date.now() / 1000);
    const isLocked = Number(stake.endTime) > now;
    
    if (isLocked) {
      console.log("⚠️ Stake is still locked. Using emergency withdraw (will lose rewards)...");
      
      try {
        const tx = await staking.emergencyWithdraw(i);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("✅ Emergency withdrawal successful for stake", i);
      } catch (error) {
        console.log("❌ Emergency withdrawal failed:", error.message);
      }
    } else {
      console.log("✅ Stake is unlocked. Withdrawing normally...");
      
      try {
        // First claim rewards
        console.log("Claiming rewards...");
        const claimTx = await staking.claimRewards(i);
        await claimTx.wait();
        console.log("✅ Rewards claimed");
        
        // Then withdraw principal
        console.log("Withdrawing principal...");
        const withdrawTx = await staking.withdraw(i);
        await withdrawTx.wait();
        console.log("✅ Principal withdrawn for stake", i);
      } catch (error) {
        console.log("❌ Withdrawal failed:", error.message);
        
        // Try emergency withdraw as fallback
        console.log("Trying emergency withdraw as fallback...");
        try {
          const tx = await staking.emergencyWithdraw(i);
          await tx.wait();
          console.log("✅ Emergency withdrawal successful");
        } catch (error2) {
          console.log("❌ Emergency withdrawal also failed:", error2.message);
        }
      }
    }
  }
  
  // Check final balance
  const finalContractBalance = await hre.ethers.provider.getBalance(oldContractAddress);
  console.log("\n=== Final Status ===");
  console.log("Old Contract Balance:", hre.ethers.formatEther(finalContractBalance), "tokens");
  console.log("Your Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(signer.address)), "tokens");
  
  if (finalContractBalance > 0n) {
    console.log("\n⚠️ There are still funds in the contract");
    console.log("Remaining:", hre.ethers.formatEther(finalContractBalance), "tokens");
  } else {
    console.log("\n✅ All funds withdrawn successfully!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
