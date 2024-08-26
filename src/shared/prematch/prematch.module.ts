import { TimerService } from "shared/services/timer-service.module";
import { PrematchGom } from "./prematch-gom";
import { Zone } from "./zone.module";
import { PREMATCH_TIME } from "shared/constants.module";

export class Prematch {
	private gom: PrematchGom;
	private zone!: Zone;
	private clock: TimerService;
	private onTimePrematchFinishedFn: (players: Model[]) => void;

	constructor(instance: Instance, onTimePrematchFinishedFn: (players: Model[]) => void) {
		print("Prematch --- ", instance);
		this.onTimePrematchFinishedFn = onTimePrematchFinishedFn;

		this.clock = new TimerService();

		this.gom = new PrematchGom(instance as Folder);
		this.gom.hideTimer();

		const zone = this.gom.getPrematchZonePart();

		if (zone) {
			this.zone = new Zone(
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
			this.zone.end();
			//notify it is finished
			const players = this.zone.getPlayersInZone();
			this.onTimePrematchFinishedFn(players);
		});
	}

	init() {
		print("prematch.init");
		this.gom.openPrematch();
		this.zone.init();
	}

	Destroy() {
		this.zone.Destroy();
		print("Prematch.destroy");
	}
}
