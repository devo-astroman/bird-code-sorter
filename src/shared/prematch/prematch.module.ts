import { TimerService } from "shared/services/timer-service.module";
import { PrematchGom } from "./prematch-gom";
import { PrematchZone } from "./prematch-zone.module";
import { PREMATCH_TIME } from "shared/constants.module";

export class Prematch {
	private gom: PrematchGom;
	private prematchZone!: PrematchZone;
	private clock: TimerService;

	constructor(instance: Instance) {
		print("Prematch --- ", instance);

		this.clock = new TimerService();

		this.gom = new PrematchGom(instance as Folder);
		this.gom.hideTimer();

		const zone = this.gom.getPrematchZonePart();

		if (zone) {
			this.prematchZone = new PrematchZone(
				zone,
				() => {
					this.clock.startTime(PREMATCH_TIME);
					this.gom.showTimer();
				},
				() => {
					this.clock.stop();
					this.gom.hideTimer();
				},
			);
		}

		this.clock.onOneSecComplementDo((sec: number) => {
			this.gom.displaySecs(sec);
		});

		this.clock.onTimeCompleted(() => {
			this.gom.closePrematch();
			this.gom.hideTimer();
			this.prematchZone.end();
			//notify it is finished
		});
	}

	init() {
		print("prematch.init");
		this.gom.openPrematch();
		this.prematchZone.init();

		//start time
		/* 
			onTimeFinished {
				getPlayers in zone
			}
		*/
	}

	Destroy() {
		this.prematchZone.Destroy();
		print("Prematch.destroy");
	}
}
