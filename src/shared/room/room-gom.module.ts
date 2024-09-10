import { MyMaid } from "shared/maid/my-maid.module";
import { MATCH_FINISH, ROOM_PHASE } from "shared/constants.module";
import { findElement } from "shared/services/gom-service.module";
import { Prematch } from "shared/prematch/prematch.module";
import { Stores } from "shared/stores/stores.module";
import { Match } from "shared/match/match.module";
import { Win } from "shared/win/win.module";
import { Loose } from "shared/loose/loose.module";

export class RoomGom extends MyMaid {
	private root: Instance;
	private prematch!: Prematch;
	private match!: Match;
	private win!: Win;
	private loose!: Loose;

	constructor(root: Instance) {
		super();
		this.root = root;
	}

	getInstace() {
		return this.root;
	}

	getPrematchFolder() {
		const preMatchFolder = findElement<Folder>(this.root, "Prematch");
		return preMatchFolder;
	}

	getMatchFolder() {
		const matchFolder = findElement<Folder>(this.root, "Match");
		return matchFolder;
	}

	getResetEvent() {
		const event = findElement<BindableEvent>(this.root, "ResetEvent");
		return event;
	}

	getPhaseFinishedEvent() {
		const event = findElement<BindableEvent>(this.root, "PhaseFinishedEvent");
		return event;
	}

	getWinFolder() {
		const winFolder = <Folder>findElement(this.root, "Win");
		return winFolder;
	}

	getLooseFolder() {
		const looseFolder = <Folder>findElement(this.root, "Loose");
		return looseFolder;
	}

	createPrematch(roomPhase: ROOM_PHASE) {
		const prematchFolder = this.getPrematchFolder();
		this.prematch = new Prematch(roomPhase, prematchFolder);
		return this.prematch;
	}

	onPrematchFinished(cb: (players: number[]) => void) {
		this.maidConnection(this.prematch.getFinishedEvent().Event, cb);
	}
	initPrematch() {
		this.prematch.init();
	}

	createMatch(roomPhase: ROOM_PHASE, stores: Stores) {
		const matchFolder = this.getMatchFolder();
		this.match = new Match(roomPhase, matchFolder, stores);
		return this.match;
	}

	initMatch() {
		this.match.init();
	}

	onMatchFinished(cb: (data: MATCH_FINISH) => void) {
		this.maidConnection(this.match.getFinishedEvent().Event, cb);
	}

	createWin(stores: Stores) {
		const winFolder = this.getWinFolder();
		this.win = new Win(0, stores, winFolder);
		return this.win;
	}

	initWin() {
		this.win.init();
	}

	onWinFinished(cb: () => void) {
		this.maidConnection(this.win.getFinishedEvent().Event, cb);
	}

	createLoose(stores: Stores) {
		const looseFolder = this.getLooseFolder();
		this.loose = new Loose(0, looseFolder, stores);
		return this.loose;
	}

	initLoose() {
		this.loose.init();
	}

	onLooseFinished(cb: () => void) {
		this.maidConnection(this.loose.getFinishedEvent().Event, cb);
	}

	setIdValue(id: number) {
		const numberValue = <NumberValue>findElement(this.root, "Value");
		numberValue.Value = id;
	}

	prepareMaid(): void {
		this.addListToMaid([this.prematch, this.match, this.win, this.loose]);
	}
}
