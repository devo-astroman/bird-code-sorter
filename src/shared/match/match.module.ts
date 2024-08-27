import { MATCH_FINISH, MATCH_TIME } from "shared/constants.module";
import { TimerService } from "shared/services/timer-service.module";
import { MatchGom } from "./match-gom.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { SlotLine } from "./slot-line/slot-line.module";

export class Match extends MyMaid {
	private clock: TimerService;
	private gom: MatchGom;
	private id: number;
	private desk: SlotLine;
	//private stageChangeEvent: BindableEvent;
	constructor(id: number, instance: Instance, finishedEvent: BindableEvent) {
		super();
		this.id = id;
		print("Match --- ");
		/* 
		setup desk, stage and phone
		 */
		this.clock = new TimerService();
		this.gom = new MatchGom(instance as Folder);
		this.gom.hideTime();

		const deskFolder = this.gom.getDeskFolder();
		this.desk = new SlotLine(0, deskFolder);

		///to test
		this.desk.getChangeEvent().Event.Connect((value: unknown, deskData) => {
			print("monitor: interaction data", value);

			const nData = deskData as { id: number; value: number }[];
			print(
				"monitor: slotline data",
				nData.map((dData: { id: number; value: number }) => ({ id: dData.id, value: dData.value })),
			);
		});

		///

		this.clock.onOneSecComplementDo((sec: number) => {
			this.gom.displaySecs(sec);
		});

		this.clock.onTimeCompleted(() => {
			this.gom.hideTime();
			//notify it is finished
			finishedEvent.Fire(id, MATCH_FINISH.LOOSE);
		});
	}

	init() {
		print("match.init");
		this.clock.startTime(MATCH_TIME);
		this.gom.showTime();
		this.gom.openMatch();
	}

	prepareMaid(): void {
		this.addListToMaid([this.clock, this.gom]);
	}
}
