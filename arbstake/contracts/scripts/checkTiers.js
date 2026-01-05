const hre = require("hardhat");

async function main() {
  // Contract addresses for different networks
  const addresses = {
    bscTestnet: "0xC6A791dC3Ca7F7c476a220f97F7eF0680Ec2B710",
    baseSepolia: "0xE27D5CcC3627b04db8482820C35fFF59044794d5"
  };
  
  const network = hre.network.name;
  const contractAddress = addresses[network];
  
  if (!contractAddress) {
    console.error(`No contract address for network: ${network}`);
    process.exit(1);
  }
  
  console.log(`Checking tier configuration on ${network}...`);
  console.log("Contract:", contractAddress);
  
  const contract = await hre.ethers.getContractAt("StarYieldStaking", contractAddress);
  
  const tierNames = ["COMET", "METEOR", "SUPERNOVA"];
  
  for (let i = 0; i < 3; i++) {
    const tierInfo = await contract.tierInfo(i);
    console.log(`\n${tierNames[i]} Tier:`);
    console.log("  Locking Period:", Number(tierInfo[0]) / 86400, "days");
    console.log("  Min Investment:", hre.ethers.formatEther(tierInfo[1]), "BNB");
    console.log("  APY Rate:", Number(tierInfo[2]) / 100, "%");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
