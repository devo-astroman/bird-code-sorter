import { TimerService } from "shared/services/timer-service.module";
import { PrematchGom } from "./prematch-gom";
import { Zone } from "./zone.module";
import { PREMATCH_TIME } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";

export class Prematch extends MyMaid {
	private gom: PrematchGom;
	private zone!: Zone;
	private clock: TimerService;
	private id: number;

	constructor(id: number, instance: Instance, finishedEvent: BindableEvent) {
		super();
		print("Prematch --- ", instance);
		this.id = id;
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
				}
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
			finishedEvent.Fire(id, players);
		});
	}

	init() {
		print("prematch.init");
		this.gom.openPrematch();
		this.zone.init();
	}

	prepareMaid(): void {
		this.addListToMaid([this.clock, this.gom, this.zone]);
	}
}
