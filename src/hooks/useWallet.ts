"use client";

import { useCallback } from "react";
import { useCeloWalletContext } from "../providers/CeloWalletProvider";
import type { Address, Hash, Hex } from "viem";
import type { CeloChainId, TransactionRequest, WalletId } from "../types";

/**
 * useWallet — primary hook for wallet connection and interactions.
 *
 * @example
 * const { connect, disconnect, address, isConnected } = useWallet();
 */
export function useWallet() {
  const { client, state } = useCeloWalletContext();

  const connect = useCallback(
    (walletId: WalletId): Promise<Address> => client.connectWallet(walletId),
    [client],
  );

  const disconnect = useCallback((): Promise<void> => client.disconnectWallet(), [client]);

  const signMessage = useCallback(
    (message: string): Promise<Hex> => client.signMessage(message),
    [client],
  );

  const sendTransaction = useCallback(
    (tx: TransactionRequest): Promise<Hash> => client.sendTransaction(tx),
    [client],
  );

  const switchNetwork = useCallback(
    (chainId: CeloChainId): Promise<void> => client.switchNetwork(chainId),
    [client],
  );

  return {
    // State
    address: state.address,
    chainId: state.chainId,
    walletId: state.walletId,
    status: state.status,
    error: state.error,
    isConnected: state.status === "connected",
    isConnecting: state.status === "connecting",
    // Actions
    connect,
    disconnect,
    signMessage,
    sendTransaction,
    switchNetwork,
    getAvailableWallets: () => client.getAvailableWallets(),
  };
}
