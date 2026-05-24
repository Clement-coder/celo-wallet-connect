import { describe, it, expect } from "vitest";
import { CeloWalletClient } from "../src/core/client";
import { WalletNotConnectedError } from "../src/errors";

describe("CeloWalletClient", () => {
  it("initializes with disconnected state", () => {
    const client = new CeloWalletClient();
    expect(client.getState().status).toBe("disconnected");
    expect(client.getState().address).toBeNull();
  });

  it("isConnected returns false initially", () => {
    const client = new CeloWalletClient();
    expect(client.isConnected()).toBe(false);
  });

  it("getAddress throws when not connected", async () => {
    const client = new CeloWalletClient();
    await expect(client.getAddress()).rejects.toBeInstanceOf(WalletNotConnectedError);
  });

  it("signMessage throws when not connected", async () => {
    const client = new CeloWalletClient();
    await expect(client.signMessage("hello")).rejects.toBeInstanceOf(WalletNotConnectedError);
  });

  it("subscribe returns unsubscribe function", () => {
    const client = new CeloWalletClient();
    const unsub = client.subscribe(() => {});
    expect(typeof unsub).toBe("function");
    unsub();
  });

  it("getAvailableWallets returns array", () => {
    const client = new CeloWalletClient();
    const wallets = client.getAvailableWallets();
    expect(Array.isArray(wallets)).toBe(true);
  });
});
