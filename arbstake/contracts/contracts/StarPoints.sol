// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StarPoints
 * @dev Manages star points system for staking platform
 * Features:
 * - Points awarded on staking: 1 ETH/BNB = 1000 points
 * - Recurring points every 7 days from stake date
 * - Proportional point deduction on unstake
 * - Only authorized staking contract can manage points
 */
contract StarPoints is AccessControl, ReentrancyGuard {
    bytes32 public constant STAKING_CONTRACT_ROLE =
        keccak256("STAKING_CONTRACT_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Constants
    uint256 public constant POINTS_PER_ETH = 1000; // 1 ETH/BNB = 1000 points
    uint256 public constant POINTS_INTERVAL = 7 days; // Points awarded every 7 days

    // User points tracking
    mapping(address => uint256) public userTotalPoints;

    // Stake-specific points tracking
    struct StakePoints {
        uint256 totalPoints; // Total points earned from this stake
        uint256 lastClaimTime; // Last time points were claimed
        uint256 stakeAmount; // Amount staked (for calculation)
        uint256 stakeStartTime; // When stake was created
        bool active; // Whether stake is still active
    }

    // user => stakeId => StakePoints
    mapping(address => mapping(uint256 => StakePoints)) public stakePoints;

    // Events
    event PointsAwarded(
        address indexed user,
        uint256 indexed stakeId,
        uint256 points,
        string reason
    );
    event PointsDeducted(
        address indexed user,
        uint256 indexed stakeId,
        uint256 points,
        string reason
    );
    event PointsClaimed(
        address indexed user,
        uint256 indexed stakeId,
        uint256 points
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Calculate points based on amount staked
     * @param _amount Amount in wei (18 decimals)
     * @return Points to award
     */
    function calculatePoints(uint256 _amount) public pure returns (uint256) {
        // 1 ETH = 1000 points
        // For any amount: (amount * 1000) / 1 ETH
        return (_amount * POINTS_PER_ETH) / 1 ether;
    }

    /**
     * @dev Initialize stake and award initial points
     * Called when user creates a new stake
     */
    function initializeStake(
        address _user,
        uint256 _stakeId,
        uint256 _amount
    ) external onlyRole(STAKING_CONTRACT_ROLE) nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            !stakePoints[_user][_stakeId].active,
            "Stake already initialized"
        );

        uint256 initialPoints = calculatePoints(_amount);

        stakePoints[_user][_stakeId] = StakePoints({
            totalPoints: initialPoints,
            lastClaimTime: block.timestamp,
            stakeAmount: _amount,
            stakeStartTime: block.timestamp,
            active: true
        });

        userTotalPoints[_user] += initialPoints;

        emit PointsAwarded(_user, _stakeId, initialPoints, "Initial stake");
    }

    /**
     * @dev Calculate pending points for a stake
     * Points are awarded every 7 days from the last claim time
     */
    function calculatePendingPoints(
        address _user,
        uint256 _stakeId
    ) public view returns (uint256) {
        StakePoints memory sp = stakePoints[_user][_stakeId];

        if (!sp.active) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - sp.lastClaimTime;
        uint256 intervals = timeElapsed / POINTS_INTERVAL;

        if (intervals == 0) {
            return 0;
        }

        // Calculate points for each completed 7-day interval
        uint256 pointsPerInterval = calculatePoints(sp.stakeAmount);
        return intervals * pointsPerInterval;
    }

    /**
     * @dev Claim pending points for a stake
     * Can be called manually or automatically on other operations
     */
    function claimPoints(
        address _user,
        uint256 _stakeId
    ) public onlyRole(STAKING_CONTRACT_ROLE) nonReentrant returns (uint256) {
        return _claimPoints(_user, _stakeId);
    }

    /**
     * @dev Internal function to claim points without reentrancy guard
     */
    function _claimPoints(
        address _user,
        uint256 _stakeId
    ) internal returns (uint256) {
        StakePoints storage sp = stakePoints[_user][_stakeId];
        require(sp.active, "Stake not active");

        uint256 pendingPoints = calculatePendingPoints(_user, _stakeId);

        if (pendingPoints > 0) {
            uint256 timeElapsed = block.timestamp - sp.lastClaimTime;
            uint256 intervals = timeElapsed / POINTS_INTERVAL;

            // Update last claim time to the last completed interval
            sp.lastClaimTime += (intervals * POINTS_INTERVAL);
            sp.totalPoints += pendingPoints;
            userTotalPoints[_user] += pendingPoints;

            emit PointsClaimed(_user, _stakeId, pendingPoints);
        }

        return pendingPoints;
    }

    /**
     * @dev Handle partial or full unstake
     * Deducts points proportionally to amount unstaked
     */
    function handleUnstake(
        address _user,
        uint256 _stakeId,
        uint256 _unstakeAmount,
        uint256 _remainingAmount
    ) external onlyRole(STAKING_CONTRACT_ROLE) nonReentrant {
        StakePoints storage sp = stakePoints[_user][_stakeId];
        require(sp.active, "Stake not active");

        // First, claim any pending points before calculating deduction
        _claimPoints(_user, _stakeId);

        if (_remainingAmount == 0) {
            // Full unstake - deactivate stake but keep points earned
            sp.active = false;
            emit PointsDeducted(
                _user,
                _stakeId,
                0,
                "Full unstake - points retained"
            );
        } else {
            // Partial unstake - deduct points proportionally
            uint256 unstakePercentage = (_unstakeAmount * 100) / sp.stakeAmount;
            uint256 pointsToDeduct = (sp.totalPoints * unstakePercentage) / 100;

            sp.totalPoints -= pointsToDeduct;
            sp.stakeAmount = _remainingAmount;
            userTotalPoints[_user] -= pointsToDeduct;

            emit PointsDeducted(
                _user,
                _stakeId,
                pointsToDeduct,
                "Partial unstake"
            );
        }
    }

    /**
     * @dev Emergency unstake - user loses all points for this stake
     */
    function handleEmergencyUnstake(
        address _user,
        uint256 _stakeId
    ) external onlyRole(STAKING_CONTRACT_ROLE) nonReentrant {
        StakePoints storage sp = stakePoints[_user][_stakeId];
        require(sp.active, "Stake not active");

        uint256 pointsLost = sp.totalPoints;

        // Deduct all points earned from this stake
        userTotalPoints[_user] -= pointsLost;
        sp.totalPoints = 0;
        sp.active = false;

        emit PointsDeducted(
            _user,
            _stakeId,
            pointsLost,
            "Emergency unstake penalty"
        );
    }

    /**
     * @dev Get detailed stake points info
     */
    function getStakePointsInfo(
        address _user,
        uint256 _stakeId
    )
        external
        view
        returns (
            uint256 totalPoints,
            uint256 pendingPoints,
            uint256 lastClaimTime,
            uint256 stakeAmount,
            uint256 stakeStartTime,
            bool active,
            uint256 nextClaimTime
        )
    {
        StakePoints memory sp = stakePoints[_user][_stakeId];
        uint256 pending = calculatePendingPoints(_user, _stakeId);
        uint256 nextClaim = sp.lastClaimTime + POINTS_INTERVAL;

        return (
            sp.totalPoints,
            pending,
            sp.lastClaimTime,
            sp.stakeAmount,
            sp.stakeStartTime,
            sp.active,
            nextClaim
        );
    }

    /**
     * @dev Get user's total points across all stakes
     */
    function getUserTotalPoints(address _user) external view returns (uint256) {
        return userTotalPoints[_user];
    }

    /**
     * @dev Get total points including pending for a user
     */
    function getUserTotalPointsWithPending(
        address _user,
        uint256[] calldata _activeStakeIds
    ) external view returns (uint256) {
        uint256 total = userTotalPoints[_user];

        for (uint256 i = 0; i < _activeStakeIds.length; i++) {
            total += calculatePendingPoints(_user, _activeStakeIds[i]);
        }

        return total;
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @dev Add staking contract address
     */
    function addStakingContract(
        address _stakingContract
    ) external onlyRole(ADMIN_ROLE) {
        require(_stakingContract != address(0), "Invalid address");
        grantRole(STAKING_CONTRACT_ROLE, _stakingContract);
    }

    /**
     * @dev Remove staking contract address
     */
    function removeStakingContract(
        address _stakingContract
    ) external onlyRole(ADMIN_ROLE) {
        revokeRole(STAKING_CONTRACT_ROLE, _stakingContract);
    }

    /**
     * @dev Manual points adjustment (for corrections or special events)
     */
    function adjustUserPoints(
        address _user,
        int256 _pointsChange,
        string calldata _reason
    ) external onlyRole(ADMIN_ROLE) {
        if (_pointsChange > 0) {
            userTotalPoints[_user] += uint256(_pointsChange);
            emit PointsAwarded(_user, 0, uint256(_pointsChange), _reason);
        } else if (_pointsChange < 0) {
            uint256 deduction = uint256(-_pointsChange);
            require(userTotalPoints[_user] >= deduction, "Insufficient points");
            userTotalPoints[_user] -= deduction;
            emit PointsDeducted(_user, 0, deduction, _reason);
        }
    }
}
