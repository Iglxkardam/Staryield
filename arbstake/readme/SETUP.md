# StarYield - Setup and Development Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## Initial Setup

### 1. Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages including:

- React & React DOM
- TypeScript
- Vite (build tool)
- React Router DOM
- All development dependencies

### 2. Environment Configuration

Create a `.env` file in the root directory:

```powershell
Copy-Item .env.example .env
```

Then edit the `.env` file with your actual contract addresses and configuration.

### 3. Verify Project Structure

Ensure all files are in place:

- `src/` folder with components, pages, hooks, types, utils
- `css/`, `images/`, `fonts/`, `js/` folders with original assets
- Configuration files: `package.json`, `tsconfig.json`, `vite.config.ts`

## Development

### Start Development Server

```powershell
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```powershell
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npx tsc --noEmit

# Lint code
npm run lint
```

## Project Structure Explained

```
arbstake/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components (Home, Dashboard, etc.)
│   ├── hooks/           # Custom React hooks for blockchain
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions and constants
│   ├── App.tsx          # Main app with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── css/                 # Original CSS files (preserved)
├── images/              # Images and videos
├── fonts/               # Custom fonts
├── public/              # Static public assets
└── index.html           # HTML entry point
```

## Integrating Blockchain

### Step 1: Install Web3 Library

Choose one:

```powershell
# Option 1: ethers.js (recommended)
npm install ethers

# Option 2: web3.js
npm install web3
```

### Step 2: Add Contract ABIs

Create a new folder for your contracts:

```powershell
New-Item -ItemType Directory -Path "src\contracts"
```

Add your contract ABIs as JSON files:

- `src/contracts/StakingABI.json`
- `src/contracts/ReferralABI.json`
- `src/contracts/ERC20ABI.json`

### Step 3: Update Hooks

Edit the hooks in `src/hooks/` to implement actual blockchain interactions:

#### Example: useWallet.ts

```typescript
import { ethers } from "ethers";

export const useWallet = () => {
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      // ... rest of implementation
    }
  };
  // ... rest of hook
};
```

#### Example: useStaking.ts

```typescript
import { ethers } from "ethers";
import StakingABI from "@/contracts/StakingABI.json";
import { CONTRACTS } from "@/utils/constants";

export const useStaking = () => {
  const stake = async (amount: string, tierId: number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACTS.STAKING, StakingABI, signer);

    const tx = await contract.stake(tierId, ethers.utils.parseEther(amount));
    await tx.wait();
  };
  // ... rest of hook
};
```

### Step 4: Update Constants

Edit `src/utils/constants.ts` with your actual:

- Contract addresses
- Network settings
- Token addresses

### Step 5: Test on Testnet

1. Connect MetaMask to BSC Testnet
2. Get testnet BNB from faucet
3. Test all functions (stake, unstake, claim, referral)
4. Verify transactions on BSC Testnet Explorer

## Common Issues and Solutions

### Issue: TypeScript errors after npm install

**Solution:**

```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: Vite not starting

**Solution:**

```powershell
# Clear Vite cache
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

### Issue: CSS not loading

**Solution:**
Ensure the CSS import paths in `src/index.css` are correct relative to the project structure.

### Issue: Images not showing

**Solution:**

- Images should be in the `public/images/` folder
- Or move images to `public/` and reference them with `/images/filename.png`

## Deployment

### Build for Production

```powershell
npm run build
```

This creates a `dist/` folder with optimized production files.

### Deploy to Web Server

Upload the contents of `dist/` folder to your web server.

### Deploy to Vercel

```powershell
npm install -g vercel
vercel
```

### Deploy to Netlify

```powershell
npm install -g netlify-cli
netlify deploy --prod
```

## Testing Checklist

Before going live:

- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] Wallet connection works
- [ ] Token approval works
- [ ] Staking works for all tiers
- [ ] Unstaking works
- [ ] Claiming rewards works
- [ ] Referral link generation works
- [ ] Transaction history displays
- [ ] Responsive design works on mobile
- [ ] All animations work
- [ ] Contract addresses are correct
- [ ] Tested on testnet thoroughly

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [React Router Documentation](https://reactrouter.com/)

## Support

For issues or questions:

- Check the README.md
- Review the code comments
- Check browser console for errors
- Verify MetaMask connection

## Next Steps

1. Install dependencies: `npm install`
2. Install ethers: `npm install ethers`
3. Add your contract ABIs
4. Update contract addresses in `src/utils/constants.ts`
5. Implement blockchain calls in hooks
6. Test on BSC Testnet
7. Deploy to production

Good luck with your StarYield staking platform! 🚀
