import { ID_SLOTS, LOCATION, MATCH_FINISH, MATCH_TIME, SLOT_VALUE } from "shared/constants.module";
import { TimerService } from "shared/services/timer-service.module";
import { MatchGom } from "./match-gom.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { SlotLine } from "./slot-line/slot-line.module";
import { Stores } from "shared/stores/stores.module";
import { getNewStateFromInteraction } from "shared/services/match-evaluator.module";

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
					nData.map((dData: { id: number; value: number }) => ({ id: dData.id, value: dData.value }))
				);

				const { player, idSlot } = interactionData;
				const matchState = stores.getMatchStoreState();

				if (matchState) {
					const stateUpdateData = getNewStateFromInteraction(
						{
							player,
							location: LOCATION.DESK,
							idSlot
						},
						matchState
					);
					const { updated, newState } = stateUpdateData;
					if (updated && newState) {
						this.stores.setMatchStoreState(newState);
					} else {
						print("nothing to update probably print empty message ");
					}
				} else {
					print("Warning there is no matchState ");
				}

				/* 
					playerHandValue = matchStore.getHandValue of the player
					if(playerHandValue is empty and slotId)
				
				
				*/

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
