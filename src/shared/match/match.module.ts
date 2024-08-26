import { MATCH_TIME } from "shared/constants.module";
import { TimerService } from "shared/services/timer-service.module";
import { MatchGom } from "./match-gom.module";

export class Match {
	private clock: TimerService;
	private gom: MatchGom;
	constructor(instance: Instance) {
		print("Match --- ");
		/* 
		setup desk, stage and phone
		 */
		this.clock = new TimerService();
		this.gom = new MatchGom(instance as Folder);
		this.gom.hideTime();
		this.clock.onOneSecComplementDo((sec: number) => {
			this.gom.displaySecs(sec);
		});

		this.clock.onTimeCompleted(() => {
			this.gom.hideTime();
			//notify it is finished

			/* this.gom.closePrematch();
			this.gom.hideTimer();
			this.zone.end();
			const players = this.zone.getPlayersInZone();
			this.onTimePrematchFinishedFn(players); */
		});
	}

	init() {
		print("match.init");
		this.clock.startTime(MATCH_TIME);
		this.gom.showTime();
		this.gom.openMatch();
	}

	Destroy() {
		print("Prematch.destroy");
	}
}
