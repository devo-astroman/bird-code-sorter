import { ID_SLOTS, LOCATION, MATCH_TIME, SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";
import {
	displayInScreenList,
	hideScreenList,
	setTextScreenList,
	showScreenList
} from "shared/services/screens-service.module";
import { TimerService } from "shared/services/timer-service.module";
import { Phone } from "./phone/phone.module";
import { Stores } from "shared/stores/stores.module";
import { HAND_PLAYER, MATCH_STATE } from "shared/stores/match-store.module";
import { SlotLine } from "./slot-line/slot-line.module";
import { PlayerHand } from "./player-hand/player-hand.module";
import { playerDiesEvent } from "shared/services/player-game-service.module";
import { ClockService } from "shared/services/clock-service.module";

export class MatchGom extends MyMaid {
	private root: Folder;
	private clock!: ClockService;
	private phone!: Phone;
	private desk!: SlotLine;
	private stage!: SlotLine;
	private playersHand: PlayerHand[] = [];
	constructor(root: Folder) {
		super();
		this.root = root;
	}

	onPlayerDied(cb: (playerId: number) => void) {
		this.maidConnection(playerDiesEvent.Event, cb);
	}

	onPlayerRemoved(cb: (player: Player) => void) {
		const pS = game.GetService("Players");
		this.maidConnection(pS.PlayerRemoving, cb);
	}

	displaySecs(secs: number) {
		const screensFolder = findElement<Folder>(this.root, "Screens");
		const parts = screensFolder.GetChildren() as Part[];
		displayInScreenList(parts, secs + "");
	}

	hideTimer() {
		const screensFolder = findElement<Folder>(this.root, "Screens");
		const screenParts = screensFolder.GetChildren() as Part[];
		setTextScreenList(screenParts, MATCH_TIME + "");
		hideScreenList(screenParts);
	}

	showTimer() {
		const screensFolder = findElement<Folder>(this.root, "Screens");
		const screenParts = screensFolder.GetChildren() as Part[];

		showScreenList(screenParts);
	}

	openMatch() {
		const door2 = findElement<MeshPart>(this.root, "Door2");
		door2.CanCollide = false;
		door2.Transparency = 1;
	}

	getDeskFolder() {
		const deskFolder = findElement<Folder>(this.root, "DeskBirds");
		return deskFolder;
	}

	getStageFolder() {
		const stageFolder = findElement<Folder>(this.root, "StageBirds");
		return stageFolder;
	}

	getPlayerInteractionEvent() {
		const playerInteractionEvent = findElement<BindableEvent>(this.root, "PlayerInteractionEvent");
		return playerInteractionEvent;
	}

	getFinishedEvent() {
		const finishedEvent = findElement<BindableEvent>(this.root, "FinishedEvent");
		return finishedEvent;
	}

	getPhoneFolder() {
		const phoneFolder = findElement<Folder>(this.root, "Phone");
		return phoneFolder;
	}

	playWinSound() {
		const winSound = findElement<Sound>(this.root, "GoodAnswer");
		winSound.Play();
	}
	createTimer() {
		if (!this.clock) this.clock = new ClockService();
	}

	startTimer() {
		this.clock.startTime(MATCH_TIME);
		this.showTimer();
	}

	stopTimer() {
		this.clock.stop();
		this.hideTimer();
	}

	onOneSecTimer(cb: (sec: number) => void) {
		this.clock.onOneSecDo(cb);
	}

	onTimerCompleted(cb: () => void) {
		this.clock.onTimeCompleted(cb);
	}

	createPhone() {
		const phoneFolder = this.getPhoneFolder();
		this.phone = new Phone(phoneFolder);
		return this.phone;
	}

	onPhoneInteraction(cb: () => void) {
		this.maidConnection(this.phone.getClickedBindableEvent().Event, cb);
	}

	playSoundNTimes(nTimes: number) {
		this.phone.playSoundNTimes(nTimes);
	}

	turnOnPhone() {
		this.phone.turnOnPhone();
	}

	turnOffPhone() {
		this.phone.turnOffPhone();
	}

	onMatchStateChange(stores: Stores, callback: (params: MATCH_STATE) => void) {
		const observer = stores.getMatchStoreState$();
		this.maidObserverConnection(observer, callback);
	}

	getMatchState(stores: Stores) {
		return stores.getMatchStoreState();
	}

	setMatchState(stores: Stores, newState: MATCH_STATE) {
		return stores.setMatchStoreState(newState);
	}

	getStageValues(stores: Stores) {
		return stores.getMatchStoreState().stage;
	}

	createDesk() {
		const deskFolder = this.getDeskFolder();
		this.desk = new SlotLine(LOCATION.DESK, deskFolder);
	}

	initDeskState(stores: Stores) {
		const state = stores.getMatchStoreState();
		this.desk.init(state.desk.map((val, i) => ({ id: i, value: val })));
	}

	setDeskValues(values: { id: number; value: SLOT_VALUE }[]) {
		this.desk.setSlotValues(values);
	}

	enableDeskSlots() {
		this.desk.enableSlots();
	}

	disableDeskSlots() {
		this.desk.disableSlots();
	}

	onDeskChange(
		cb: (params: {
			interactionData: { player: Player; idSlot: ID_SLOTS; slotValue: SLOT_VALUE };
			data: { id: number; value: number }[];
		}) => void
	) {
		this.maidConnection(this.desk.getChangeEvent().Event, cb);
	}

	onStageChange(
		cb: (params: {
			interactionData: { player: Player; idSlot: ID_SLOTS; slotValue: SLOT_VALUE };
			data: { id: number; value: number }[];
		}) => void
	) {
		this.maidConnection(this.stage.getChangeEvent().Event, cb);
	}
	//
	createStage() {
		const stageFolder = this.getStageFolder();
		this.stage = new SlotLine(LOCATION.STAGE, stageFolder);
	}

	initStageState(stores: Stores) {
		const state = stores.getMatchStoreState();
		this.stage.init(state.stage.map((val, i) => ({ id: i, value: val })));
	}

	setStageValues(values: { id: number; value: SLOT_VALUE }[]) {
		this.stage.setSlotValues(values);
	}

	enableStageSlots() {
		this.stage.enableSlots();
	}

	disableStageSlots() {
		this.stage.disableSlots();
	}
	//
	updateHandPlayers(hValues: HAND_PLAYER[]) {
		hValues.forEach((hP) => {
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
	}

	prepareMaid(): void {
		const list = [this.clock, this.desk, this.stage, this.phone, ...this.playersHand];
		this.addListToMaid(list, "match gom");
		//nothing to add
	}
}
