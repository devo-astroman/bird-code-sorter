import { BIRD_VALUE, MATCH_FINISH, MATCH_TIME } from "shared/constants.module";
import { TimerService } from "shared/services/timer-service.module";
import { MatchGom } from "./match-gom.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { SlotLine } from "./slot-line/slot-line.module";
import { Stores } from "shared/stores/stores.module";
import { PLACE } from "shared/stores/match-store.module";

export class Match extends MyMaid {
	private clock: TimerService;
	private gom: MatchGom;
	private id: number;
	private desk: SlotLine;
	private playerInteractionEvent: BindableEvent;
	private finishedEvent: BindableEvent;
	private stores: Stores;

	//private stageChangeEvent: BindableEvent;
	constructor(id: number, instance: Instance, stores: Stores) {
		super();
		this.id = id;
		this.stores = stores;
		print("Match --- ");

		/* 
		setup desk, stage and phone
		 */
		this.clock = new TimerService();
		this.gom = new MatchGom(instance as Folder);
		this.playerInteractionEvent = this.gom.getPlayerInteractionEvent();
		this.finishedEvent = this.gom.getFinishedEvent();
		this.gom.hideTime();
		wait(5);

		this.stores.getMatchStoreState$().connect((data) => {
			print("MATCH STORES !!! ", data);
		});

		const deskFolder = this.gom.getDeskFolder();
		this.desk = new SlotLine(0, deskFolder);

		///to test
		this.desk.getChangeEvent().Event.Connect((value: unknown, deskData) => {
			print("monitor: interaction data", value);

			//playerInteractionEvent.Fire();

			const nData = deskData as { id: number; value: number }[];
			print(
				"monitor: slotline data",
				nData.map((dData: { id: number; value: number }) => ({ id: dData.id, value: dData.value })),
			);

			this.playerInteractionEvent.Fire(value);
		});

		///

		this.clock.onOneSecComplementDo((sec: number) => {
			this.gom.displaySecs(sec);
		});

		this.clock.onTimeCompleted(() => {
			this.gom.hideTime();
			//notify it is finished
			this.finishedEvent.Fire(id, MATCH_FINISH.LOOSE);
		});

		/* to test the match store */
		wait(5);
		this.stores.setMatchStoreBirdLocation(BIRD_VALUE.GREEN, PLACE.HUMAN, 123);
		/*  */
	}

	init() {
		print("match.init");
		this.clock.startTime(MATCH_TIME);
		this.gom.showTime();
		this.gom.openMatch();
	}

	getPlayerInteractionEvent() {
		return this.playerInteractionEvent;
	}

	getFinishedEvent() {
		return this.finishedEvent;
	}

	prepareMaid(): void {
		this.addListToMaid([this.clock, this.gom]);
	}
}
