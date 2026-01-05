// Reward Pool Admin Panel

const REWARD_POOLS = {
    97: '0x259f2AC8BB77E575ADD1B859D7AFc57Eb5CD05D0', // BSC Testnet
    84532: '0x1018Ea97C3540d9dB123392705096f5B93cD46C9' // Base Sepolia
};

const STAKING_CONTRACTS = {
    97: '0xC0e13855dEcA38359243c27f10b0106Cf5B96E5D', // BSC Testnet
    84532: '0x1DaC05A37C42480E723099c8c72C1EaE761eEA2F'  // Base Sepolia
};

const NETWORKS = {
    97: {
        name: 'BNB Testnet',
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        currency: 'BNB'
    },
    84532: {
        name: 'Base Sepolia',
        rpcUrl: 'https://sepolia.base.org',
        currency: 'ETH'
    }
};

// RewardPool ABI
const REWARD_POOL_ABI = [
    "function depositBNB() external payable",
    "function depositToken(address token, uint256 amount) external",
    "function payReward(address token, address user, uint256 amount) external",
    "function payPrincipal(address token, address user, uint256 amount) external",
    "function addStakingContract(address stakingContract) external",
    "function removeStakingContract(address stakingContract) external",
    "function emergencyWithdrawBNB(address to, uint256 amount) external",
    "function emergencyWithdrawToken(address token, address to, uint256 amount) external",
    "function getBalance(address token) external view returns (uint256)",
    "function hasRole(bytes32 role, address account) external view returns (bool)",
    "function grantRole(bytes32 role, address account) external",
    "function DEFAULT_ADMIN_ROLE() external view returns (bytes32)",
    "function FUND_MANAGER_ROLE() external view returns (bytes32)",
    "function STAKING_CONTRACT_ROLE() external view returns (bytes32)",
    "event FundsDeposited(address indexed token, address indexed from, uint256 amount)",
    "event RewardPaid(address indexed token, address indexed user, uint256 amount)",
    "event PrincipalPaid(address indexed token, address indexed user, uint256 amount)",
    "event FundsWithdrawn(address indexed token, address indexed to, uint256 amount)"
];

let provider;
let signer;
let rewardPoolContract;
let userAddress;
let currentChainId;

// Initialize on page load
window.addEventListener('load', async () => {
    if (typeof ethers === 'undefined') {
        alert('Ethers.js failed to load. Please refresh the page.');
        return;
    }
    
    setupEventListeners();
    checkWalletConnection();
});

function setupEventListeners() {
    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }

    // Network switcher buttons
    document.getElementById('switchToBSC')?.addEventListener('click', () => switchNetwork(97));
    document.getElementById('switchToBase')?.addEventListener('click', () => switchNetwork(84532));
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
            alert('Please install MetaMask!');
            return;
        }

        console.log('Connecting wallet...');
        
        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        console.log('Accounts:', accounts);

        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        console.log('Connected address:', userAddress);

        // Get network
        const network = await provider.getNetwork();
        currentChainId = network.chainId;
        
        console.log('Network:', currentChainId);

        // Check if network is supported
        if (!REWARD_POOLS[currentChainId]) {
            alert(`Unsupported network! Please switch to BNB Testnet (Chain ID: 97) or Base Sepolia (Chain ID: 84532).`);
            return;
        }

        // Initialize contract
        const rewardPoolAddress = REWARD_POOLS[currentChainId];
        rewardPoolContract = new ethers.Contract(rewardPoolAddress, REWARD_POOL_ABI, signer);

        console.log('RewardPool contract initialized:', rewardPoolAddress);

        // Update UI
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('walletInfo').style.display = 'flex';
        document.getElementById('networkSwitcher').style.display = 'flex';
        document.getElementById('walletAddress').textContent = 
            userAddress.substring(0, 6) + '...' + userAddress.substring(38);
        document.getElementById('walletNetwork').textContent = NETWORKS[currentChainId].name;
        document.getElementById('currentNetwork').textContent = NETWORKS[currentChainId].name;
        document.getElementById('depositNetwork').textContent = NETWORKS[currentChainId].name;
        document.getElementById('depositCurrency').textContent = NETWORKS[currentChainId].currency;

        // Update network button states
        updateNetworkButtons();

        // Load pool data for BOTH chains
        await loadAllPoolBalances();

        // Listen for network changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                window.location.reload();
            } else {
                window.location.reload();
            }
        });

    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet: ' + error.message);
    }
}

async function loadAllPoolBalances() {
    try {
        // Load BSC balance
        await loadChainBalance(97, 'bscBalance');
        
        // Load Base balance
        await loadChainBalance(84532, 'baseBalance');

    } catch (error) {
        console.error('Error loading pool balances:', error);
    }
}

async function loadChainBalance(chainId, elementId) {
    try {
        const rpcProvider = new ethers.providers.JsonRpcProvider(NETWORKS[chainId].rpcUrl);
        const poolAddress = REWARD_POOLS[chainId];
        
        const balance = await rpcProvider.getBalance(poolAddress);
        const balanceFormatted = ethers.utils.formatEther(balance);
        const currency = NETWORKS[chainId].currency;
        
        const element = document.getElementById(elementId);
        element.textContent = `${parseFloat(balanceFormatted).toFixed(4)} ${currency}`;
        
        // Color code based on balance
        if (parseFloat(balanceFormatted) < 0.1) {
            element.style.color = '#ff9800'; // Orange - low
        } else if (parseFloat(balanceFormatted) < 1) {
            element.style.color = '#ffc107'; // Yellow - medium
        } else {
            element.style.color = '#4CAF50'; // Green - good
        }
        
        console.log(`${NETWORKS[chainId].name} balance:`, balanceFormatted, currency);
    } catch (error) {
        console.error(`Error loading ${NETWORKS[chainId].name} balance:`, error);
        document.getElementById(elementId).textContent = 'Error loading';
        document.getElementById(elementId).style.color = '#f44336';
    }
}

async function switchNetwork(targetChainId) {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask!');
            return;
        }

        const chainIdHex = '0x' + targetChainId.toString(16);
        
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainIdHex }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    const networkConfig = getNetworkConfig(targetChainId);
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkConfig],
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

function getNetworkConfig(chainId) {
    const configs = {
        97: {
            chainId: '0x61',
            chainName: 'BNB Smart Chain Testnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
            blockExplorerUrls: ['https://testnet.bscscan.com']
        },
        84532: {
            chainId: '0x14a34',
            chainName: 'Base Sepolia',
            nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org']
        }
    };
    return configs[chainId];
}

function updateNetworkButtons() {
    const bscBtn = document.getElementById('switchToBSC');
    const baseBtn = document.getElementById('switchToBase');
    
    if (bscBtn && baseBtn) {
        bscBtn.classList.remove('active');
        baseBtn.classList.remove('active');
        
        if (currentChainId === 97) {
            bscBtn.classList.add('active');
            bscBtn.style.opacity = '1';
            baseBtn.style.opacity = '0.6';
        } else if (currentChainId === 84532) {
            baseBtn.classList.add('active');
            baseBtn.style.opacity = '1';
            bscBtn.style.opacity = '0.6';
        }
    }
}

async function depositNative() {
    try {
        const amount = document.getElementById('depositAmount').value;
        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const amountWei = ethers.utils.parseEther(amount);
        
        if (!confirm(`Deposit ${amount} ${NETWORKS[currentChainId].currency} to Reward Pool?`)) {
            return;
        }

        console.log('Depositing:', amount, NETWORKS[currentChainId].currency);

        const tx = await rewardPoolContract.depositBNB({
            value: amountWei
        });

        console.log('Transaction sent:', tx.hash);
        alert('Transaction sent! Hash: ' + tx.hash);

        await tx.wait();
        alert('Deposit successful!');
        
        // Reload all pool balances
        await loadAllPoolBalances();
        document.getElementById('depositAmount').value = '';

    } catch (error) {
        console.error('Error depositing:', error);
        alert('Deposit failed: ' + error.message);
    }
}

async function authorizeStakingContract() {
    try {
        const contractAddress = document.getElementById('stakingContractAddress').value;
        
        if (!contractAddress || !ethers.utils.isAddress(contractAddress)) {
            alert('Please enter a valid contract address');
            return;
        }

        if (!confirm(`Authorize staking contract: ${contractAddress}?`)) {
            return;
        }

        console.log('Authorizing contract:', contractAddress);

        const tx = await rewardPoolContract.addStakingContract(contractAddress);
        
        console.log('Transaction sent:', tx.hash);
        alert('Transaction sent! Hash: ' + tx.hash);

        await tx.wait();
        alert('Contract authorized successfully!');
        
        document.getElementById('stakingContractAddress').value = '';

    } catch (error) {
        console.error('Error authorizing contract:', error);
        alert('Authorization failed: ' + error.message);
    }
}

async function emergencyWithdraw() {
    try {
        const recipient = document.getElementById('emergencyRecipient').value;
        const amount = document.getElementById('emergencyAmount').value;

        if (!recipient || !ethers.utils.isAddress(recipient)) {
            alert('Please enter a valid recipient address');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const amountWei = ethers.utils.parseEther(amount);

        if (!confirm(`⚠️ EMERGENCY WITHDRAW\n\nWithdraw ${amount} ${NETWORKS[currentChainId].currency} to ${recipient}?\n\nThis is irreversible!`)) {
            return;
        }

        console.log('Emergency withdraw:', amount, 'to', recipient);

        const tx = await rewardPoolContract.emergencyWithdrawBNB(recipient, amountWei);
        
        console.log('Transaction sent:', tx.hash);
        alert('Transaction sent! Hash: ' + tx.hash);

        await tx.wait();
        alert('Emergency withdrawal successful!');
        
        // Reload all pool balances
        await loadAllPoolBalances();
        document.getElementById('emergencyRecipient').value = '';
        document.getElementById('emergencyAmount').value = '';

    } catch (error) {
        console.error('Error with emergency withdrawal:', error);
        alert('Emergency withdrawal failed: ' + error.message);
    }
}

// Auto-fill staking contract address for convenience
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (currentChainId && STAKING_CONTRACTS[currentChainId]) {
            const input = document.getElementById('stakingContractAddress');
            if (input && !input.value) {
                input.placeholder = 'Current: ' + STAKING_CONTRACTS[currentChainId];
            }
        }
    }, 1000);
});
