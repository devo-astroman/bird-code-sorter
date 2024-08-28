import { ID_SLOTS, MATCH_FINISH, MATCH_TIME, SLOT_VALUE } from "shared/constants.module";
import { TimerService } from "shared/services/timer-service.module";
import { MatchGom } from "./match-gom.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { SlotLine } from "./slot-line/slot-line.module";
import { Stores } from "shared/stores/stores.module";

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
			//should pass the data to desk, stage and playersInMatch
		});

		const deskFolder = this.gom.getDeskFolder();
		this.desk = new SlotLine(0, deskFolder);

		///to test
		this.desk
			.getChangeEvent()
			.Event.Connect((interactionData: { player: Player; idSlot: ID_SLOTS; slotValue: SLOT_VALUE }, deskData) => {
				print("monitor: interaction data", interactionData);

				//playerInteractionEvent.Fire();

				const nData = deskData as { id: number; value: number }[];
				print(
					"monitor: slotline data",
					nData.map((dData: { id: number; value: number }) => ({ id: dData.id, value: dData.value })),
				);

				const { player, idSlot, slotValue } = interactionData;

				/* 
					playerHandValue = matchStore.getHandValue of the player
					if(playerHandValue is empty and slotId)
				
				
				*/

				if (slotValue === SLOT_VALUE.EMPTY) {
					//player with empty hands is taking a bird - should add a bird to players hand and remove the bird from the desk
					//is player hand empty? check in the store if the player with the user id is assigned to any of the birds
				}

				//this.playerInteractionEvent.Fire(value);
				//this.stores.setMatchStoreBirdLocation(BIRD_VALUE.GREEN, PLACE.HUMAN, 123);
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
		//wait(5);
		//this.stores.setMatchStoreBirdLocation(BIRD_VALUE.GREEN, PLACE.HUMAN, 123);
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
