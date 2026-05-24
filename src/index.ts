// Main SDK entry point — re-exports everything for tree-shaking

// Core
export { CeloWalletClient } from "./core/client";

// React
export { CeloWalletProvider } from "./providers/CeloWalletProvider";
export type { CeloWalletProviderProps } from "./providers/CeloWalletProvider";
export { useWallet } from "./hooks/useWallet";
export { useBalance } from "./hooks/useBalance";
export { useCeloAccount } from "./hooks/useCeloAccount";

// Wallets
export { MetaMaskConnector } from "./wallets/metamask";
export { ValoraConnector } from "./wallets/valora";
export { MiniPayConnector } from "./wallets/minipay";
export { WalletConnectConnector } from "./wallets/walletconnect";

// Constants
export { CELO_MAINNET, CELO_ALFAJORES, CELO_NETWORKS } from "./constants";

// Utils
export { formatBalance, shortenAddress, assertCeloNetwork } from "./utils";

// Errors
export {
  CeloWalletError,
  WalletNotFoundError,
  WalletNotConnectedError,
  UnsupportedNetworkError,
  UserRejectedError,
  TransactionError,
} from "./errors";

// Types
export type {
  CeloChainId,
  WalletId,
  ConnectionStatus,
  CeloNetwork,
  WalletConnector,
  WalletState,
  BalanceResult,
  TransactionRequest,
  WalletEvent,
  WalletEventHandler,
  CeloWalletConfig,
} from "./types";
