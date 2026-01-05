const fs = require('fs');
const path = require('path');

async function exportABI() {
  const contracts = [
    {
      name: 'StarYieldStaking',
      artifactPath: '../artifacts/contracts/StarYieldStaking.sol/StarYieldStaking.json',
      outputPath: '../../src/contracts/StarYieldStaking.json'
    },
    {
      name: 'RewardPool',
      artifactPath: '../artifacts/contracts/RewardPool.sol/RewardPool.json',
      outputPath: '../../src/contracts/RewardPool.json'
    },
    {
      name: 'StarPoints',
      artifactPath: '../artifacts/contracts/StarPoints.sol/StarPoints.json',
      outputPath: '../../src/contracts/StarPoints.json'
    },
    {
      name: 'ReferralSystem',
      artifactPath: '../artifacts/contracts/ReferralSystem.sol/ReferralSystem.json',
      outputPath: '../../src/contracts/ReferralSystem.json'
    }
  ];

  console.log('📦 Exporting ABIs...\n');

  for (const contract of contracts) {
    try {
      const artifactPath = path.join(__dirname, contract.artifactPath);
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      
      const abi = artifact.abi;
      
      // Export to frontend src directory
      const outputPath = path.join(__dirname, contract.outputPath);
      const outputDir = path.dirname(outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(
        outputPath,
        JSON.stringify({ abi }, null, 2)
      );
      
      console.log(`✅ ${contract.name}:`);
      console.log(`   → ${outputPath}`);
      console.log(`   📝 ${abi.length} methods/events\n`);
    } catch (error) {
      console.log(`⚠️  ${contract.name}: Artifact not found (not yet compiled)`);
    }
  }

  console.log('✨ Export complete!');
}

exportABI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
