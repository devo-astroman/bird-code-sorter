import { ID_SLOTS, LOCATION, MATCH_FINISH, MATCH_TIME, SLOT_VALUE } from "shared/constants.module";
import { TimerService } from "shared/services/timer-service.module";
import { MatchGom } from "./match-gom.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { SlotLine } from "./slot-line/slot-line.module";
import { Stores } from "shared/stores/stores.module";
import {
	countSamePositions,
	generateGoalCombination,
	getNewStateFromInteraction
} from "shared/services/match-evaluator.module";
import { PlayerHand } from "./player-hand/player-hand.module";
import { Phone } from "./phone/phone.module";
import { printSlotInString } from "shared/services/slot-service.module";

export class Match extends MyMaid {
	private clock: TimerService;
	private gom: MatchGom;
	private id: number;
	private desk: SlotLine;
	private stage: SlotLine;
	private stageGoal: SLOT_VALUE[];
	private phone: Phone;
	private playersHand: PlayerHand[] = [];
	private playerInteractionEvent: BindableEvent;
	private finishedEvent: BindableEvent;
	private stores: Stores;

	//private stageChangeEvent: BindableEvent;
	constructor(id: number, instance: Instance, stores: Stores) {
		super();
		this.id = id;
		this.stores = stores;
		this.stageGoal = generateGoalCombination();
		print("Match --- ");

		/* 
		setup desk, stage and phone
		 */
		this.clock = new TimerService();
		this.gom = new MatchGom(instance as Folder);
		this.playerInteractionEvent = this.gom.getPlayerInteractionEvent();
		this.finishedEvent = this.gom.getFinishedEvent();
		this.gom.hideTime();

		const phoneFolder = this.gom.getPhoneFolder();
		this.phone = new Phone(phoneFolder);

		this.phone.getClickedBindableEvent().Event.Connect(() => {
			const stageValues = this.stores.getMatchStoreState()?.stage;

			if (!stageValues) {
				print("Warning there is no stageValues");
			} else {
				print("stageValues ");
				printSlotInString(stageValues);
				print("stageGoal ");
				printSlotInString(this.stageGoal);
				const nCorrects = countSamePositions(stageValues, this.stageGoal);
				this.phone.playSoundNTimes(nCorrects);
			}
		});

		this.stores.getMatchStoreState$().connect((data) => {
			if (data) {
				const deskData = data.desk.map((d, i) => ({ id: i, value: d }));
				this.desk.setSlotValues(deskData);
				const stageData = data.stage.map((s, i) => ({ id: i, value: s }));
				this.stage.setSlotValues(stageData);

				data.handPlayers.forEach((hP) => {
					const hPlayer = this.playersHand.find((playerH) => playerH.getUserId() === hP.userId);

					if (hPlayer) {
						//already exist
						hPlayer.setHandValue(hP.handValue);
					} else {
						//we need to create it
						const handPlayer = new PlayerHand(hP.userId);
						handPlayer.setHandValue(hP.handValue);
						this.playersHand.push(handPlayer);
					}
				});

				//check if all stage slots are busy
				const existSomeEmptySlot = stageData.some((sData) => sData.value === SLOT_VALUE.EMPTY);
				if (existSomeEmptySlot) {
					this.phone.turnOffPhone();
				} else {
					this.phone.turnOnPhone();
				}
			}
		});

		const deskFolder = this.gom.getDeskFolder();
		this.desk = new SlotLine(LOCATION.DESK, deskFolder);
		const stageFolder = this.gom.getStageFolder();
		this.stage = new SlotLine(LOCATION.STAGE, stageFolder);

		///to test
		this.desk
			.getChangeEvent()
			.Event.Connect((interactionData: { player: Player; idSlot: ID_SLOTS; slotValue: SLOT_VALUE }, deskData) => {
				print("monitor: interaction data", interactionData);

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
			});

		this.stage
			.getChangeEvent()
			.Event.Connect(
				(interactionData: { player: Player; idSlot: ID_SLOTS; slotValue: SLOT_VALUE }, stageData) => {
					print("monitor: interaction data", interactionData);

					const nData = stageData as { id: number; value: number }[];
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
								location: LOCATION.STAGE,
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
				}
			);

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
