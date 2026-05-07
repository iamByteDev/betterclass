import { convexClient } from "@/modules/convex";
import { getStoredClientSecret } from "@/saving/main";
import { ServiceBase } from "@/services/base";
import { api } from "../../../../server/convex/_generated/api";

interface AuthServiceEvents {
  // TODO: emit this event
  secretChanged: [];
  secretStateChanged: [];

  // ServiceBase events
  ready: [];
}

type SecretState = "validating" | "valid" | "invalid";

export class AuthService extends ServiceBase<AuthServiceEvents> {
  private _clientSecret: string | null = null;
  private _secretState: SecretState = "validating";

  constructor() {
    super();

    getStoredClientSecret().then((secret) => {
      this._clientSecret = secret;
      this.ready();
      this.watchSecretValidity();
    });
  }

  public get clientSecret(): string | null {
    return this._clientSecret;
  }

  // Secret Validity
  public get secretState(): SecretState {
    return this._secretState;
  }
  private async setSecretState(state: SecretState) {
    if (this._secretState === state) {
      return;
    }
    this._secretState = state;
    this.emit("secretStateChanged");
  }
  private async watchSecretValidity() {
    const clientSecret = this._clientSecret;
    if (clientSecret == null) {
      this.once("secretChanged", () => this.watchSecretValidity());
      this.setSecretState("invalid");
      return false;
    }

    this.setSecretState("validating");
    const unsubscribe = convexClient.onUpdate(api.clients.isValidClient, { clientSecret }, (valid) => {
      this.setSecretState(valid ? "valid" : "invalid");
    });
    this.once("secretChanged", () => {
      unsubscribe();
      this.watchSecretValidity();
    });

    return true;
  }
}
