# Pegasus - DEX Aggregator Platform

A decentralized exchange (DEX) aggregator built with React, TypeScript, and Vite that enables seamless token swapping across multiple decentralized exchanges on the Sonic blockchain.

## 🚀 Overview

Pegasus is a smart DEX aggregator that automatically finds the best trading routes and prices across multiple decentralized exchanges. The platform analyzes available liquidity pools, compares rates, and executes swaps through the most optimal path to ensure users get the best possible exchange rates with minimal slippage.

## ✨ Key Features

### Core Functionality
- **Multi-DEX Aggregation**: Automatically queries multiple DEXs (both V2 and V3 protocols) to find the best swap rates
- **Smart Route Optimization**: Intelligent pathfinding algorithm that discovers optimal trading routes across different liquidity pools
- **Best Price Discovery**: Real-time price comparison across all supported DEXs to guarantee the best rates
- **Slippage Protection**: Built-in slippage tolerance (12% default) to protect against unfavorable price movements
- **Native Token Support**: Seamlessly swap native tokens (e.g., Sonic) and wrapped tokens
- **Real-time Price Feeds**: Live token pricing using an on-chain price oracle system

### User Experience
- **Wallet Integration**: Multi-wallet support via ConnectKit (MetaMask, WalletConnect, and more)
- **Responsive Design**: Mobile-first design that works flawlessly on all devices
- **Transaction Tracking**: Real-time status updates for approvals, swaps, and confirmations
- **Token Balance Display**: Live balance updates for connected wallets
- **Custom Recipient Address**: Option to send swapped tokens to a different address
- **Network Detection**: Automatic detection and prompts for unsupported networks

### Advanced Features
- **Token Approval Management**: Smart approval system that only requests necessary allowances
- **Gas Optimization**: Optimized smart contract interactions to minimize gas costs
- **Multi-page Application**: Includes Home (Swap), Staking, and NFT pages
- **Trade Path Visualization**: Shows the exact route your tokens will take through various DEXs
- **Price Impact Calculation**: Displays USD value of swaps in real-time

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 6.0
- **Blockchain Integration**:
  - Wagmi 2.14 for Ethereum interactions
  - Viem 2.21 for low-level blockchain operations
  - Ethers.js 6.13 for contract interactions
- **Wallet Connection**: ConnectKit 1.8 (customizable wallet modal)
- **UI Styling**: TailwindCSS 3.4
- **Charts**: ECharts 5.5 for data visualization
- **Routing**: React Router DOM 7.2
- **State Management**: React Context API with custom providers

### Smart Contract Integration
The platform interacts with custom smart contracts deployed on Sonic:

1. **Aggregator Contract** (`0x738832Ef5E9863128735013f7345023b3E994098`)
   - Main contract for executing swaps
   - Queries multiple DEXs and returns best quotes
   - Handles both V2 and V3 DEX protocols
   - Manages token approvals and swap execution

2. **Price Oracle Contract** (`0x8D98b0dBBCD7CcD1905571A5C0aA234bD574BeBA`)
   - Provides real-time token pricing
   - Aggregates price data from multiple sources
   - Supports stable coin and WETH price pairs

3. **Staking Token Contract** (`0x170EB0A66204FEb483F9Dd8c2C57f6fd8FC4daDC`)
   - Manages staking functionality (if implemented)

### Project Structure
```
kao_bridge/
├── src/
│   ├── Pages/              # Application pages
│   │   ├── Home.tsx        # Main swap interface
│   │   ├── Staking.tsx     # Staking functionality
│   │   └── Nft.tsx         # NFT features
│   ├── component/
│   │   ├── swap/           # Swap-related components
│   │   │   ├── Swap.tsx    # Main swap component
│   │   │   ├── SelectToken.tsx
│   │   │   └── SlippageSelector.tsx
│   │   ├── header/         # Header components
│   │   ├── footer/         # Footer components
│   │   ├── modals/         # Modal dialogs
│   │   │   ├── StatusReport.tsx
│   │   │   └── ChangeChain.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useTokenList.tsx
│   │   │   ├── getTokenPrice.tsx
│   │   │   └── getDexesandWrapped.tsx
│   │   └── loaders/        # Loading components
│   ├── utils/
│   │   ├── Constants.ts    # Contract addresses and utilities
│   │   ├── configigurations.ts  # Wagmi configuration
│   │   ├── typesInterface.ts    # TypeScript interfaces
│   │   ├── Context.tsx     # Global state management
│   │   ├── AggregatorAbi.json
│   │   ├── PriceOracleAbi.json
│   │   └── Erc20Abi.json
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or another Web3 wallet

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kao_bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_WALLET_CONNECT=your_wallet_connect_project_id
   ```
   Get your WalletConnect Project ID from: https://cloud.walletconnect.com/

4. **Run development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🌐 Supported Networks

Currently, the platform supports:
- **Sonic Mainnet** (Chain ID: 146) - Active ✅

Planned support for:
- BSC (Binance Smart Chain)
- Arbitrum
- Base

## 💡 How It Works

### Token Swapping Process

1. **Connect Wallet**: Users connect their Web3 wallet through ConnectKit
2. **Select Tokens**: Choose the tokens to swap from and to
3. **Enter Amount**: Input the amount to swap
4. **Quote Aggregation**: The platform queries multiple DEXs through the Aggregator contract
5. **Best Route Selection**: The system automatically selects the DEX and route with the best output
6. **Approval (if needed)**: For ERC20 tokens, user approves the Aggregator contract to spend tokens
7. **Execute Swap**: Transaction is sent to the Aggregator contract which routes through the optimal DEX
8. **Confirmation**: User receives swapped tokens in their wallet

### Smart Routing Algorithm

The aggregator smart contract:
1. Queries all active DEXs (both Uniswap V2 and V3 style)
2. Calculates potential output amounts for each route
3. Factors in:
   - Liquidity depth
   - Fee tiers (for V3 DEXs)
   - Gas costs
   - Slippage tolerance
4. Returns the quote with the highest output amount
5. Executes the swap through the selected DEX's router

## 🛠️ Key Utilities & Functions

### Token Price Fetching
```typescript
getTokenPrice(tokenAddress, chainId, dexes, stable, weth)
```
Fetches real-time token prices from the Price Oracle contract.

### Best Quote Discovery
```typescript
getBestQuote(fromToken, toToken, amount, exact, chainId, weth)
```
Queries all DEXs and returns the best swap quote.

### Balance Checking
```typescript
getTokenBalance(tokenAddress, userAddress)
```
Retrieves token balance for a given address.

### Trade Path Discovery
```typescript
getTradePath(tokenAddresses, amount)
```
Resolves token addresses to names for route visualization.

## 📱 User Interface Features

### Swap Interface
- Token selection with search and filtering
- Balance display for both tokens
- Real-time USD value calculation
- Max balance button (with gas reservation for native tokens)
- Recipient address option
- DEX information display
- Estimated waiting time

### Status Modals
- **Transaction Status**: Shows pending, confirming, confirmed, and error states
- **Chain Switching**: Prompts users to switch to supported networks
- **Notifications**: Toast-style notifications for errors and important messages

### Visual Elements
- Gradient background theme (black to brown-red gradient)
- Rounded, modern card-based UI
- Responsive token icons
- Smooth transitions and hover effects

## 🔐 Security Features

- **Input Validation**: Prevents invalid swap amounts and addresses
- **Slippage Protection**: Default 12% slippage tolerance to prevent sandwich attacks
- **Address Confirmation**: Requires explicit confirmation for custom recipient addresses
- **Insufficient Balance Checks**: Prevents transactions that would fail
- **Gas Reserve**: Automatically reserves gas when swapping native tokens
- **Contract Allowance Management**: Only requests necessary token approvals

## 🎨 Customization

### Supported Chains Configuration
Edit `src/utils/Constants.ts` to add or modify supported chains:
```typescript
export const SupportedChains: IChain[] = [
  {
    id: 146,
    name: "Sonic",
    img: "./sonic-logo.svg",
    active: true
  },
  // Add more chains here
]
```

### Contract Addresses
Update contract addresses in `src/utils/Constants.ts`:
```typescript
export const AggregatorAddress: Record<number, string> = {
  146: "0x738832Ef5E9863128735013f7345023b3E994098"
}
```

### Styling
The project uses TailwindCSS. Customize the theme in `tailwind.config.js` and global styles in `src/index.css`.

## 📊 Future Enhancements

- Multi-chain support (BSC, Arbitrum, Base)
- Advanced trading features (limit orders, DCA)
- Liquidity pool analytics
- Historical trade data and charts
- Portfolio tracking
- Gas price optimization strategies
- MEV protection
- Advanced slippage settings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [Wagmi](https://wagmi.sh/) and [Viem](https://viem.sh/)
- Wallet connection via [ConnectKit](https://docs.family.co/connectkit)
- Charts by [ECharts](https://echarts.apache.org/)

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Powered by Pegasus** - Finding the best rates across the DeFi ecosystem