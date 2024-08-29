import { RESET_TIME, SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { Stores } from "shared/stores/stores.module";
import { WinGom } from "./win-gom.module";
import { TimerService } from "shared/services/timer-service.module";

export class Win extends MyMaid {
	private id: number;
	private gom!: WinGom;
	private stores: Stores;
	private clock: TimerService;
	private root: Folder;

	constructor(id: number, stores: Stores, root: Folder) {
		super();
		this.id = id;
		this.stores = stores;
		this.root = root;
		this.gom = new WinGom(root);
		this.clock = new TimerService();
		this.clock.onOneSecComplementDo((sec: number) => {
			this.gom.displayResetTime(sec);
		});

		this.clock.onTimeCompleted(() => {
			this.gom.hideTime();
			this.clock.stop();
			//teleport players
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

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
