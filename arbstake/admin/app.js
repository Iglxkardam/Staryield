// Contract configuration - Integrated with StarPoints
const CONTRACTS = {
    97: '0xC0e13855dEcA38359243c27f10b0106Cf5B96E5D', // BSC Testnet - NEW with StarPoints ✅
    84532: '0x1DaC05A37C42480E723099c8c72C1EaE761eEA2F' // Base Sepolia - NEW with StarPoints ✅
};

// Reward Pool addresses
const REWARD_POOLS = {
    97: '0x259f2AC8BB77E575ADD1B859D7AFc57Eb5CD05D0', // BSC Testnet - DEPLOYED & AUTHORIZED ✅
    84532: '0x1018Ea97C3540d9dB123392705096f5B93cD46C9' // Base Sepolia - DEPLOYED & AUTHORIZED ✅
};

// StarPoints contract addresses
const STAR_POINTS = {
    97: '0x34ecFEBB8C279895E2d21a62c7A1D893Cba77B06', // BSC Testnet
    84532: '0xdADaF4d4e8450862E44447F5EcFBfc9fccc76d41' // Base Sepolia
};

const NETWORKS = {
    97: {
        name: 'BNB Testnet',
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        explorer: 'https://testnet.bscscan.com',
        currency: 'BNB'
    },
    84532: {
        name: 'Base Sepolia',
        rpcUrl: 'https://sepolia.base.org',
        explorer: 'https://sepolia.basescan.org',
        currency: 'ETH'
    }
};

// StarPoints ABI
const STAR_POINTS_ABI = [{"inputs":[{"internalType":"address","name":"_stakingContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pointsClaimed","type":"uint256"}],"name":"PointsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"}],"name":"StakeInitialized","type":"event"},{"inputs":[],"name":"ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINTS_INTERVAL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"POINTS_PER_ETH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"calculatePoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"claimPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"getStakePointsInfo","outputs":[{"internalType":"uint256","name":"totalPoints","type":"uint256"},{"internalType":"uint256","name":"pendingPoints","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"},{"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"internalType":"uint256","name":"stakeStartTime","type":"uint256"},{"internalType":"bool","name":"active","type":"bool"},{"internalType":"uint256","name":"nextClaimTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserTotalPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"handleEmergencyUnstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"},{"internalType":"uint256","name":"_withdrawnAmount","type":"uint256"}],"name":"handleUnstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"},{"internalType":"uint256","name":"_stakeAmount","type":"uint256"}],"name":"initializeStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stakingContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalPointsByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

// Contract ABI - embedded directly with adminWithdraw function
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_rewardPool","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[],"name":"EnforcedPause","type":"error"},{"inputs":[],"name":"ExpectedPause","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewards","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum StarYieldStaking.Tier","name":"tier","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"stakeId","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":true,"internalType":"address","name":"admin","type":"address"}],"name":"WithdrawalApproved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WithdrawalExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WithdrawalRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"stakeId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewards","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OWNER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REQUIRED_APPROVALS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"addAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"adminWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_requestId","type":"uint256"}],"name":"approveWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"calculateRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"canWithdraw","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getRewardPoolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"getStakeDetails","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"enum StarYieldStaking.Tier","name":"tier","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"bool","name":"withdrawn","type":"bool"},{"internalType":"uint256","name":"rewardsClaimed","type":"uint256"},{"internalType":"uint256","name":"pendingRewards","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserStakes","outputs":[{"components":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"enum StarYieldStaking.Tier","name":"tier","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"bool","name":"withdrawn","type":"bool"},{"internalType":"uint256","name":"rewardsClaimed","type":"uint256"}],"internalType":"struct StarYieldStaking.Stake[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"removeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"requestWithdrawal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardPool","outputs":[{"internalType":"contract IRewardPool","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum StarYieldStaking.Tier","name":"_tier","type":"uint8"}],"name":"stakeBNB","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"enum StarYieldStaking.Tier","name":"_tier","type":"uint8"}],"name":"stakeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum StarYieldStaking.Tier","name":"","type":"uint8"}],"name":"tierInfo","outputs":[{"internalType":"uint256","name":"lockingPeriod","type":"uint256"},{"internalType":"uint256","name":"minInvestment","type":"uint256"},{"internalType":"uint256","name":"apyRate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalStakedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"totalStakedPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newRewardPool","type":"address"}],"name":"updateRewardPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum StarYieldStaking.Tier","name":"_tier","type":"uint8"},{"internalType":"uint256","name":"_lockingPeriod","type":"uint256"},{"internalType":"uint256","name":"_minInvestment","type":"uint256"},{"internalType":"uint256","name":"_apyRate","type":"uint256"}],"name":"updateTierInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userStakes","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"enum StarYieldStaking.Tier","name":"tier","type":"uint8"},{"internalType":"address","name":"token","type":"address"},{"internalType":"bool","name":"withdrawn","type":"bool"},{"internalType":"uint256","name":"rewardsClaimed","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_stakeId","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawalRequestCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"withdrawalRequests","outputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"approvalCount","type":"uint256"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];

// Global variables
let provider;
let signer;
let contract;
let userAddress;
let currentTier = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        console.error('❌ Ethers.js not loaded');
        alert('Failed to load required libraries. Please refresh the page.');
        return;
    }
    console.log('✅ Ethers.js loaded');
    setupEventListeners();
    checkWalletConnection();
});

function setupEventListeners() {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('togglePause').addEventListener('click', togglePause);
    document.getElementById('updateTier').addEventListener('click', updateTier);
    document.getElementById('addAdmin').addEventListener('click', addAdmin);
    document.getElementById('removeAdmin').addEventListener('click', removeAdmin);
    document.getElementById('lookupStakes').addEventListener('click', lookupUserStakes);
    document.getElementById('lookupStarPoints').addEventListener('click', lookupStarPointsOnly);
    document.getElementById('emergencyWithdraw').addEventListener('click', emergencyWithdraw);
    document.getElementById('directWithdraw').addEventListener('click', directWithdraw);
    document.getElementById('requestWithdrawal').addEventListener('click', requestWithdrawal);
    document.getElementById('switchToBSC').addEventListener('click', () => switchNetwork(97));
    document.getElementById('switchToBase').addEventListener('click', () => switchNetwork(84532));

    // Tier tabs
    document.querySelectorAll('.tier-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tier-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTier = parseInt(tab.dataset.tier);
            loadTierInfo(currentTier);
        });
    });
}

async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    }
}

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask to use this admin panel!');
            return;
        }

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        // Get network
        const network = await provider.getNetwork();
        const chainId = network.chainId;

        if (!CONTRACTS[chainId]) {
            alert(`Please switch to BNB Testnet or Base Sepolia. Current network not supported.`);
            return;
        }

        // Initialize contract
        contract = new ethers.Contract(CONTRACTS[chainId], CONTRACT_ABI, signer);

        // Check if user is admin
        const isAdmin = await checkAdminRole();
        
        if (isAdmin) {
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('walletAddress').style.display = 'flex';
            document.getElementById('address').textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            document.getElementById('role').textContent = 'ADMIN';
            document.getElementById('adminPanel').style.display = 'block';
            document.getElementById('unauthorized').style.display = 'none';

            // Load data
            await loadContractStatus();
            await loadTierInfo(0);
            await loadAdminList();
            await loadRecentEvents();
        } else {
            document.getElementById('unauthorized').style.display = 'block';
            document.getElementById('adminPanel').style.display = 'none';
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });

    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
    }
}

async function checkAdminRole() {
    try {
        const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
        const hasRole = await contract.hasRole(DEFAULT_ADMIN_ROLE, userAddress);
        return hasRole;
    } catch (error) {
        console.error('Error checking admin role:', error);
        return false;
    }
}

async function loadContractStatus() {
    try {
        // Check if paused
        const isPaused = await contract.paused();
        const statusEl = document.getElementById('contractPaused');
        statusEl.textContent = isPaused ? '⏸️ PAUSED' : '✅ ACTIVE';
        statusEl.className = `status-indicator ${isPaused ? 'paused' : 'active'}`;

        // Get contract balance
        const balance = await provider.getBalance(contract.address);
        document.getElementById('contractBalance').textContent = 
            `${ethers.utils.formatEther(balance)} ${getCurrentCurrency()}`;

        // Total staked is harder to get without iterating all users
        // For now, show contract balance as approximation
        document.getElementById('totalStaked').textContent = 
            `${ethers.utils.formatEther(balance)} ${getCurrentCurrency()}`;

        // Load Reward Pool balance
        await loadRewardPoolBalance();

    } catch (error) {
        console.error('Error loading contract status:', error);
    }
}

async function loadRewardPoolBalance() {
    try {
        const chainId = await provider.getNetwork().then(n => n.chainId);
        const rewardPoolAddress = REWARD_POOLS[chainId];
        
        if (!rewardPoolAddress) {
            document.getElementById('rewardPoolBalance').textContent = 'Not configured';
            return;
        }

        // Get native token balance
        const balance = await provider.getBalance(rewardPoolAddress);
        const balanceFormatted = ethers.utils.formatEther(balance);
        
        document.getElementById('rewardPoolBalance').innerHTML = `
            <strong style="color: ${parseFloat(balanceFormatted) > 0.1 ? '#4CAF50' : '#ff9800'};">
                ${parseFloat(balanceFormatted).toFixed(4)} ${getCurrentCurrency()}
            </strong>
            ${parseFloat(balanceFormatted) < 0.1 ? 
                '<br><small style="color: #ff9800;">⚠️ Low balance! Fund the reward pool soon.</small>' : 
                '<br><small style="color: #4CAF50;">✅ Sufficient liquidity</small>'
            }
        `;
    } catch (error) {
        console.error('Error loading reward pool balance:', error);
        document.getElementById('rewardPoolBalance').textContent = 'Error loading balance';
    }
}

async function loadTierInfo(tierId) {
    try {
        const tierInfo = await contract.tierInfo(tierId);
        const lockingDays = tierInfo[0] / 86400;
        const minInvestment = ethers.utils.formatEther(tierInfo[1]);
        const apyRate = tierInfo[2] / 100;

        document.getElementById('currentTierInfo').innerHTML = `
            <strong>Locking Period:</strong> ${lockingDays} days<br>
            <strong>Min Investment:</strong> ${minInvestment} ${getCurrentCurrency()}<br>
            <strong>APY Rate:</strong> ${apyRate}%
        `;

        // Populate form
        document.getElementById('lockingPeriod').value = lockingDays;
        document.getElementById('minInvestment').value = minInvestment;
        document.getElementById('apyRate').value = apyRate;

    } catch (error) {
        console.error('Error loading tier info:', error);
    }
}

async function loadAdminList() {
    try {
        const adminListEl = document.getElementById('adminList');
        adminListEl.innerHTML = '<p class="text-muted">Loading admins...</p>';

        // Get DEFAULT_ADMIN_ROLE members
        // This is a simplified version - in production you'd want to maintain an off-chain list
        const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
        
        // For now, just show the deployer (you)
        adminListEl.innerHTML = `
            <div class="admin-item">
                <span>${userAddress}</span>
                <span class="role-badge">YOU</span>
            </div>
        `;

    } catch (error) {
        console.error('Error loading admin list:', error);
    }
}

async function loadRecentEvents() {
    try {
        const eventsEl = document.getElementById('recentEvents');
        eventsEl.innerHTML = '<p class="text-muted">Loading events...</p>';

        // Get recent Staked events
        const currentBlock = await provider.getBlockNumber();
        const fromBlock = currentBlock - 1000; // Last ~1000 blocks

        const stakedEvents = await contract.queryFilter(
            contract.filters.Staked(),
            fromBlock,
            currentBlock
        );

        if (stakedEvents.length === 0) {
            eventsEl.innerHTML = '<p class="text-muted">No recent events</p>';
            return;
        }

        const eventsHtml = stakedEvents.slice(-10).reverse().map(event => {
            const { user, token, amount, tier, stakeId } = event.args;
            return `
                <div class="event-item">
                    <div class="event-name">💰 New Stake</div>
                    <div class="event-details">
                        User: ${user}<br>
                        Amount: ${ethers.utils.formatEther(amount)} ${getCurrentCurrency()}<br>
                        Tier: ${tier}<br>
                        Stake ID: ${stakeId.toString()}
                    </div>
                </div>
            `;
        }).join('');

        eventsEl.innerHTML = eventsHtml;

    } catch (error) {
        console.error('Error loading events:', error);
    }
}

async function getTotalStarPoints(userAddress) {
    try {
        // Get points from BSC Testnet
        const bscProvider = new ethers.providers.JsonRpcProvider(NETWORKS[97].rpcUrl);
        const bscStarPoints = new ethers.Contract(STAR_POINTS[97], STAR_POINTS_ABI, bscProvider);
        const bscPoints = await bscStarPoints.getUserTotalPoints(userAddress);

        // Get points from Base Sepolia
        const baseProvider = new ethers.providers.JsonRpcProvider(NETWORKS[84532].rpcUrl);
        const baseStarPoints = new ethers.Contract(STAR_POINTS[84532], STAR_POINTS_ABI, baseProvider);
        const basePoints = await baseStarPoints.getUserTotalPoints(userAddress);

        return {
            bsc: bscPoints,
            base: basePoints,
            total: bscPoints.add(basePoints)
        };
    } catch (error) {
        console.error('Error fetching star points:', error);
        return {
            bsc: ethers.BigNumber.from(0),
            base: ethers.BigNumber.from(0),
            total: ethers.BigNumber.from(0)
        };
    }
}

async function lookupStarPointsOnly() {
    try {
        const userAddress = document.getElementById('lookupStarPointsAddress').value.trim();
        
        if (!ethers.utils.isAddress(userAddress)) {
            alert('Invalid address!');
            return;
        }

        const displayEl = document.getElementById('starPointsDisplay');
        displayEl.innerHTML = '<p class="text-muted">Loading star points...</p>';

        // Get star points from both chains
        const starPoints = await getTotalStarPoints(userAddress);

        // Display star points in a beautiful card
        displayEl.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; color: white; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div style="font-size: 60px;">⭐</div>
                    <div>
                        <h2 style="margin: 0; font-size: 28px; font-weight: bold;">Total Star Points</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.95; font-size: 15px;">For ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                    <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">🟡 BSC Testnet</div>
                        <div style="font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${starPoints.bsc.toString()}</div>
                        <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">${(parseFloat(ethers.utils.formatEther(starPoints.bsc.mul(1000))) * 1000).toFixed(4)} ETH equivalent</div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">🔵 Base Sepolia</div>
                        <div style="font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${starPoints.base.toString()}</div>
                        <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">${(parseFloat(ethers.utils.formatEther(starPoints.base.mul(1000))) * 1000).toFixed(4)} ETH equivalent</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.4); box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <div style="font-size: 14px; opacity: 0.95; margin-bottom: 8px; font-weight: 700;">✨ TOTAL ACROSS ALL CHAINS</div>
                        <div style="font-size: 40px; font-weight: bold; text-shadow: 0 3px 6px rgba(0,0,0,0.3);">${starPoints.total.toString()}</div>
                        <div style="font-size: 13px; opacity: 0.9; margin-top: 5px; font-weight: 600;">${(parseFloat(ethers.utils.formatEther(starPoints.total.mul(1000))) * 1000).toFixed(4)} ETH equivalent</div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; font-size: 13px; line-height: 1.6;">
                    <strong>💡 Note:</strong> Star Points are earned at a rate of <strong>1000 points per 1 ETH/BNB staked</strong>, awarded instantly and then every 7 days. Points accumulate across all chains.
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error looking up star points:', error);
        document.getElementById('starPointsDisplay').innerHTML = 
            `<p style="color: #f44336;">Error: ${error.message}</p>`;
    }
}

async function lookupUserStakes() {
    try {
        const userAddress = document.getElementById('lookupUserAddress').value.trim();
        
        if (!ethers.utils.isAddress(userAddress)) {
            alert('Invalid address!');
            return;
        }

        const stakesListEl = document.getElementById('userStakesList');
        stakesListEl.innerHTML = '<p class="text-muted">Loading stakes and star points...</p>';

        // Get user stakes from contract
        const stakes = await contract.getUserStakes(userAddress);

        // Get star points from both chains
        const starPoints = await getTotalStarPoints(userAddress);

        // Display star points
        const starPointsHtml = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="font-size: 48px;">⭐</div>
                    <div>
                        <h2 style="margin: 0; font-size: 24px;">Total Star Points</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Accumulated across all chains</p>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; backdrop-filter: blur(10px);">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">🟡 BSC Testnet</div>
                        <div style="font-size: 24px; font-weight: bold;">${starPoints.bsc.toString()}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; backdrop-filter: blur(10px);">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">🔵 Base Sepolia</div>
                        <div style="font-size: 24px; font-weight: bold;">${starPoints.base.toString()}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3);">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">✨ TOTAL</div>
                        <div style="font-size: 32px; font-weight: bold;">${starPoints.total.toString()}</div>
                    </div>
                </div>
            </div>
        `;

        if (stakes.length === 0) {
            stakesListEl.innerHTML = starPointsHtml + '<p class="text-muted">This user has no active stakes</p>';
            return;
        }

        const tierNames = ['COMET', 'METEOR', 'SUPERNOVA'];
        const now = Math.floor(Date.now() / 1000);

        const stakesHtml = stakes.map((stake, index) => {
            const amount = ethers.utils.formatEther(stake.amount);
            const startTime = new Date(Number(stake.startTime) * 1000).toLocaleString();
            const endTime = new Date(Number(stake.endTime) * 1000).toLocaleString();
            const isActive = !stake.withdrawn && Number(stake.endTime) > now;
            const tierName = tierNames[Number(stake.tier)] || 'Unknown';
            const rewardsClaimed = ethers.utils.formatEther(stake.rewardsClaimed);

            return `
                <div class="stake-item" style="background: ${isActive ? '#e8f5e9' : '#f5f5f5'}; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${isActive ? '#4CAF50' : '#999'};">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong style="font-size: 16px;">Stake ID: ${index}</strong>
                        <span style="background: ${isActive ? '#4CAF50' : '#999'}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                            ${isActive ? '✓ ACTIVE' : '✗ WITHDRAWN'}
                        </span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.8; color: #333;">
                        <strong>Amount:</strong> ${amount} ${getCurrentCurrency()}<br>
                        <strong>Tier:</strong> ${tierName}<br>
                        <strong>Start Time:</strong> ${startTime}<br>
                        <strong>End Time:</strong> ${endTime}<br>
                        <strong>Rewards Claimed:</strong> ${rewardsClaimed} ${getCurrentCurrency()}<br>
                        <strong>Token:</strong> ${stake.token === ethers.constants.AddressZero ? 'Native (BNB/ETH)' : stake.token}
                    </div>
                    ${isActive ? `
                        <button onclick="fillEmergencyWithdraw('${userAddress}', ${index})" 
                                style="margin-top: 10px; padding: 8px 15px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            🚨 Emergency Withdraw This Stake
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');

        stakesListEl.innerHTML = `
            ${starPointsHtml}
            <h3 style="margin-bottom: 15px;">Found ${stakes.length} stake(s) for ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}</h3>
            ${stakesHtml}
        `;

    } catch (error) {
        console.error('Error looking up stakes:', error);
        document.getElementById('userStakesList').innerHTML = 
            `<p style="color: #f44336;">Error: ${error.message}</p>`;
    }
}

function fillEmergencyWithdraw(userAddress, stakeId) {
    document.getElementById('emergencyUser').value = userAddress;
    document.getElementById('emergencyStakeId').value = stakeId;
    
    // Scroll to emergency section
    document.querySelector('#emergencyWithdraw').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight the fields
    document.getElementById('emergencyUser').style.background = '#fff3cd';
    document.getElementById('emergencyStakeId').style.background = '#fff3cd';
    
    setTimeout(() => {
        document.getElementById('emergencyUser').style.background = '';
        document.getElementById('emergencyStakeId').style.background = '';
    }, 2000);
}

async function togglePause() {
    try {
        const isPaused = await contract.paused();
        const tx = isPaused ? await contract.unpause() : await contract.pause();
        
        alert('Transaction sent! Waiting for confirmation...');
        await tx.wait();
        alert('Contract state updated!');
        
        await loadContractStatus();
    } catch (error) {
        console.error('Error toggling pause:', error);
        alert('Failed to toggle pause: ' + error.message);
    }
}

async function updateTier() {
    try {
        const lockingPeriodDays = parseInt(document.getElementById('lockingPeriod').value);
        const minInvestmentValue = document.getElementById('minInvestment').value;
        const apyRateValue = parseFloat(document.getElementById('apyRate').value);

        if (!lockingPeriodDays || !minInvestmentValue || !apyRateValue) {
            alert('Please fill in all fields');
            return;
        }

        const lockingPeriod = lockingPeriodDays * 86400; // Convert to seconds
        const minInvestment = ethers.utils.parseEther(minInvestmentValue);
        const apyRate = parseInt(apyRateValue * 100); // Convert to basis points

        const tierNames = ['COMET', 'METEOR', 'SUPERNOVA'];
        const confirm = window.confirm(
            `Update ${tierNames[currentTier]} Tier?\n\n` +
            `Locking Period: ${lockingPeriodDays} days\n` +
            `Min Investment: ${minInvestmentValue} ${getCurrentCurrency()}\n` +
            `APY Rate: ${apyRateValue}%\n\n` +
            `This will update the contract immediately.`
        );

        if (!confirm) return;

        console.log('Updating tier:', currentTier, {
            lockingPeriod,
            minInvestment: minInvestmentValue,
            apyRate: apyRateValue
        });

        const updateBtn = document.getElementById('updateTier');
        updateBtn.disabled = true;
        updateBtn.textContent = 'Updating...';

        const tx = await contract.updateTierInfo(currentTier, lockingPeriod, minInvestment, apyRate);
        
        console.log('Transaction sent:', tx.hash);
        updateBtn.textContent = 'Confirming...';
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        
        updateBtn.textContent = 'Update Tier';
        updateBtn.disabled = false;
        
        alert(`✅ Tier updated successfully!\n\nTransaction: ${tx.hash}\n\nFrontend will auto-update within 3 seconds.`);
        
        await loadTierInfo(currentTier);
    } catch (error) {
        console.error('Error updating tier:', error);
        alert('Failed to update tier: ' + error.message);
        
        const updateBtn = document.getElementById('updateTier');
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Tier';
    }
}

async function addAdmin() {
    try {
        const adminAddress = document.getElementById('adminAddress').value.trim();
        if (!ethers.utils.isAddress(adminAddress)) {
            alert('Invalid address!');
            return;
        }

        const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
        const tx = await contract.grantRole(DEFAULT_ADMIN_ROLE, adminAddress);
        
        alert('Transaction sent! Waiting for confirmation...');
        await tx.wait();
        alert('Admin added successfully!');
        
        document.getElementById('adminAddress').value = '';
        await loadAdminList();
    } catch (error) {
        console.error('Error adding admin:', error);
        alert('Failed to add admin: ' + error.message);
    }
}

async function removeAdmin() {
    try {
        const adminAddress = document.getElementById('adminAddress').value.trim();
        if (!ethers.utils.isAddress(adminAddress)) {
            alert('Invalid address!');
            return;
        }

        if (adminAddress.toLowerCase() === userAddress.toLowerCase()) {
            alert('You cannot remove yourself as admin!');
            return;
        }

        const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
        const tx = await contract.revokeRole(DEFAULT_ADMIN_ROLE, adminAddress);
        
        alert('Transaction sent! Waiting for confirmation...');
        await tx.wait();
        alert('Admin removed successfully!');
        
        document.getElementById('adminAddress').value = '';
        await loadAdminList();
    } catch (error) {
        console.error('Error removing admin:', error);
        alert('Failed to remove admin: ' + error.message);
    }
}

async function emergencyWithdraw() {
    try {
        const userAddr = document.getElementById('emergencyUser').value.trim();
        const stakeId = parseInt(document.getElementById('emergencyStakeId').value);

        if (!ethers.utils.isAddress(userAddr)) {
            alert('Invalid user address!');
            return;
        }

        if (isNaN(stakeId) || stakeId < 0) {
            alert('Invalid stake ID!');
            return;
        }

        const confirm = window.confirm(
            `⚠️ WARNING: This will force withdraw stake ${stakeId} for user ${userAddr}. Are you sure?`
        );

        if (!confirm) return;

        const tx = await contract.emergencyWithdrawByAdmin(userAddr, stakeId);
        
        alert('Transaction sent! Waiting for confirmation...');
        await tx.wait();
        alert('Emergency withdrawal completed!');
        
        document.getElementById('emergencyUser').value = '';
        document.getElementById('emergencyStakeId').value = '';
    } catch (error) {
        console.error('Error with emergency withdrawal:', error);
        alert('Failed to execute emergency withdrawal: ' + error.message);
    }
}

async function directWithdraw() {
    try {
        const amount = ethers.utils.parseEther(document.getElementById('withdrawAmount').value);
        const recipient = document.getElementById('withdrawRecipient').value.trim();

        if (!ethers.utils.isAddress(recipient)) {
            alert('Invalid recipient address!');
            return;
        }

        const confirm = window.confirm(
            `⚠️ Withdraw ${ethers.utils.formatEther(amount)} ${getCurrentCurrency()} to ${recipient}?\n\nThis will execute immediately.`
        );

        if (!confirm) return;

        // address(0) for native currency (BNB/ETH)
        const tx = await contract.adminWithdraw(ethers.constants.AddressZero, recipient, amount);
        
        alert('Transaction sent! Waiting for confirmation...');
        await tx.wait();
        alert('✅ Withdrawal successful!');
        
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('withdrawRecipient').value = '';
        
        await loadContractStatus();
    } catch (error) {
        console.error('Error withdrawing:', error);
        alert('Failed to withdraw: ' + error.message);
    }
}

async function requestWithdrawal() {
    try {
        const amount = ethers.utils.parseEther(document.getElementById('multiSigAmount').value);
        const recipient = document.getElementById('multiSigRecipient').value.trim();

        if (!ethers.utils.isAddress(recipient)) {
            alert('Invalid recipient address!');
            return;
        }

        const tx = await contract.requestWithdrawal(ethers.constants.AddressZero, recipient, amount);
        
        alert('Transaction sent! Waiting for confirmation...');
        await tx.wait();
        alert('Multi-sig withdrawal request created! Needs 3 admin approvals.');
        
        document.getElementById('multiSigAmount').value = '';
        document.getElementById('multiSigRecipient').value = '';
    } catch (error) {
        console.error('Error requesting withdrawal:', error);
        alert('Failed to request withdrawal: ' + error.message);
    }
}

function getCurrentCurrency() {
    if (!provider) return 'ETH';
    const network = provider.network;
    return NETWORKS[network.chainId]?.currency || 'ETH';
}

async function switchNetwork(chainId) {
    try {
        const network = NETWORKS[chainId];
        if (!network) {
            alert('Network not supported');
            return;
        }

        // Convert chainId to hex
        const chainIdHex = '0x' + chainId.toString(16);

        try {
            // Try to switch to the network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainIdHex }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    // Add the network
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: chainIdHex,
                            chainName: network.name,
                            nativeCurrency: {
                                name: network.currency,
                                symbol: network.currency,
                                decimals: 18
                            },
                            rpcUrls: [network.rpcUrl],
                            blockExplorerUrls: [network.explorer]
                        }],
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                    alert('Failed to add network: ' + addError.message);
                }
            } else {
                console.error('Error switching network:', switchError);
                alert('Failed to switch network: ' + switchError.message);
            }
        }
    } catch (error) {
        console.error('Error in switchNetwork:', error);
        alert('Failed to switch network: ' + error.message);
    }
}
