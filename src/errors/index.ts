/** Base SDK error */
export class CeloWalletError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CeloWalletError";
  }
}

export class WalletNotFoundError extends CeloWalletError {
  constructor(walletId: string) {
    super(`Wallet "${walletId}" is not installed or available.`, "WALLET_NOT_FOUND");
    this.name = "WalletNotFoundError";
  }
}

export class WalletNotConnectedError extends CeloWalletError {
  constructor() {
    super("No wallet is connected. Call connectWallet() first.", "WALLET_NOT_CONNECTED");
    this.name = "WalletNotConnectedError";
  }
}

export class UnsupportedNetworkError extends CeloWalletError {
  constructor(chainId: number) {
    super(`Chain ID ${chainId} is not a supported Celo network.`, "UNSUPPORTED_NETWORK");
    this.name = "UnsupportedNetworkError";
  }
}

export class UserRejectedError extends CeloWalletError {
  constructor() {
    super("User rejected the wallet request.", "USER_REJECTED");
    this.name = "UserRejectedError";
  }
}

export class TransactionError extends CeloWalletError {
  constructor(message: string, cause?: unknown) {
    super(message, "TRANSACTION_ERROR", cause);
    this.name = "TransactionError";
  }
}
