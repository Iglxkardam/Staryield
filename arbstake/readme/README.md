# StarYield Staking - React TypeScript Application

This is a React TypeScript conversion of the StarYield staking platform frontend. The application maintains the exact design and styling from the original HTML/CSS version while providing a modern React architecture ready for blockchain integration.

## 🚀 Features

- **Home Page**: Landing page with animated stats and social links
- **Dashboard**: Multi-tier staking interface (Comet, Meteor, Supernova)
- **Referral System**: Referral tracking with level-based commission structure
- **Transaction History**: Filterable transaction list
- **Responsive Design**: Fully responsive across all devices
- **TypeScript**: Full type safety throughout the application
- **Ready for Web3 Integration**: Hook structure prepared for blockchain connectivity

## 📁 Project Structure

```
arbstake/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── AnimatedNumber.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   └── VideoBackground.tsx
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Referral.tsx
│   │   └── Transaction.tsx
│   ├── hooks/             # Custom React hooks for blockchain
│   │   ├── useWallet.ts
│   │   ├── useStaking.ts
│   │   ├── useReferral.ts
│   │   └── useTransactions.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── assets/            # Static assets (moved from root)
│   ├── App.tsx            # Main App component with routing
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── css/                   # Original CSS files (preserved)
├── images/                # Images and videos
├── fonts/                 # Custom fonts
├── js/                    # Original JS libraries (Bootstrap, jQuery)
├── public/                # Public assets
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## 🛠️ Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Run development server:**

```bash
npm run dev
```

3. **Build for production:**

```bash
npm run build
```

4. **Preview production build:**

```bash
npm run preview
```

## 🔗 Blockchain Integration

The application includes placeholder hooks ready for blockchain integration:

### useWallet Hook

- `connectWallet()`: Connect user's Web3 wallet
- `disconnectWallet()`: Disconnect wallet
- `switchToken()`: Switch between BNB, TRX, USDT
- `getBalance()`: Fetch wallet balance

### useStaking Hook

- `approveToken()`: Approve token spending
- `stake()`: Stake tokens in a tier
- `unstake()`: Unstake tokens
- `claimRewards()`: Claim staking rewards
- `getUserStakes()`: Get user's active stakes
- `getStakingTiers()`: Fetch staking tier info

### useReferral Hook

- `getReferralStats()`: Get referral statistics
- `claimCommission()`: Claim referral commission
- `getReferralLink()`: Generate referral link
- `trackReferral()`: Track referral registration

### useTransactions Hook

- `getTransactions()`: Fetch all transactions
- `getFilteredTransactions()`: Filter transactions by type

## 🎨 Styling

The application uses the original CSS files:

- `css/style.css` - Main styles
- `css/admin.css` - Dashboard/admin styles
- `css/bootstrap.min.css` - Bootstrap framework
- `css/all.css` - Font Awesome icons

All original designs, animations, and responsive behaviors are preserved.

## 📱 Pages

### Home (`/`)

- Hero section with animated background
- Live stats (TVL, stakers, payouts)
- Social media links
- Call-to-action buttons

### Dashboard (`/dashboard`)

- Token switcher (BNB/TRX/USDT)
- Portfolio overview
- 3-tier staking system
- Loyalty points tracker
- Feature roadmap menu

### Referral (`/referral`)

- Referral stats overview
- Referral link generator with copy function
- 5-level commission system
- Progress tracking

### Transactions (`/transactions`)

- Transaction history
- Filter by type (All, Stake, Earnings, etc.)
- Real-time updates ready

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons

## 🌐 Web3 Integration (To Implement)

To connect this frontend to your smart contracts:

1. Install Web3 library:

```bash
npm install ethers
# or
npm install web3
```

2. Update the hooks in `src/hooks/` with your contract ABIs and addresses

3. Implement wallet connection in `useWallet.ts`:

```typescript
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
```

4. Add contract interactions in respective hooks

5. Update components to use the hooks with real blockchain data

## 📝 Environment Variables

Create a `.env` file in the root:

```env
VITE_CONTRACT_ADDRESS_STAKING=your_staking_contract_address
VITE_CONTRACT_ADDRESS_REFERRAL=your_referral_contract_address
VITE_CHAIN_ID=56
VITE_RPC_URL=your_rpc_url
```

## 🎯 Next Steps

1. Install `ethers` or `web3` library
2. Add your smart contract ABIs to a new `src/contracts/` folder
3. Implement actual blockchain calls in the hooks
4. Add error handling and loading states
5. Implement wallet connection modal
6. Add transaction notifications/toasts
7. Set up proper environment variables
8. Add analytics tracking
9. Implement proper error boundaries

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

This is a conversion of the original HTML/CSS design. All design credits go to the original designers.

## ⚠️ Important Notes

- All blockchain functionality is currently placeholder code
- The hooks are structured and ready but need actual Web3 implementation
- Static data is used for demonstration purposes
- Replace placeholder contract addresses with actual deployed contracts
- Test thoroughly on testnet before mainnet deployment
