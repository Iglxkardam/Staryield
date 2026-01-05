// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IRewardPool
 * @dev Interface for the reward pool contract
 */
interface IRewardPool {
    function payReward(address _token, address _user, uint256 _amount) external;
}

/**
 * @title ReferralSystem
 * @dev Decentralized referral system with tier-based commissions
 * Features:
 * - User can set referrer once (immutable after set)
 * - Commission paid on stake amounts (not rewards)
 * - 5 tier levels based on total referral count
 * - Commissions claimable anytime
 * - Multi-chain support (BSC + Base)
 */
contract ReferralSystem is Ownable, ReentrancyGuard {
    // Referral tier thresholds
    uint256 public constant STARTER_THRESHOLD = 1;
    uint256 public constant BRONZE_THRESHOLD = 11;
    uint256 public constant SILVER_THRESHOLD = 26;
    uint256 public constant GOLD_THRESHOLD = 51;
    uint256 public constant PLATINUM_THRESHOLD = 100;

    // Commission rates (in basis points: 100 = 1%)
    uint256 public constant STARTER_COMMISSION = 500;   // 5%
    uint256 public constant BRONZE_COMMISSION = 700;    // 7%
    uint256 public constant SILVER_COMMISSION = 1000;   // 10%
    uint256 public constant GOLD_COMMISSION = 1200;     // 12%
    uint256 public constant PLATINUM_COMMISSION = 1500; // 15%

    // State variables
    IRewardPool public rewardPool;
    address public stakingContract;
    
    // Referral mappings
    mapping(address => address) public referrers; // user => their referrer
    mapping(address => address[]) public referredUsers; // referrer => list of referred users
    mapping(address => mapping(address => uint256)) public totalCommissionsByToken; // referrer => token => total commission earned
    mapping(address => mapping(address => uint256)) public unclaimedCommissionsByToken; // referrer => token => unclaimed commission
    
    // Track referral count per user (for level calculation)
    mapping(address => uint256) public referralCount;

    // Events
    event ReferrerSet(address indexed user, address indexed referrer);
    event CommissionEarned(
        address indexed referrer,
        address indexed referee,
        address indexed token,
        uint256 stakeAmount,
        uint256 commissionAmount,
        string level
    );
    event CommissionClaimed(
        address indexed user,
        address indexed token,
        uint256 amount
    );

    constructor(address _rewardPool) Ownable(msg.sender) {
        require(_rewardPool != address(0), "Invalid reward pool address");
        rewardPool = IRewardPool(_rewardPool);
    }

    /**
     * @dev Set the staking contract address (only owner)
     */
    function setStakingContract(address _stakingContract) external onlyOwner {
        require(_stakingContract != address(0), "Invalid staking contract");
        stakingContract = _stakingContract;
    }

    /**
     * @dev Set referrer for a user (can only be set once)
     */
    function setReferrer(address _referrer) external {
        require(referrers[msg.sender] == address(0), "Referrer already set");
        require(_referrer != msg.sender, "Cannot refer yourself");
        require(_referrer != address(0), "Invalid referrer address");
        
        referrers[msg.sender] = _referrer;
        referredUsers[_referrer].push(msg.sender);
        referralCount[_referrer]++;
        
        emit ReferrerSet(msg.sender, _referrer);
    }

    /**
     * @dev Record a stake and pay commission to referrer
     * Only callable by staking contract
     */
    function recordStake(
        address _staker,
        address _token,
        uint256 _stakeAmount
    ) external {
        require(msg.sender == stakingContract, "Only staking contract");
        
        address referrer = referrers[_staker];
        
        if (referrer != address(0)) {
            (string memory level, uint256 commissionRate) = getReferralLevel(referrer);
            uint256 commission = (_stakeAmount * commissionRate) / 10000;
            
            if (commission > 0) {
                unclaimedCommissionsByToken[referrer][_token] += commission;
                totalCommissionsByToken[referrer][_token] += commission;
                
                emit CommissionEarned(
                    referrer,
                    _staker,
                    _token,
                    _stakeAmount,
                    commission,
                    level
                );
            }
        }
    }

    /**
     * @dev Claim all commissions for a specific token
     */
    function claimCommission(address _token) external nonReentrant {
        uint256 amount = unclaimedCommissionsByToken[msg.sender][_token];
        require(amount > 0, "No commission to claim");
        
        unclaimedCommissionsByToken[msg.sender][_token] = 0;
        
        // Pay commission from reward pool
        rewardPool.payReward(_token, msg.sender, amount);
        
        emit CommissionClaimed(msg.sender, _token, amount);
    }

    /**
     * @dev Get referral level and commission rate based on referral count
     */
    function getReferralLevel(address _user) public view returns (string memory level, uint256 commissionRate) {
        uint256 count = referralCount[_user];
        
        if (count >= PLATINUM_THRESHOLD) {
            return ("Platinum", PLATINUM_COMMISSION);
        } else if (count >= GOLD_THRESHOLD) {
            return ("Gold", GOLD_COMMISSION);
        } else if (count >= SILVER_THRESHOLD) {
            return ("Silver", SILVER_COMMISSION);
        } else if (count >= BRONZE_THRESHOLD) {
            return ("Bronze", BRONZE_COMMISSION);
        } else if (count >= STARTER_THRESHOLD) {
            return ("Starter", STARTER_COMMISSION);
        } else {
            return ("None", 0);
        }
    }

    /**
     * @dev Check if user has a referrer
     */
    function hasReferrer(address _user) external view returns (bool) {
        return referrers[_user] != address(0);
    }

    /**
     * @dev Get referrer address for a user
     */
    function getReferrer(address _user) external view returns (address) {
        return referrers[_user];
    }

    /**
     * @dev Get all referred users for a referrer
     */
    function getReferredUsers(address _referrer) external view returns (address[] memory) {
        return referredUsers[_referrer];
    }

    /**
     * @dev Get total referral count for a user
     */
    function getReferralCount(address _user) external view returns (uint256) {
        return referralCount[_user];
    }

    /**
     * @dev Get unclaimed commission for specific token
     */
    function getUnclaimedCommission(address _user, address _token) external view returns (uint256) {
        return unclaimedCommissionsByToken[_user][_token];
    }

    /**
     * @dev Get total commission earned for specific token
     */
    function getTotalCommission(address _user, address _token) external view returns (uint256) {
        return totalCommissionsByToken[_user][_token];
    }

    /**
     * @dev Get comprehensive referral stats for a user
     */
    function getReferralStats(address _user, address _token) external view returns (
        uint256 totalReferrals,
        string memory currentLevel,
        uint256 commissionRate,
        uint256 totalCommissionEarned,
        uint256 unclaimedCommission,
        address[] memory referredUsersList
    ) {
        (string memory level, uint256 rate) = getReferralLevel(_user);
        
        return (
            referralCount[_user],
            level,
            rate,
            totalCommissionsByToken[_user][_token],
            unclaimedCommissionsByToken[_user][_token],
            referredUsers[_user]
        );
    }

    /**
     * @dev Update reward pool address (only owner)
     */
    function updateRewardPool(address _newRewardPool) external onlyOwner {
        require(_newRewardPool != address(0), "Invalid reward pool address");
        rewardPool = IRewardPool(_newRewardPool);
    }
}
