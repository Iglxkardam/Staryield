// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title RewardPool
 * @dev Liquidity pool that holds funds for staking rewards and unstaking
 * Only authorized staking contracts can request payouts
 */
contract RewardPool is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant STAKING_CONTRACT_ROLE =
        keccak256("STAKING_CONTRACT_ROLE");
    bytes32 public constant FUND_MANAGER_ROLE = keccak256("FUND_MANAGER_ROLE");

    // Track total payouts per token
    mapping(address => uint256) public totalPayouts;

    // Track payouts per user per token
    mapping(address => mapping(address => uint256)) public userPayouts;

    // Events
    event FundsDeposited(
        address indexed token,
        address indexed depositor,
        uint256 amount
    );
    event RewardPaid(
        address indexed token,
        address indexed user,
        uint256 amount,
        address indexed stakingContract
    );
    event PrincipalPaid(
        address indexed token,
        address indexed user,
        uint256 amount,
        address indexed stakingContract
    );
    event FundsWithdrawn(
        address indexed token,
        address indexed recipient,
        uint256 amount
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(FUND_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Deposit funds into the pool (BNB/ETH)
     */
    function depositBNB() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        emit FundsDeposited(address(0), msg.sender, msg.value);
    }

    /**
     * @dev Deposit ERC20 tokens into the pool
     */
    function depositToken(address _token, uint256 _amount) external {
        require(_token != address(0), "Invalid token address");
        require(_amount > 0, "Amount must be greater than 0");

        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        emit FundsDeposited(_token, msg.sender, _amount);
    }

    /**
     * @dev Pay rewards to user (called by authorized staking contract)
     * @param _token Token address (address(0) for BNB/ETH)
     * @param _user User address to pay
     * @param _amount Amount to pay
     */
    function payReward(
        address _token,
        address _user,
        uint256 _amount
    ) external nonReentrant onlyRole(STAKING_CONTRACT_ROLE) {
        require(_user != address(0), "Invalid user address");
        require(_amount > 0, "Amount must be greater than 0");

        if (_token == address(0)) {
            // Pay BNB/ETH
            require(
                address(this).balance >= _amount,
                "Insufficient BNB balance"
            );
            (bool success, ) = payable(_user).call{value: _amount}("");
            require(success, "BNB transfer failed");
        } else {
            // Pay ERC20 token
            require(
                IERC20(_token).balanceOf(address(this)) >= _amount,
                "Insufficient token balance"
            );
            IERC20(_token).safeTransfer(_user, _amount);
        }

        totalPayouts[_token] += _amount;
        userPayouts[_user][_token] += _amount;

        emit RewardPaid(_token, _user, _amount, msg.sender);
    }

    /**
     * @dev Pay principal back to user when unstaking (called by authorized staking contract)
     * @param _token Token address (address(0) for BNB/ETH)
     * @param _user User address to pay
     * @param _amount Amount to pay
     */
    function payPrincipal(
        address _token,
        address _user,
        uint256 _amount
    ) external nonReentrant onlyRole(STAKING_CONTRACT_ROLE) {
        require(_user != address(0), "Invalid user address");
        require(_amount > 0, "Amount must be greater than 0");

        if (_token == address(0)) {
            // Pay BNB/ETH
            require(
                address(this).balance >= _amount,
                "Insufficient BNB balance"
            );
            (bool success, ) = payable(_user).call{value: _amount}("");
            require(success, "BNB transfer failed");
        } else {
            // Pay ERC20 token
            require(
                IERC20(_token).balanceOf(address(this)) >= _amount,
                "Insufficient token balance"
            );
            IERC20(_token).safeTransfer(_user, _amount);
        }

        totalPayouts[_token] += _amount;
        userPayouts[_user][_token] += _amount;

        emit PrincipalPaid(_token, _user, _amount, msg.sender);
    }

    /**
     * @dev Add authorized staking contract
     */
    function addStakingContract(
        address _stakingContract
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_stakingContract != address(0), "Invalid staking contract");
        grantRole(STAKING_CONTRACT_ROLE, _stakingContract);
    }

    /**
     * @dev Remove staking contract authorization
     */
    function removeStakingContract(
        address _stakingContract
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(STAKING_CONTRACT_ROLE, _stakingContract);
    }

    /**
     * @dev Emergency withdraw funds (admin only)
     */
    function emergencyWithdrawBNB(
        address payable _recipient,
        uint256 _amount
    ) external nonReentrant onlyRole(FUND_MANAGER_ROLE) {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");
        require(address(this).balance >= _amount, "Insufficient balance");

        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "BNB transfer failed");

        emit FundsWithdrawn(address(0), _recipient, _amount);
    }

    /**
     * @dev Emergency withdraw tokens (admin only)
     */
    function emergencyWithdrawToken(
        address _token,
        address _recipient,
        uint256 _amount
    ) external nonReentrant onlyRole(FUND_MANAGER_ROLE) {
        require(_token != address(0), "Invalid token");
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than 0");

        IERC20(_token).safeTransfer(_recipient, _amount);
        emit FundsWithdrawn(_token, _recipient, _amount);
    }

    /**
     * @dev Get pool balance for a token
     */
    function getBalance(address _token) external view returns (uint256) {
        if (_token == address(0)) {
            return address(this).balance;
        }
        return IERC20(_token).balanceOf(address(this));
    }

    /**
     * @dev Get user's total payouts for a token
     */
    function getUserPayouts(
        address _user,
        address _token
    ) external view returns (uint256) {
        return userPayouts[_user][_token];
    }

    /**
     * @dev Receive BNB/ETH
     */
    receive() external payable {
        emit FundsDeposited(address(0), msg.sender, msg.value);
    }
}
