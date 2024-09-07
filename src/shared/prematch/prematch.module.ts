import { MAX_PLAYERS_BY_MATCH } from "shared/constants.module";
import { PrematchGom } from "./prematch-gom";
import { MyMaid } from "shared/maid/my-maid.module";

export class Prematch extends MyMaid {
	private gom: PrematchGom;
	private id: number;

	constructor(id: number, instance: Instance) {
		super();
		print("Prematch --- ", instance);
		this.id = id;

		this.gom = new PrematchGom(instance as Folder);
		this.gom.createTimer();
		this.gom.hideTimer();
		this.gom.createZone();
		this.gom.managePlayerTags(MAX_PLAYERS_BY_MATCH);

		this.gom.onZoneFirstPlayerEnter(() => {
			this.gom.startTimer();
		});
		this.gom.onZoneLastPlayerExit(() => {
			this.gom.stopTimer();
		});

		this.gom.onOneSecTimer((sec: number) => {
			const nPlayers = this.gom.getNPlayersInZone();
			this.gom.displaySecs(sec, nPlayers);
		});

		this.gom.onTimerCompleted(() => {
			this.gom.closePrematch();
			this.gom.hideTimer();

			const playersInZone = this.gom.getPlayersInZone().size();
			if (playersInZone > 0) {
				this.gom.removePlayersFromColliderGroup();
				this.gom.removeTagFromLimitDoor();
				this.gom.endZone();
				this.gom.fireFinishedEvent();
			} else {
				this.gom.openPrematch();
			}
		});
	}

	init() {
		print("prematch.init");
		this.gom.openPrematch();
		this.gom.initZone();
	}

	getFinishedEvent() {
		return this.gom.getFinishedEvent();
	}

	prepareMaid(): void {
		this.addListToMaid([this.gom]);
	}
}
