import { formatUnits } from "viem";
import { CELO_NETWORKS } from "../constants";
import { UnsupportedNetworkError, UserRejectedError } from "../errors";
import type { CeloChainId } from "../types";

/** Format a bigint balance to a human-readable string */
export function formatBalance(value: bigint, decimals = 18): string {
  return formatUnits(value, decimals);
}

/** Convert hex chainId string to number */
export function hexToChainId(hex: string): number {
  return parseInt(hex, 16);
}

/** Convert number chainId to hex string */
export function chainIdToHex(chainId: number): string {
  return `0x${chainId.toString(16)}`;
}

/** Assert chainId is a supported Celo network */
export function assertCeloNetwork(chainId: number): asserts chainId is CeloChainId {
  if (!(chainId in CELO_NETWORKS)) {
    throw new UnsupportedNetworkError(chainId);
  }
}

/** Normalize EIP-1193 provider errors into SDK errors */
export function normalizeProviderError(err: unknown): Error {
  if (err instanceof Error) {
    // EIP-1193 user rejection codes
    if ("code" in err && (err as { code: number }).code === 4001) {
      return new UserRejectedError();
    }
    return err;
  }
  return new Error(String(err));
}

/** Shorten an address for display: 0x1234…abcd */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Check if running in a browser environment */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Retrieve the injected EIP-1193 provider (window.ethereum) */
export function getInjectedProvider(): unknown {
  if (!isBrowser()) return undefined;
  return (window as { ethereum?: unknown }).ethereum;
}
