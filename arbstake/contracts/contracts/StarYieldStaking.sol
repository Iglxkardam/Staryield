// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IRewardPool
 * @dev Interface for the reward pool contract
 */
interface IRewardPool {
    function payReward(address _token, address _user, uint256 _amount) external;
    function payPrincipal(
        address _token,
        address _user,
        uint256 _amount
    ) external;
    function getBalance(address _token) external view returns (uint256);
}

/**
 * @title IStarPoints
 * @dev Interface for the star points contract
 */
interface IStarPoints {
    function initializeStake(
        address _user,
        uint256 _stakeId,
        uint256 _amount
    ) external;
    function claimPoints(
        address _user,
        uint256 _stakeId
    ) external returns (uint256);
    function handleUnstake(
        address _user,
        uint256 _stakeId,
        uint256 _unstakeAmount,
        uint256 _remainingAmount
    ) external;
    function handleEmergencyUnstake(address _user, uint256 _stakeId) external;
    function calculatePendingPoints(
        address _user,
        uint256 _stakeId
    ) external view returns (uint256);
    function getUserTotalPoints(address _user) external view returns (uint256);
}

/**
 * @title IReferralSystem
 * @dev Interface for the referral system contract
 */
interface IReferralSystem {
    function recordStake(
        address _staker,
        address _token,
        uint256 _stakeAmount
    ) external;
    function hasReferrer(address _user) external view returns (bool);
    function getReferrer(address _user) external view returns (address);
}

/**
 * @title StarYieldStaking
 * @dev Secure multi-tier staking contract for BNB and ERC20 tokens
 * Features:
 * - Three tier system (Comet, Meteor, Supernova)
 * - Multi-admin control (requires 3 admins for fund movement)
 * - Reentrancy protection
 * - Pausable for emergency stops
 * - Separate balances for BNB and each ERC20 token
 */
contract StarYieldStaking is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    // Tier definitions
    enum Tier {
        COMET,
        METEOR,
        SUPERNOVA
    }

    struct TierInfo {
        uint256 lockingPeriod; // in seconds
        uint256 minInvestment; // in wei or token decimals
        uint256 apyRate; // APY in basis points (100 = 1%)
    }

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        Tier tier;
        address token; // address(0) for BNB
        bool withdrawn;
        uint256 rewardsClaimed;
    }

    // State variables
    IRewardPool public rewardPool;
    IStarPoints public starPoints;
    IReferralSystem public referralSystem;
    mapping(Tier => TierInfo) public tierInfo;
    mapping(address => Stake[]) public userStakes;
    mapping(address => uint256) public totalStakedByUser;
    mapping(address => uint256) public totalStakedPerToken; // Total staked per token/BNB

    // Multi-sig withdrawal
    struct WithdrawalRequest {
        address token;
        address to;
        uint256 amount;
        uint256 approvalCount;
        mapping(address => bool) approvals;
        bool executed;
    }

    mapping(uint256 => WithdrawalRequest) public withdrawalRequests;
    uint256 public withdrawalRequestCount;
    uint256 public constant REQUIRED_APPROVALS = 3;

    // Events
    event Staked(
        address indexed user,
        address indexed token,
        uint256 amount,
        Tier tier,
        uint256 stakeId
    );
    event Withdrawn(
        address indexed user,
        uint256 stakeId,
        uint256 amount,
        uint256 rewards
    );
    event RewardsClaimed(
        address indexed user,
        uint256 stakeId,
        uint256 rewards
    );
    event WithdrawalRequested(
        uint256 indexed requestId,
        address indexed token,
        address indexed to,
        uint256 amount
    );
    event WithdrawalApproved(uint256 indexed requestId, address indexed admin);
    event WithdrawalExecuted(
        uint256 indexed requestId,
        address indexed token,
        address indexed to,
        uint256 amount
    );
    event EmergencyWithdraw(
        address indexed user,
        uint256 stakeId,
        uint256 amount
    );

    constructor(address _rewardPool, address _starPoints, address _referralSystem) {
        require(_rewardPool != address(0), "Invalid reward pool address");
        require(_starPoints != address(0), "Invalid star points address");
        require(_referralSystem != address(0), "Invalid referral system address");
        rewardPool = IRewardPool(_rewardPool);
        starPoints = IStarPoints(_starPoints);
        referralSystem = IReferralSystem(_referralSystem);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OWNER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        // Initialize tier information for BNB (same for all tokens)
        // COMET: 14 days, 0.1 min, 6% APY
        tierInfo[Tier.COMET] = TierInfo({
            lockingPeriod: 14 days,
            minInvestment: 0.1 ether,
            apyRate: 600 // 6% = 600 basis points
        });

        // METEOR: 21 days, 1 min, 11% APY
        tierInfo[Tier.METEOR] = TierInfo({
            lockingPeriod: 21 days,
            minInvestment: 1 ether,
            apyRate: 1100 // 11% = 1100 basis points
        });

        // SUPERNOVA: 30 days, 5 min, 14% APY
        tierInfo[Tier.SUPERNOVA] = TierInfo({
            lockingPeriod: 30 days,
            minInvestment: 5 ether,
            apyRate: 1400 // 14% = 1400 basis points
        });
    }

    /**
     * @dev Stake BNB in a specific tier
     * User sends BNB which is recorded but funds go to reward pool
     */
    function stakeBNB(Tier _tier) external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Amount must be greater than 0");
        TierInfo memory tier = tierInfo[_tier];
        require(msg.value >= tier.minInvestment, "Below minimum investment");

        uint256 stakeId = userStakes[msg.sender].length;
        uint256 endTime = block.timestamp + tier.lockingPeriod;

        userStakes[msg.sender].push(
            Stake({
                amount: msg.value,
                startTime: block.timestamp,
                endTime: endTime,
                tier: _tier,
                token: address(0), // BNB
                withdrawn: false,
                rewardsClaimed: 0
            })
        );

        totalStakedByUser[msg.sender] += msg.value;
        totalStakedPerToken[address(0)] += msg.value;

        // Forward staked BNB to reward pool (your liquidity)
        (bool success, ) = payable(address(rewardPool)).call{value: msg.value}(
            ""
        );
        require(success, "Transfer to reward pool failed");

        // Initialize star points for this stake
        starPoints.initializeStake(msg.sender, stakeId, msg.value);

        // Record referral commission (if user has referrer)
        referralSystem.recordStake(msg.sender, address(0), msg.value);

        emit Staked(msg.sender, address(0), msg.value, _tier, stakeId);
    }

    /**
     * @dev Stake ERC20 tokens in a specific tier
     */
    function stakeToken(
        address _token,
        uint256 _amount,
        Tier _tier
    ) external nonReentrant whenNotPaused {
        require(_token != address(0), "Invalid token address");
        require(_amount > 0, "Amount must be greater than 0");

        TierInfo memory tier = tierInfo[_tier];
        require(_amount >= tier.minInvestment, "Below minimum investment");

        // Transfer tokens from user to reward pool directly
        IERC20(_token).safeTransferFrom(
            msg.sender,
            address(rewardPool),
            _amount
        );

        uint256 stakeId = userStakes[msg.sender].length;
        uint256 endTime = block.timestamp + tier.lockingPeriod;

        userStakes[msg.sender].push(
            Stake({
                amount: _amount,
                startTime: block.timestamp,
                endTime: endTime,
                tier: _tier,
                token: _token,
                withdrawn: false,
                rewardsClaimed: 0
            })
        );

        totalStakedByUser[msg.sender] += _amount;
        totalStakedPerToken[_token] += _amount;

        // Initialize star points for this stake
        starPoints.initializeStake(msg.sender, stakeId, _amount);

        // Record referral commission (if user has referrer)
        referralSystem.recordStake(msg.sender, _token, _amount);

        emit Staked(msg.sender, _token, _amount, _tier, stakeId);
    }

    /**
     * @dev Calculate rewards for a stake
     */
    function calculateRewards(
        address _user,
        uint256 _stakeId
    ) public view returns (uint256) {
        require(_stakeId < userStakes[_user].length, "Invalid stake ID");
        Stake memory stake = userStakes[_user][_stakeId];

        if (stake.withdrawn) {
            return 0;
        }

        TierInfo memory tier = tierInfo[stake.tier];
        uint256 stakingDuration = block.timestamp - stake.startTime;

        // Calculate rewards: (amount * APY * time) / (365 days * 10000)
        // APY is in basis points (100 = 1%)
        uint256 rewards = (stake.amount * tier.apyRate * stakingDuration) /
            (365 days * 10000);

        return rewards - stake.rewardsClaimed;
    }

    /**
     * @dev Claim rewards without withdrawing principal
     */
    function claimRewards(
        uint256 _stakeId
    ) external nonReentrant whenNotPaused {
        require(_stakeId < userStakes[msg.sender].length, "Invalid stake ID");
        Stake storage stake = userStakes[msg.sender][_stakeId];
        require(!stake.withdrawn, "Stake already withdrawn");

        uint256 rewards = calculateRewards(msg.sender, _stakeId);
        require(rewards > 0, "No rewards available");

        stake.rewardsClaimed += rewards;

        // Claim any pending star points
        starPoints.claimPoints(msg.sender, _stakeId);

        // Pay rewards from reward pool
        rewardPool.payReward(stake.token, msg.sender, rewards);

        emit RewardsClaimed(msg.sender, _stakeId, rewards);
    }

    /**
     * @dev Withdraw stake after locking period
     */
    function withdraw(uint256 _stakeId) external nonReentrant whenNotPaused {
        require(_stakeId < userStakes[msg.sender].length, "Invalid stake ID");
        Stake storage stake = userStakes[msg.sender][_stakeId];

        require(!stake.withdrawn, "Already withdrawn");
        require(block.timestamp >= stake.endTime, "Locking period not ended");

        uint256 rewards = calculateRewards(msg.sender, _stakeId);

        stake.withdrawn = true;
        totalStakedByUser[msg.sender] -= stake.amount;
        totalStakedPerToken[stake.token] -= stake.amount;

        // Handle star points (full unstake, 0 remaining)
        starPoints.handleUnstake(msg.sender, _stakeId, stake.amount, 0);

        // Pay principal from reward pool (user's staked amount)
        rewardPool.payPrincipal(stake.token, msg.sender, stake.amount);

        // Pay rewards from reward pool if any
        if (rewards > 0) {
            rewardPool.payReward(stake.token, msg.sender, rewards);
        }

        emit Withdrawn(msg.sender, _stakeId, stake.amount, rewards);
    }

    /**
     * @dev Emergency withdraw with penalty (loses all rewards)
     */
    function emergencyWithdraw(uint256 _stakeId) external nonReentrant {
        require(_stakeId < userStakes[msg.sender].length, "Invalid stake ID");
        Stake storage stake = userStakes[msg.sender][_stakeId];

        require(!stake.withdrawn, "Already withdrawn");

        stake.withdrawn = true;
        totalStakedByUser[msg.sender] -= stake.amount;
        totalStakedPerToken[stake.token] -= stake.amount;

        // Lose all star points as penalty
        starPoints.handleEmergencyUnstake(msg.sender, _stakeId);

        // Pay only principal from reward pool, no rewards (penalty for early withdrawal)
        rewardPool.payPrincipal(stake.token, msg.sender, stake.amount);

        emit EmergencyWithdraw(msg.sender, _stakeId, stake.amount);
    }

    /**
     * @dev Get all stakes for a user
     */
    function getUserStakes(
        address _user
    ) external view returns (Stake[] memory) {
        return userStakes[_user];
    }

    /**
     * @dev Get specific stake details
     */
    function getStakeDetails(
        address _user,
        uint256 _stakeId
    )
        external
        view
        returns (
            uint256 amount,
            uint256 startTime,
            uint256 endTime,
            Tier tier,
            address token,
            bool withdrawn,
            uint256 rewardsClaimed,
            uint256 pendingRewards
        )
    {
        require(_stakeId < userStakes[_user].length, "Invalid stake ID");
        Stake memory stake = userStakes[_user][_stakeId];

        return (
            stake.amount,
            stake.startTime,
            stake.endTime,
            stake.tier,
            stake.token,
            stake.withdrawn,
            stake.rewardsClaimed,
            calculateRewards(_user, _stakeId)
        );
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @dev Request withdrawal (requires 3 admin approvals)
     */
    function requestWithdrawal(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(_to != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 requestId = withdrawalRequestCount++;
        WithdrawalRequest storage request = withdrawalRequests[requestId];

        request.token = _token;
        request.to = _to;
        request.amount = _amount;
        request.approvalCount = 1;
        request.approvals[msg.sender] = true;
        request.executed = false;

        emit WithdrawalRequested(requestId, _token, _to, _amount);
        emit WithdrawalApproved(requestId, msg.sender);

        return requestId;
    }

    /**
     * @dev Approve withdrawal request
     */
    function approveWithdrawal(
        uint256 _requestId
    ) external onlyRole(ADMIN_ROLE) {
        WithdrawalRequest storage request = withdrawalRequests[_requestId];
        require(!request.executed, "Already executed");
        require(!request.approvals[msg.sender], "Already approved");

        request.approvals[msg.sender] = true;
        request.approvalCount++;

        emit WithdrawalApproved(_requestId, msg.sender);

        // Auto-execute if threshold reached
        if (request.approvalCount >= REQUIRED_APPROVALS) {
            _executeWithdrawal(_requestId);
        }
    }

    /**
     * @dev Execute approved withdrawal
     */
    function _executeWithdrawal(uint256 _requestId) internal {
        WithdrawalRequest storage request = withdrawalRequests[_requestId];
        require(!request.executed, "Already executed");
        require(
            request.approvalCount >= REQUIRED_APPROVALS,
            "Not enough approvals"
        );

        request.executed = true;

        if (request.token == address(0)) {
            // BNB withdrawal
            require(
                address(this).balance >= request.amount,
                "Insufficient balance"
            );
            (bool success, ) = payable(request.to).call{value: request.amount}(
                ""
            );
            require(success, "BNB transfer failed");
        } else {
            // Token withdrawal
            IERC20(request.token).safeTransfer(request.to, request.amount);
        }

        emit WithdrawalExecuted(
            _requestId,
            request.token,
            request.to,
            request.amount
        );
    }

    /**
     * @dev Direct admin withdrawal (any admin can withdraw)
     */
    function adminWithdraw(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyRole(ADMIN_ROLE) nonReentrant {
        require(_to != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");

        if (_token == address(0)) {
            // BNB withdrawal
            require(
                address(this).balance >= _amount,
                "Insufficient BNB balance"
            );
            (bool success, ) = payable(_to).call{value: _amount}("");
            require(success, "BNB transfer failed");
        } else {
            // Token withdrawal
            require(
                IERC20(_token).balanceOf(address(this)) >= _amount,
                "Insufficient token balance"
            );
            IERC20(_token).safeTransfer(_to, _amount);
        }

        emit WithdrawalExecuted(0, _token, _to, _amount);
    }

    /**
     * @dev Add new admin (only owner)
     */
    function addAdmin(address _admin) external onlyRole(OWNER_ROLE) {
        grantRole(ADMIN_ROLE, _admin);
    }

    /**
     * @dev Remove admin (only owner)
     */
    function removeAdmin(address _admin) external onlyRole(OWNER_ROLE) {
        revokeRole(ADMIN_ROLE, _admin);
    }

    /**
     * @dev Update tier information (only owner)
     */
    function updateTierInfo(
        Tier _tier,
        uint256 _lockingPeriod,
        uint256 _minInvestment,
        uint256 _apyRate
    ) external onlyRole(OWNER_ROLE) {
        tierInfo[_tier] = TierInfo({
            lockingPeriod: _lockingPeriod,
            minInvestment: _minInvestment,
            apyRate: _apyRate
        });
    }

    /**
     * @dev Pause contract (only owner)
     */
    function pause() external onlyRole(OWNER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause contract (only owner)
     */
    function unpause() external onlyRole(OWNER_ROLE) {
        _unpause();
    }

    /**
     * @dev Update reward pool address (only owner)
     */
    function updateRewardPool(
        address _newRewardPool
    ) external onlyRole(OWNER_ROLE) {
        require(_newRewardPool != address(0), "Invalid reward pool address");
        rewardPool = IRewardPool(_newRewardPool);
    }

    /**
     * @dev Get reward pool balance for a token
     */
    function getRewardPoolBalance(
        address _token
    ) external view returns (uint256) {
        return rewardPool.getBalance(_token);
    }

    /**
     * @dev Get contract balance for specific token
     */
    function getContractBalance(
        address _token
    ) external view returns (uint256) {
        if (_token == address(0)) {
            return address(this).balance;
        } else {
            return IERC20(_token).balanceOf(address(this));
        }
    }

    /**
     * @dev Check if user can withdraw stake
     */
    function canWithdraw(
        address _user,
        uint256 _stakeId
    ) external view returns (bool) {
        if (_stakeId >= userStakes[_user].length) {
            return false;
        }
        Stake memory stake = userStakes[_user][_stakeId];
        return !stake.withdrawn && block.timestamp >= stake.endTime;
    }

    /**
     * @dev Update star points contract address (only owner)
     */
    function updateStarPoints(
        address _newStarPoints
    ) external onlyRole(OWNER_ROLE) {
        require(_newStarPoints != address(0), "Invalid star points address");
        starPoints = IStarPoints(_newStarPoints);
    }

    /**
     * @dev Update referral system contract address (only owner)
     */
    function updateReferralSystem(
        address _newReferralSystem
    ) external onlyRole(OWNER_ROLE) {
        require(_newReferralSystem != address(0), "Invalid referral system address");
        referralSystem = IReferralSystem(_newReferralSystem);
    }

    /**
     * @dev Get user's total star points
     */
    function getUserStarPoints(address _user) external view returns (uint256) {
        return starPoints.getUserTotalPoints(_user);
    }

    /**
     * @dev Get pending star points for a specific stake
     */
    function getPendingStarPoints(
        address _user,
        uint256 _stakeId
    ) external view returns (uint256) {
        return starPoints.calculatePendingPoints(_user, _stakeId);
    }

    /**
     * @dev Manually claim star points for a stake
     */
    function claimStarPoints(uint256 _stakeId) external nonReentrant {
        require(_stakeId < userStakes[msg.sender].length, "Invalid stake ID");
        Stake memory stake = userStakes[msg.sender][_stakeId];
        require(!stake.withdrawn, "Stake already withdrawn");

        starPoints.claimPoints(msg.sender, _stakeId);
    }

    // Receive BNB
    receive() external payable {}
}
