/**
 * Base class for EIP-1193 injected wallet connectors.
 * MetaMask, Valora (browser extension), and MiniPay all use this pattern.
 */
import type { Address, Hash, Hex } from "viem";
import { CHAIN_PARAMS } from "../constants";
import { WalletNotFoundError } from "../errors";
import { getInjectedProvider, normalizeProviderError } from "../utils";
import type {
  CeloChainId,
  TransactionRequest,
  WalletConnector,
  WalletEvent,
  WalletEventHandler,
  WalletId,
} from "../types";

type EIP1193Provider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, handler: (...args: unknown[]) => void): void;
  removeListener(event: string, handler: (...args: unknown[]) => void): void;
};

export abstract class InjectedConnector implements WalletConnector {
  abstract readonly id: WalletId;
  abstract readonly name: string;

  protected get provider(): EIP1193Provider {
    const p = getInjectedProvider();
    if (!p) throw new WalletNotFoundError(this.id);
    return p as EIP1193Provider;
  }

  abstract isAvailable(): boolean;

  async connect(): Promise<Address> {
    try {
      const accounts = (await this.provider.request({
        method: "eth_requestAccounts",
      })) as Address[];
      if (!accounts[0]) throw new Error("No accounts returned");
      return accounts[0];
    } catch (err) {
      throw normalizeProviderError(err);
    }
  }

  async disconnect(): Promise<void> {
    // Injected wallets don't have a programmatic disconnect — clear state only
  }

  async getAddress(): Promise<Address> {
    const accounts = (await this.provider.request({ method: "eth_accounts" })) as Address[];
    if (!accounts[0]) throw new Error("No connected account");
    return accounts[0];
  }

  async getChainId(): Promise<number> {
    const hex = (await this.provider.request({ method: "eth_chainId" })) as string;
    return parseInt(hex, 16);
  }

  async signMessage(message: string): Promise<Hex> {
    const address = await this.getAddress();
    return (await this.provider.request({
      method: "personal_sign",
      params: [message, address],
    })) as Hex;
  }

  async switchNetwork(chainId: CeloChainId): Promise<void> {
    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (err: unknown) {
      // 4902 = chain not added yet — add it
      if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 4902) {
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [CHAIN_PARAMS[chainId]],
        });
      } else {
        throw normalizeProviderError(err);
      }
    }
  }

  async sendTransaction(tx: TransactionRequest): Promise<Hash> {
    const from = await this.getAddress();
    return (await this.provider.request({
      method: "eth_sendTransaction",
      params: [{ ...tx, from, value: tx.value ? `0x${tx.value.toString(16)}` : undefined }],
    })) as Hash;
  }

  on(event: WalletEvent, handler: WalletEventHandler): void {
    const map: Record<WalletEvent, string> = {
      accountChanged: "accountsChanged",
      chainChanged: "chainChanged",
      disconnect: "disconnect",
    };
    this.provider.on(map[event], handler as (...args: unknown[]) => void);
  }

  off(event: WalletEvent, handler: WalletEventHandler): void {
    const map: Record<WalletEvent, string> = {
      accountChanged: "accountsChanged",
      chainChanged: "chainChanged",
      disconnect: "disconnect",
    };
    this.provider.removeListener(map[event], handler as (...args: unknown[]) => void);
  }
}
