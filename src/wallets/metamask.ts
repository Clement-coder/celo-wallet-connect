import { InjectedConnector } from "./base";
import { isBrowser } from "../utils";

/** MetaMask connector — uses window.ethereum injected by the MetaMask extension */
export class MetaMaskConnector extends InjectedConnector {
  readonly id = "metamask" as const;
  readonly name = "MetaMask";

  isAvailable(): boolean {
    if (!isBrowser()) return false;
    const eth = (window as { ethereum?: { isMetaMask?: boolean } }).ethereum;
    return !!eth?.isMetaMask;
  }
}
