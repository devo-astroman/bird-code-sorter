import { PREMATCH_TIME } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";
import { Zone } from "./zone.module";
import { ClockService } from "shared/services/clock-service.module";

export class PrematchGom extends MyMaid {
	private root: Folder;
	private clock!: ClockService;
	private zone!: Zone;
	constructor(root: Folder) {
		super();
		this.root = root;
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

	displaySecs(sec: number) {
		const secsTextLabel = findElement<TextLabel>(this.root, "SecsTextLabel");
		secsTextLabel.Text = sec + "";
	}

	hideTimer() {
		const billboardGui = findElement<BillboardGui>(this.root, "BillboardGui");
		const textLabel = findElement<TextLabel>(billboardGui, "SecsTextLabel");
		textLabel.Text = PREMATCH_TIME + "";
		billboardGui.Enabled = false;

		const billboardToStartGui = findElement<BillboardGui>(this.root, "BillboardToStartGui");
		billboardToStartGui.Enabled = false;
	}

	showTimer() {
		const billboardGui = findElement<BillboardGui>(this.root, "BillboardGui");
		billboardGui.Enabled = true;

		const billboardToStartGui = findElement<BillboardGui>(this.root, "BillboardToStartGui");
		billboardToStartGui.Enabled = true;
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

	prepareMaid(): void {
		this.addListToMaid([this.clock, this.zone]);
	}
}
