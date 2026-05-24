// Core types for the celo-wallet-connect SDK

import type { Address, Hash, Hex } from "viem";

/** Supported Celo network IDs */
export type CeloChainId = 42220 | 44787;

/** Wallet provider identifiers */
export type WalletId = "metamask" | "valora" | "minipay" | "walletconnect";

/** Connection status */
export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

/** Celo network definition */
export interface CeloNetwork {
  chainId: CeloChainId;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
}

/** Wallet connector interface — all wallets implement this */
export interface WalletConnector {
  id: WalletId;
  name: string;
  /** Returns true if the wallet is available in the current environment */
  isAvailable(): boolean;
  connect(): Promise<Address>;
  disconnect(): Promise<void>;
  getAddress(): Promise<Address>;
  getChainId(): Promise<number>;
  signMessage(message: string): Promise<Hex>;
  switchNetwork(chainId: CeloChainId): Promise<void>;
  sendTransaction(tx: TransactionRequest): Promise<Hash>;
  /** Subscribe to wallet events */
  on(event: WalletEvent, handler: WalletEventHandler): void;
  off(event: WalletEvent, handler: WalletEventHandler): void;
}

/** EIP-1193 transaction request */
export interface TransactionRequest {
  to: Address;
  value?: bigint;
  data?: Hex;
  gas?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
}

/** Events emitted by wallet connectors */
export type WalletEvent = "accountChanged" | "chainChanged" | "disconnect";

export type WalletEventHandler =
  | ((address: Address) => void)       // accountChanged
  | ((chainId: number) => void)        // chainChanged
  | (() => void);                      // disconnect

/** SDK-level wallet state */
export interface WalletState {
  status: ConnectionStatus;
  address: Address | null;
  chainId: number | null;
  walletId: WalletId | null;
  error: Error | null;
}

/** Balance result */
export interface BalanceResult {
  value: bigint;
  formatted: string;
  symbol: string;
  decimals: number;
}

/** SDK configuration */
export interface CeloWalletConfig {
  /** Default network to connect to (default: mainnet) */
  defaultChainId?: CeloChainId;
  /** WalletConnect project ID (required for WalletConnect) */
  walletConnectProjectId?: string;
  /** Auto-reconnect on page load */
  autoConnect?: boolean;
}
