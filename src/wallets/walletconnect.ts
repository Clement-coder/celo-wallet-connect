/**
 * WalletConnect connector stub.
 * Full implementation requires @walletconnect/ethereum-provider which is an
 * optional peer dependency. This connector shows the integration pattern.
 */
import type { Address, Hash, Hex } from "viem";
import { CELO_NETWORKS } from "../constants";
import { WalletNotFoundError } from "../errors";
import { normalizeProviderError } from "../utils";
import type {
  CeloChainId,
  TransactionRequest,
  WalletConnector,
  WalletEvent,
  WalletEventHandler,
} from "../types";

export class WalletConnectConnector implements WalletConnector {
  readonly id = "walletconnect" as const;
  readonly name = "WalletConnect";

  private provider: unknown = null;
  private readonly projectId: string;

  constructor(projectId: string) {
    this.projectId = projectId;
  }

  isAvailable(): boolean {
    return !!this.projectId;
  }

  async connect(): Promise<Address> {
    try {
      // Dynamically import to keep it optional
      const { EthereumProvider } = await import(
        "@walletconnect/ethereum-provider" as string
      ).catch(() => {
        throw new WalletNotFoundError("walletconnect");
      });

      this.provider = await (EthereumProvider as {
        init(opts: object): Promise<unknown>;
      }).init({
        projectId: this.projectId,
        chains: Object.keys(CELO_NETWORKS).map(Number),
        showQrModal: true,
      });

      const p = this.provider as { connect(): Promise<void>; accounts: Address[] };
      await p.connect();
      return p.accounts[0] as Address;
    } catch (err) {
      throw normalizeProviderError(err);
    }
  }

  async disconnect(): Promise<void> {
    const p = this.provider as { disconnect?(): Promise<void> } | null;
    await p?.disconnect?.();
    this.provider = null;
  }

  async getAddress(): Promise<Address> {
    const p = this.provider as { accounts: Address[] } | null;
    if (!p) throw new WalletNotFoundError("walletconnect");
    return p.accounts[0] as Address;
  }

  async getChainId(): Promise<number> {
    const p = this.provider as { chainId: number } | null;
    if (!p) throw new WalletNotFoundError("walletconnect");
    return p.chainId;
  }

  async signMessage(message: string): Promise<Hex> {
    const address = await this.getAddress();
    const p = this.provider as { request(a: object): Promise<unknown> } | null;
    if (!p) throw new WalletNotFoundError("walletconnect");
    return (await p.request({ method: "personal_sign", params: [message, address] })) as Hex;
  }

  async switchNetwork(chainId: CeloChainId): Promise<void> {
    const p = this.provider as { request(a: object): Promise<unknown> } | null;
    if (!p) throw new WalletNotFoundError("walletconnect");
    await p.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  }

  async sendTransaction(tx: TransactionRequest): Promise<Hash> {
    const from = await this.getAddress();
    const p = this.provider as { request(a: object): Promise<unknown> } | null;
    if (!p) throw new WalletNotFoundError("walletconnect");
    return (await p.request({
      method: "eth_sendTransaction",
      params: [{ ...tx, from }],
    })) as Hash;
  }

  on(event: WalletEvent, handler: WalletEventHandler): void {
    const p = this.provider as { on(e: string, h: unknown): void } | null;
    p?.on(event, handler);
  }

  off(event: WalletEvent, handler: WalletEventHandler): void {
    const p = this.provider as { removeListener(e: string, h: unknown): void } | null;
    p?.removeListener(event, handler);
  }
}
