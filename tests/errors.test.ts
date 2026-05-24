import { describe, it, expect } from "vitest";
import {
  CeloWalletError,
  WalletNotFoundError,
  WalletNotConnectedError,
  UnsupportedNetworkError,
  UserRejectedError,
} from "../src/errors";

describe("SDK errors", () => {
  it("WalletNotFoundError has correct code", () => {
    const err = new WalletNotFoundError("metamask");
    expect(err.code).toBe("WALLET_NOT_FOUND");
    expect(err).toBeInstanceOf(CeloWalletError);
  });

  it("WalletNotConnectedError has correct code", () => {
    const err = new WalletNotConnectedError();
    expect(err.code).toBe("WALLET_NOT_CONNECTED");
  });

  it("UnsupportedNetworkError includes chainId in message", () => {
    const err = new UnsupportedNetworkError(1);
    expect(err.message).toContain("1");
    expect(err.code).toBe("UNSUPPORTED_NETWORK");
  });

  it("UserRejectedError has correct code", () => {
    const err = new UserRejectedError();
    expect(err.code).toBe("USER_REJECTED");
  });
});
