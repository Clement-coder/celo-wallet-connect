import { InjectedConnector } from "./base";
import { isBrowser } from "../utils";

/**
 * MiniPay connector — Opera MiniPay injects window.ethereum with isMiniPay flag.
 * MiniPay is a mobile-first Celo wallet embedded in Opera Mini browser.
 */
export class MiniPayConnector extends InjectedConnector {
  readonly id = "minipay" as const;
  readonly name = "MiniPay";

  isAvailable(): boolean {
    if (!isBrowser()) return false;
    const eth = (window as { ethereum?: { isMiniPay?: boolean } }).ethereum;
    return !!eth?.isMiniPay;
  }
}
