import { setInterval, setTimeout } from "@rbxts/set-timeout";
import { MyMaid } from "shared/maid/my-maid.module";

export class ClockService extends MyMaid {
	private cleanup!: () => void;
	private onOneSecDoFn: (sec: number) => void = (i) => {};
	private onTimeCompletedFn!: () => void;

	private totalSecs = 1;
	private currentSec = 0;

	constructor() {
		super();
	}

	onOneSecDo(cb: (sec: number) => void) {
		this.onOneSecDoFn = cb;
	}

	onTimeCompleted(cb: () => void) {
		this.onTimeCompletedFn = cb;
	}

	startTime(totalSecs: number) {
		this.totalSecs = totalSecs;
		this.currentSec = 0;
		this.cleanup = setInterval(() => {
			if (this.totalSecs === this.currentSec) {
				this.cleanup();
				this.onTimeCompletedFn();
			} else {
				this.currentSec++;
				this.onOneSecDoFn(this.totalSecs - this.currentSec);
			}
		}, 1);
	}

	stop() {
		if (!!this.cleanup) this.cleanup();
	}

	prepareMaid(): void {
		//this.addListToMaid([this.activePromise as any]);
	}
}
