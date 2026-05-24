"use client";

import { useCeloWalletContext } from "../providers/CeloWalletProvider";
import { CELO_NETWORKS } from "../constants";
import type { CeloNetwork } from "../types";

/**
 * useCeloAccount — returns the full account + network context.
 *
 * @example
 * const { address, network, isOnCelo } = useCeloAccount();
 */
export function useCeloAccount() {
  const { state } = useCeloWalletContext();

  const network: CeloNetwork | null =
    state.chainId && state.chainId in CELO_NETWORKS
      ? (CELO_NETWORKS[state.chainId] ?? null)
      : null;

  const isOnCelo = network !== null;

  return {
    address: state.address,
    chainId: state.chainId,
    network,
    isOnCelo,
    isConnected: state.status === "connected",
    walletId: state.walletId,
  };
}
