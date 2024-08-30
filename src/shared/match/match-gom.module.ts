import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";
import { displayInScreenList, hideScreenList, showScreenList } from "shared/services/screens-service.module";

export class MatchGom extends MyMaid {
	private root: Folder;
	constructor(root: Folder) {
		super();
		this.root = root;
	}
	displaySecs(secs: number) {
		const screensFolder = findElement<Folder>(this.root, "Screens");
		const parts = screensFolder.GetChildren() as Part[];
		displayInScreenList(parts, secs + "");
	}

	hideTime() {
		const screensFolder = findElement<Folder>(this.root, "Screens");
		const screenParts = screensFolder.GetChildren() as Part[];

		hideScreenList(screenParts);
	}

	showTime() {
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

	prepareMaid(): void {
		//nothing to add
	}
}
