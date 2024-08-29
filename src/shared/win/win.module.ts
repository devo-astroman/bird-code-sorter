import { RESET_TIME, SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { Stores } from "shared/stores/stores.module";
import { WinGom } from "./win-gom.module";
import { TimerService } from "shared/services/timer-service.module";
import { getCharacterFromUserId } from "shared/services/player-game-service.module";

export class Win extends MyMaid {
	private id: number;
	private gom!: WinGom;
	private stores: Stores;
	private clock: TimerService;
	private root: Folder;
	private finishedEvent!: BindableEvent;

	constructor(id: number, stores: Stores, root: Folder) {
		super();
		this.id = id;
		this.stores = stores;
		this.root = root;
		this.gom = new WinGom(root);
		this.finishedEvent = this.gom.getFinishedEvent();
		this.clock = new TimerService();
		this.clock.onOneSecComplementDo((sec: number) => {
			this.gom.displayResetTime(sec);
		});

		this.clock.onTimeCompleted(() => {
			this.gom.hideTime();
			this.clock.stop();
			const userIds = this.stores.getPlayersInMatchStoreState();
			const characterModels = userIds.map((uId) => getCharacterFromUserId(uId));

			this.gom.teleportToWinPlaces(characterModels);
			this.finishedEvent = this.gom.getFinishedEvent();
			this.finishedEvent.Fire();
			//notify win is finished
		});
		print("Win! --- ");
	}

	init() {
		wait(2);
		this.startResetTime();
		this.gom.showTime();
	}

	startResetTime() {
		this.clock.startTime(RESET_TIME);
	}

	getFinishedEvent() {
		return this.finishedEvent;
	}

	prepareMaid(): void {
		this.addListToMaid([this.gom, this.clock]);
	}
}
