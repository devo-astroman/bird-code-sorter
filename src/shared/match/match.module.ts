import { ID_SLOTS, LOCATION, MATCH_FINISH, SLOT_VALUE } from "shared/constants.module";
import { MatchGom } from "./match-gom.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { Stores } from "shared/stores/stores.module";
import {
	countSamePositions,
	generateGoalCombination,
	compareNewStateWithCurrentState,
	generateTip
} from "shared/services/match-evaluator.module";
import { printSlotInString } from "shared/services/slot-service.module";
import { notifyAllPlayers, notifySpecificPlayer } from "shared/services/server-client-comm.module";

export class Match extends MyMaid {
	private gom: MatchGom;
	private id: number;
	private stageGoal: SLOT_VALUE[];
	private playerInteractionEvent: BindableEvent;
	private finishedEvent: BindableEvent;
	private stores: Stores;
	private paperTip: string[];
	private playerReadingUserId!: number;

	private connections: RBXScriptConnection[] = [];

	//move connection to gom
	constructor(id: number, instance: Instance, stores: Stores) {
		super();
		this.id = id;
		this.stores = stores;
		this.stageGoal = generateGoalCombination();
		this.paperTip = generateTip(this.stageGoal);
		this.gom = new MatchGom(instance as Folder);
		this.gom.createTimer();

		this.gom.onCabinetInteract((player: Player) => {
			this.gom.removeCabinetInteraction();
			//fire to all clients
			const msg = {
				type: "ANIMATE",
				data: {
					roomId: this.gom.getRoomId(),
					objectId: "CABINET_DOOR",
					userId: player.UserId
				}
			};

			this.gom.removeCabinetInteraction();

			this.gom.onPlayerClosePaperGui(
				(
					player: Player,
					msg: {
						type: string;
						data: unknown;
					}
				) => {
					this.playerReadingUserId = -123;
					this.gom.activatePaperInteraction();
				}
			);

			this.gom.onPaperInteraction((player: Player) => {
				//notify the specific player to show the paper UI
				this.playerReadingUserId = player.UserId;
				this.gom.deactivatePaperInteraction();
				const msgPaper = {
					type: "GUI",
					data: {
						objectId: "PAPER",
						userId: player.UserId,
						tip: this.paperTip
					}
				};

				notifySpecificPlayer(player, msgPaper);
			});

			this.gom.activatePaperInteraction();
			notifyAllPlayers(msg);
		});

		this.gom.onPlayerRemoved((player: Player) => {
			const userId = player.UserId;
			this.stores.removePlayerMatchByUserId(userId);
			if (userId === this.playerReadingUserId) {
				this.gom.activatePaperInteraction();
			}
		});

		this.gom.onPlayerDied((playerId: number) => {
			const userId = playerId;
			this.stores.removePlayerMatchByUserId(userId);
		});

		this.playerInteractionEvent = this.gom.getPlayerInteractionEvent();
		this.finishedEvent = this.gom.getFinishedEvent();
		this.gom.hideTimer();
		this.gom.createPhone();

		this.gom.onPhoneInteraction(() => {
			const stageValues = this.gom.getStageValues(this.stores);
			print("stageValues ");
			printSlotInString(stageValues);
			print("stageGoal ");
			printSlotInString(this.stageGoal);
			const nCorrects = countSamePositions(stageValues, this.stageGoal);
			this.gom.saveLog(stageValues, nCorrects);

			this.gom.playSoundNTimes(nCorrects);

			if (nCorrects === this.stageGoal.size()) {
				//fire  Won game
				this.gom.stopTimer();
				this.gom.disableDeskSlots();
				this.gom.disableStageSlots();
				this.gom.turnOffPhone();
				this.gom.playWinSound();
				this.gom.deactivatePaperInteraction();
				this.finishedEvent.Fire(MATCH_FINISH.WIN);
			}
		});

		this.gom.onMatchStateChange(this.stores, (data) => {
			if (data.handPlayers.size() === 0) {
				this.gom.stopTimer();
				this.gom.deactivatePaperInteraction();
				this.finishedEvent.Fire(MATCH_FINISH.ABORT);
				return;
			}

			//update desk
			const deskData = data.desk.map((d, i) => ({ id: i, value: d }));
			this.gom.setDeskValues(deskData);

			//update update stage
			const stageData = data.stage.map((s, i) => ({ id: i, value: s }));
			this.gom.setStageValues(stageData);

			//update players hand
			this.gom.updateHandPlayers(data.handPlayers);

			//update phone
			const existSomeEmptySlot = stageData.some((sData) => sData.value === SLOT_VALUE.EMPTY);
			if (existSomeEmptySlot) {
				this.gom.turnOffPhone();
			} else {
				this.gom.turnOnPhone();
			}
		});

		this.gom.createDesk();
		this.gom.initDeskState(this.stores);

		this.gom.createStage();
		this.gom.initStageState(this.stores);

		this.gom.onDeskChange(
			(params: {
				interactionData: { player: Player; idSlot: ID_SLOTS; slotValue: SLOT_VALUE };
				data: { id: number; value: number }[];
			}) => {
				const { player, idSlot } = params.interactionData;
				const matchState = this.gom.getMatchState(this.stores);
				const comparison = compareNewStateWithCurrentState(
					{
						player,
						location: LOCATION.DESK,
						idSlot
					},
					matchState
				);
				const { updated, newState } = comparison;
				if (updated && newState) {
					this.gom.setMatchState(this.stores, newState);
				} else {
					print("nothing to update probably print empty message ");
				}
			}
		);

		this.gom.onStageChange(
			(params: {
				interactionData: { player: Player; idSlot: ID_SLOTS; slotValue: SLOT_VALUE };
				data: { id: number; value: number }[];
			}) => {
				const { player, idSlot } = params.interactionData;
				const matchState = this.gom.getMatchState(this.stores);

				const comparison = compareNewStateWithCurrentState(
					{
						player,
						location: LOCATION.STAGE,
						idSlot
					},
					matchState
				);
				const { updated, newState } = comparison;
				if (updated && newState) {
					this.gom.setMatchState(this.stores, newState);
				} else {
					print("nothing to update probably print empty message ");
				}
			}
		);

		this.gom.onOneSecTimer((sec: number) => {
			this.gom.displaySecs(sec);
		});

		this.gom.onTimerCompleted(() => {
			this.gom.stopTimer();
			this.gom.turnOffPhone();
			this.gom.disableDeskSlots();
			this.gom.disableStageSlots();
			this.gom.deactivatePaperInteraction();
			//notify it is finished
			this.finishedEvent.Fire(id, MATCH_FINISH.LOOSE);
		});

		const msg = {
			type: "RESET_ANIMATE",
			data: {
				roomId: this.gom.getRoomId(),
				objectId: "CABINET_DOOR"
			}
		};
		notifyAllPlayers(msg);
		this.gom.activateCabinetInteraction();
		//this.gom.deactivatePaperInteraction();
	}

	init() {
		print("match.init");
		this.gom.enableDeskSlots();
		this.gom.enableStageSlots();
		this.gom.turnOffPhone();
		this.gom.startTimer();
		this.gom.showTimer();
		this.gom.openMatch();
	}

	getPlayerInteractionEvent() {
		return this.playerInteractionEvent;
	}

	getFinishedEvent() {
		return this.finishedEvent;
	}

	prepareMaid(): void {
		//improve all the connections
		this.connections.forEach((conn) => conn.Disconnect());
		this.addListToMaid([this.gom], "match");
	}
}
