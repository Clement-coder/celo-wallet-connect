/**
 * CeloWalletClient — the central SDK class.
 * Manages wallet connectors, state, and exposes all SDK methods.
 */
import { createPublicClient, http } from "viem";
import { CELO_NETWORKS, DEFAULT_CHAIN_ID } from "../constants";
import { WalletNotConnectedError, WalletNotFoundError, UnsupportedNetworkError } from "../errors";
import { MetaMaskConnector } from "../wallets/metamask";
import { ValoraConnector } from "../wallets/valora";
import { MiniPayConnector } from "../wallets/minipay";
import { WalletConnectConnector } from "../wallets/walletconnect";
import { formatBalance, assertCeloNetwork } from "../utils";
import type {
  Address,
  Hash,
  Hex,
} from "viem";
import type {
  BalanceResult,
  CeloChainId,
  CeloWalletConfig,
  TransactionRequest,
  WalletConnector,
  WalletEvent,
  WalletEventHandler,
  WalletId,
  WalletState,
} from "../types";

export class CeloWalletClient {
  private connectors: Map<WalletId, WalletConnector>;
  private activeConnector: WalletConnector | null = null;
  private state: WalletState = {
    status: "disconnected",
    address: null,
    chainId: null,
    walletId: null,
    error: null,
  };
  private stateListeners: Set<(state: WalletState) => void> = new Set();
  private readonly config: Required<CeloWalletConfig>;

  constructor(config: CeloWalletConfig = {}) {
    this.config = {
      defaultChainId: config.defaultChainId ?? DEFAULT_CHAIN_ID,
      walletConnectProjectId: config.walletConnectProjectId ?? "",
      autoConnect: config.autoConnect ?? false,
    };

    this.connectors = new Map<WalletId, WalletConnector>([
      ["metamask", new MetaMaskConnector()],
      ["valora", new ValoraConnector()],
      ["minipay", new MiniPayConnector()],
      ["walletconnect", new WalletConnectConnector(this.config.walletConnectProjectId)],
    ]);

    if (this.config.autoConnect) {
      void this.tryAutoConnect();
    }
  }

  // ─── State management ────────────────────────────────────────────────────

  getState(): WalletState {
    return { ...this.state };
  }

  subscribe(listener: (state: WalletState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private setState(patch: Partial<WalletState>): void {
    this.state = { ...this.state, ...patch };
    this.stateListeners.forEach((l) => l(this.getState()));
  }

  // ─── Connection ───────────────────────────────────────────────────────────

  async connectWallet(walletId: WalletId): Promise<Address> {
    const connector = this.connectors.get(walletId);
    if (!connector) throw new WalletNotFoundError(walletId);
    if (!connector.isAvailable()) throw new WalletNotFoundError(walletId);

    this.setState({ status: "connecting", error: null });

    try {
      const address = await connector.connect();
      const chainId = await connector.getChainId();

      this.activeConnector = connector;
      this.setState({ status: "connected", address, chainId, walletId, error: null });

      // Register event listeners
      this.registerEvents(connector);

      // Persist session
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("celo_wallet_id", walletId);
      }

      return address;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.setState({ status: "error", error });
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    if (!this.activeConnector) return;
    await this.activeConnector.disconnect();
    this.activeConnector = null;
    this.setState({ status: "disconnected", address: null, chainId: null, walletId: null, error: null });
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("celo_wallet_id");
    }
  }

  // ─── Account ──────────────────────────────────────────────────────────────

  async getAddress(): Promise<Address> {
    return this.requireConnector().getAddress();
  }

  async getBalance(address?: Address): Promise<BalanceResult> {
    const target = address ?? this.state.address;
    if (!target) throw new WalletNotConnectedError();

    const chainId = (this.state.chainId ?? this.config.defaultChainId) as CeloChainId;
    assertCeloNetwork(chainId);
    const network = CELO_NETWORKS[chainId];
    if (!network) throw new UnsupportedNetworkError(chainId);

    const client = createPublicClient({ transport: http(network.rpcUrl) });
    const value = await client.getBalance({ address: target });

    return {
      value,
      formatted: formatBalance(value),
      symbol: network.nativeCurrency.symbol,
      decimals: network.nativeCurrency.decimals,
    };
  }

  // ─── Signing & transactions ───────────────────────────────────────────────

  async signMessage(message: string): Promise<Hex> {
    return this.requireConnector().signMessage(message);
  }

  async sendTransaction(tx: TransactionRequest): Promise<Hash> {
    return this.requireConnector().sendTransaction(tx);
  }

  // ─── Network ──────────────────────────────────────────────────────────────

  async switchNetwork(chainId: CeloChainId): Promise<void> {
    assertCeloNetwork(chainId);
    await this.requireConnector().switchNetwork(chainId);
    this.setState({ chainId });
  }

  // ─── Events ───────────────────────────────────────────────────────────────

  on(event: WalletEvent, handler: WalletEventHandler): void {
    this.requireConnector().on(event, handler);
  }

  off(event: WalletEvent, handler: WalletEventHandler): void {
    this.requireConnector().off(event, handler);
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  getAvailableWallets(): WalletId[] {
    return Array.from(this.connectors.entries())
      .filter(([, c]) => c.isAvailable())
      .map(([id]) => id);
  }

  isConnected(): boolean {
    return this.state.status === "connected";
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private requireConnector(): WalletConnector {
    if (!this.activeConnector) throw new WalletNotConnectedError();
    return this.activeConnector;
  }

  private registerEvents(connector: WalletConnector): void {
    connector.on("accountChanged", ((accounts: Address[]) => {
      const address = Array.isArray(accounts) ? accounts[0] ?? null : (accounts as Address | null);
      if (!address) {
        void this.disconnectWallet();
      } else {
        this.setState({ address });
      }
    }) as WalletEventHandler);

    connector.on("chainChanged", ((chainId: string | number) => {
      const id = typeof chainId === "string" ? parseInt(chainId, 16) : chainId;
      this.setState({ chainId: id });
    }) as WalletEventHandler);

    connector.on("disconnect", (() => {
      void this.disconnectWallet();
    }) as WalletEventHandler);
  }

  private async tryAutoConnect(): Promise<void> {
    if (typeof localStorage === "undefined") return;
    const saved = localStorage.getItem("celo_wallet_id") as WalletId | null;
    if (!saved) return;
    const connector = this.connectors.get(saved);
    if (!connector?.isAvailable()) return;
    try {
      await this.connectWallet(saved);
    } catch {
      // Silently fail on auto-connect
    }
  }
}
