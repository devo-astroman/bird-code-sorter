export class TimerService {
	private totalSecs = 1;
	private onOneSecDoFn: (sec: number) => void = (i) => {};
	private onOneSecComplementDoFn: (sec: number) => void = (i) => {};
	private onTimeCompletedFn!: () => void;
	private promiseFn!: (
		resolve: (value: unknown) => void,
		reject: (reason?: unknown) => void,
		onCancel: (abortHandler?: (() => void) | undefined) => boolean,
	) => void;
	private activePromise!: Promise<unknown> | undefined;
	private cancelPromise = false;
	private isClockRunning = false;

	constructor() {
		this.promiseFn = (resolve, reject) => {
			for (let i = 0; i < this.totalSecs; i++) {
				if (this.cancelPromise) {
					reject(i);
					i = this.totalSecs;
				}

				this.onOneSecDoFn(i);
				this.onOneSecComplementDoFn(this.totalSecs - i);
				wait(1);
			}

			resolve("");
		};
	}

	onOneSecDo(cb: (sec: number) => void) {
		this.onOneSecDoFn = cb;
	}

	onOneSecComplementDo(cb: (sec: number) => void) {
		this.onOneSecComplementDoFn = cb;
	}

	onTimeCompleted(cb: () => void) {
		this.onTimeCompletedFn = cb;
	}

	startTime(totalSecs: number) {
		this.cancelPromise = false;
		this.isClockRunning = true;
		this.totalSecs = totalSecs;

		this.activePromise = new Promise(this.promiseFn);
		const resolve = () => {
			this.onTimeCompletedFn();
			this.isClockRunning = false;
		};
		const reject = (msg: unknown) => {
			print("Time cancelled at sec: ", msg as string);
			this.isClockRunning = false;
		};

		this.activePromise.then(resolve, reject);
	}

	stop() {
		this.cancelPromise = true;
		this.activePromise = undefined;
	}

	isTimerRunning() {
		return this.isClockRunning;
	}
}
