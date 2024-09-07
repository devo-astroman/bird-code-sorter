import { DOOR_CG, MAX_PLAYERS_BY_MATCH, PREMATCH_TIME } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";
import { Zone } from "./zone.module";
import { ClockService } from "shared/services/clock-service.module";
import {
	addPlayerToColliderGroupPrematchCG,
	removePlayerFromColliderGroupPrematchCG
} from "shared/services/player-game-service.module";
import { getPrematchRichTextFormat } from "shared/services/screens-service.module";

export class PrematchGom extends MyMaid {
	private root: Folder;
	private clock!: ClockService;
	private zone!: Zone;
	constructor(root: Folder) {
		super();
		this.root = root;
	}

	getChangeEvent() {
		return this.zone.getChangeEvent();
	}

	getPrematchZonePart() {
		const zone = findElement<Part>(this.root, "ZonePart");
		return zone;
	}

	openPrematch() {
		const door1 = findElement<MeshPart>(this.root, "Door1");
		door1.CanCollide = false;
		door1.Transparency = 1;

		const door2Value = findElement<ObjectValue>(this.root, "Door2Value");
		const door2 = door2Value.Value as Part;
		door2.CanCollide = true;
		door2.Transparency = 0;
	}

	closePrematch() {
		const door1 = findElement<MeshPart>(this.root, "Door1");
		door1.CanCollide = true;
		door1.Transparency = 0;
	}

	displaySecs(sec: number, nPlayers: number) {
		const secsTextLabel = findElement<TextLabel>(this.root, "TextLabel");
		const text = getPrematchRichTextFormat(sec, { n: nPlayers, max: MAX_PLAYERS_BY_MATCH });
		secsTextLabel.Text = text;
	}

	hideTimer() {
		const billboardGui = findElement<BillboardGui>(this.root, "BillboardGui");
		const textLabel = findElement<TextLabel>(billboardGui, "TextLabel");
		const text = getPrematchRichTextFormat(PREMATCH_TIME, { n: 1, max: MAX_PLAYERS_BY_MATCH });
		textLabel.Text = text;
		billboardGui.Enabled = false;
	}

	showTimer() {
		const billboardGui = findElement<BillboardGui>(this.root, "BillboardGui");
		billboardGui.Enabled = true;
	}

	getFinishedEvent() {
		const finishedEvent = findElement<BindableEvent>(this.root, "FinishedEvent");
		return finishedEvent;
	}

	fireFinishedEvent() {
		const players = this.getPlayersInZone();
		const finishedEvent = this.getFinishedEvent();

		finishedEvent.Fire(players);
	}

	createTimer() {
		this.clock = new ClockService();
	}

	startTimer() {
		this.clock.startTime(PREMATCH_TIME);
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

	createZone() {
		const zonePart = this.getPrematchZonePart();
		this.zone = new Zone(zonePart);
	}

	managePlayerTags(maxPlayers: number) {
		const changeEvent = this.zone.getChangeEvent();
		this.maidConnection(changeEvent.Event, (data: unknown) => {
			const eventData = data as { event: string; data: number };

			if (eventData.event === "PlayerEnter") {
				if (this.zone.getPlayersInZone().size() === maxPlayers) {
					this.addTagToLimitDoor();
					this.addPlayersFromColliderGroup();
				}
			} else if (eventData.event === "PlayerExit") {
				this.removeTagFromLimitDoor();
				this.removePlayersFromColliderGroup();

				const isInZone = this.isPlayerInzone(eventData.data);
				if (isInZone) {
					this.removeplayerFromColliderGroup(eventData.data);
				}
			}
		});
	}

	onZoneFirstPlayerEnter(cb: () => void) {
		this.zone.onFirstPlayerEnter(cb);
	}

	onZoneLastPlayerExit(cb: () => void) {
		this.zone.onLastPlayerExit(cb);
	}

	initZone() {
		this.zone.init();
	}

	endZone() {
		this.zone.end();
	}

	getPlayersInZone() {
		return this.zone.getPlayersInZone();
	}

	addTagToLimitDoor() {
		const limitDoor = <Part>findElement(this.root, "DoorLimit");
		limitDoor.CanCollide = true;
	}

	removePlayersFromColliderGroup() {
		const players = this.zone.getPlayersInZone();
		players.forEach((userId) => removePlayerFromColliderGroupPrematchCG(userId));
	}

	addPlayersFromColliderGroup() {
		const players = this.zone.getPlayersInZone();
		players.forEach((userId) => addPlayerToColliderGroupPrematchCG(userId));
	}

	removeplayerFromColliderGroup(userId: number) {
		removePlayerFromColliderGroupPrematchCG(userId);
	}

	getNPlayersInZone() {
		return this.zone.getPlayersInZone().size();
	}

	removeTagFromLimitDoor() {
		const limitDoor = <Part>findElement(this.root, "DoorLimit");
		limitDoor.CanCollide = false;
	}

	isPlayerInzone(userId: number) {
		const playersInZone = this.zone.getPlayersInZone();
		return playersInZone.some((pUid) => pUid === userId);
	}

	prepareMaid(): void {
		this.addListToMaid([this.clock, this.zone]);
	}
}
