import { TypedEventEmitter } from "@/modules/typed-event-emitter";

interface ServiceBaseEvents {
  ready: [];
}

export class ServiceBase<Events extends ServiceBaseEvents> extends TypedEventEmitter<Events> {
  constructor() {
    super();
  }

  // Ready handlers
  private _isReady = false;
  protected ready() {
    this._isReady = true;
    this.emit("ready");
  }
  public get isReady(): boolean {
    return this._isReady;
  }
  public whenReady(): Promise<void> {
    return new Promise((resolve) => {
      if (this._isReady) {
        resolve();
      } else {
        this.on("ready", resolve);
      }
    });
  }
}
