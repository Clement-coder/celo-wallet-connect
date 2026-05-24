# celo-wallet-connect

[![npm version](https://img.shields.io/npm/v/celo-wallet-connect.svg)](https://www.npmjs.com/package/celo-wallet-connect)
[![npm downloads](https://img.shields.io/npm/dm/celo-wallet-connect.svg)](https://www.npmjs.com/package/celo-wallet-connect)
[![CI](https://github.com/your-org/celo-wallet-connect/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/celo-wallet-connect/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Production-ready SDK for connecting and interacting with Celo wallets in **React**, **Next.js**, and **Vanilla JavaScript** applications.

## Features

- 🔌 **4 wallet connectors** — MetaMask, Valora, MiniPay, WalletConnect
- ⚛️ **React hooks** — `useWallet`, `useBalance`, `useCeloAccount`
- 🌐 **Celo Mainnet + Alfajores Testnet** support
- 🔒 **Strong TypeScript typings** throughout
- 🌲 **Tree-shakeable** ESM + CJS dual build
- ⚡ **Viem** for lightweight blockchain interactions
- 📡 **Event listeners** — accountChanged, chainChanged, disconnect

## Installation

```bash
npm install celo-wallet-connect viem
```

## Quick Start

### React / Next.js

```tsx
// 1. Wrap your app
import { CeloWalletProvider } from "celo-wallet-connect";

export default function App({ children }) {
  return (
    <CeloWalletProvider config={{ defaultChainId: 42220 }}>
      {children}
    </CeloWalletProvider>
  );
}

// 2. Use hooks in any component
import { useWallet, useBalance } from "celo-wallet-connect";

function WalletButton() {
  const { connect, disconnect, address, isConnected } = useWallet();
  const { balance } = useBalance();

  if (isConnected) return (
    <div>
      <p>{address}</p>
      <p>{balance?.formatted} CELO</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );

  return <button onClick={() => connect("metamask")}>Connect MetaMask</button>;
}
```

### Vanilla JavaScript

```js
import { CeloWalletClient } from "celo-wallet-connect";

const client = new CeloWalletClient({ defaultChainId: 42220 });

// Subscribe to state
client.subscribe((state) => console.log(state));

// Connect
const address = await client.connectWallet("metamask");

// Get balance
const balance = await client.getBalance();
console.log(balance.formatted, balance.symbol);

// Sign a message
const sig = await client.signMessage("Hello Celo!");

// Send a transaction
const hash = await client.sendTransaction({
  to: "0xRecipient...",
  value: 1_000_000_000_000_000_000n, // 1 CELO
});

// Switch network
await client.switchNetwork(44787); // Alfajores

// Disconnect
await client.disconnectWallet();
```

## API Reference

### `CeloWalletProvider`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config.defaultChainId` | `42220 \| 44787` | `42220` | Default Celo network |
| `config.walletConnectProjectId` | `string` | `""` | WalletConnect project ID |
| `config.autoConnect` | `boolean` | `false` | Auto-reconnect on load |

### `useWallet()`

| Return | Type | Description |
|--------|------|-------------|
| `address` | `Address \| null` | Connected wallet address |
| `chainId` | `number \| null` | Current chain ID |
| `isConnected` | `boolean` | Connection status |
| `isConnecting` | `boolean` | Connecting in progress |
| `error` | `Error \| null` | Last error |
| `connect(walletId)` | `Promise<Address>` | Connect a wallet |
| `disconnect()` | `Promise<void>` | Disconnect wallet |
| `signMessage(msg)` | `Promise<Hex>` | Sign a message |
| `sendTransaction(tx)` | `Promise<Hash>` | Send a transaction |
| `switchNetwork(chainId)` | `Promise<void>` | Switch Celo network |

### `useBalance(address?)`

| Return | Type | Description |
|--------|------|-------------|
| `balance` | `BalanceResult \| null` | Balance data |
| `isLoading` | `boolean` | Fetch in progress |
| `error` | `Error \| null` | Fetch error |
| `refetch()` | `Promise<void>` | Manually refresh |

### `useCeloAccount()`

| Return | Type | Description |
|--------|------|-------------|
| `address` | `Address \| null` | Connected address |
| `network` | `CeloNetwork \| null` | Current network info |
| `isOnCelo` | `boolean` | Whether on a Celo network |

### `CeloWalletClient` (Vanilla JS)

| Method | Description |
|--------|-------------|
| `connectWallet(walletId)` | Connect a wallet by ID |
| `disconnectWallet()` | Disconnect current wallet |
| `getAddress()` | Get connected address |
| `getBalance(address?)` | Get CELO balance |
| `signMessage(message)` | Sign a message |
| `sendTransaction(tx)` | Send a transaction |
| `switchNetwork(chainId)` | Switch to Celo network |
| `on(event, handler)` | Subscribe to wallet events |
| `off(event, handler)` | Unsubscribe from events |
| `subscribe(listener)` | Subscribe to state changes |
| `getAvailableWallets()` | List installed wallets |

## Supported Wallets

| Wallet | ID | Detection |
|--------|----|-----------|
| MetaMask | `"metamask"` | `window.ethereum.isMetaMask` |
| Valora | `"valora"` | `window.ethereum.isValora` |
| MiniPay | `"minipay"` | `window.ethereum.isMiniPay` |
| WalletConnect | `"walletconnect"` | Requires `walletConnectProjectId` |

## Supported Networks

| Network | Chain ID | RPC |
|---------|----------|-----|
| Celo Mainnet | `42220` | `https://forno.celo.org` |
| Alfajores Testnet | `44787` | `https://alfajores-forno.celo-testnet.org` |

## Events

```ts
client.on("accountChanged", (address) => console.log("New address:", address));
client.on("chainChanged", (chainId) => console.log("New chain:", chainId));
client.on("disconnect", () => console.log("Disconnected"));
```

## License

MIT © 2026 TaskFlow
