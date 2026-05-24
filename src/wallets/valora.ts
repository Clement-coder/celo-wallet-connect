import { InjectedConnector } from "./base";
import { isBrowser } from "../utils";

/** Valora connector — Valora injects window.ethereum with isValora flag */
export class ValoraConnector extends InjectedConnector {
  readonly id = "valora" as const;
  readonly name = "Valora";

  isAvailable(): boolean {
    if (!isBrowser()) return false;
    const eth = (window as { ethereum?: { isValora?: boolean } }).ethereum;
    return !!eth?.isValora;
  }
}
