# StarYield Admin Panel

Simple admin dashboard for managing the StarYield staking contract.

## Features

✅ **Access Control**: Only contract admins can access the panel
✅ **Contract Status**: View and toggle pause state
✅ **Tier Management**: Update tier configurations (APY, locking period, min investment)
✅ **Admin Management**: Add/remove admin addresses
✅ **Emergency Functions**: Force withdraw user stakes, request contract withdrawals
✅ **Event Monitoring**: View recent staking events
✅ **Multi-Network Support**: Works on BSC Testnet and Base Sepolia

## Setup

1. **Open the admin panel**:

   ```
   Simply open admin/index.html in your browser
   ```

2. **Connect your wallet**:

   - Click "Connect Wallet"
   - Make sure you're on BSC Testnet or Base Sepolia
   - Your wallet must have admin role

3. **Admin Functions Available**:
   - Pause/Unpause contract
   - Update tier configurations
   - Add/remove admins
   - Emergency withdrawals for users
   - Request contract fund withdrawals (requires 3 admin approvals)

## Security Notes

⚠️ **Important**:

- Only contract admins can access this panel
- Emergency functions should be used with caution
- Multi-sig withdrawals require 3 admin approvals
- Always verify transaction details before confirming

## Contract Addresses

### Staking Contracts (NEW - with StarPoints)

- **BSC Testnet**: `0xC0e13855dEcA38359243c27f10b0106Cf5B96E5D`
- **Base Sepolia**: `0x1DaC05A37C42480E723099c8c72C1EaE761eEA2F`

### Star Points Contracts

- **BSC Testnet**: `0x34ecFEBB8C279895E2d21a62c7A1D893Cba77B06`
- **Base Sepolia**: `0xdADaF4d4e8450862E44447F5EcFBfc9fccc76d41`

### Reward Pools

- **BSC Testnet**: `0x259f2AC8BB77E575ADD1B859D7AFc57Eb5CD05D0`
- **Base Sepolia**: `0x1018Ea97C3540d9dB123392705096f5B93cD46C9`

## Admin Operations

### Pause/Unpause Contract

Temporarily disable all staking operations in case of emergency.

### Update Tier Configuration

- Adjust locking periods (in days)
- Change minimum investment amounts
- Update APY rates (as percentage)

### Add Admin

Grant admin role to a new address. This address will have full control over the contract.

### Remove Admin

Revoke admin role from an address. Cannot remove yourself.

### Emergency Withdraw

Force withdraw a specific stake for a user. Use only in genuine emergencies.

### Request Withdrawal

Request to withdraw funds from contract. Requires approval from 3 admins for security.

## Technical Stack

- **Ethers.js v5**: Blockchain interaction
- **MetaMask**: Wallet connection
- **Vanilla JS**: Simple, no framework needed
- **Responsive CSS**: Works on desktop and mobile

## Development

To serve locally with live reload:

```bash
# Using Python
python -m http.server 8080

# Using Node
npx http-server . -p 8080
```

Then open: http://localhost:8080/admin/
