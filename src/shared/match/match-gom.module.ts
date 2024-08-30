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

	/* displaySecs(secs: number) {
		const screensFolder = this.root.FindFirstChild("Screens", true) as Folder;
		const parts = screensFolder.GetChildren() as Part[];
		displayInScreenList(parts, secs + "");
	}

	hideTime() {
		const screensFolder = this.root.FindFirstChild("Screens", true) as Folder;
		const screenParts = screensFolder.GetChildren() as Part[];

		hideScreenList(screenParts);
	}

	showTime() {
		const screensFolder = this.root.FindFirstChild("Screens", true) as Folder;
		const screenParts = screensFolder.GetChildren() as Part[];

		showScreenList(screenParts);
	}

	openMatch() {
		const door2 = this.root.FindFirstChild("Door2", true) as MeshPart;
		door2.CanCollide = false;
		door2.Transparency = 1;
	}

	getDeskFolder() {
		const deskFolder = this.root.FindFirstChild("DeskBirds", true) as Folder;
		if (!deskFolder) {
			print("Warning not found  ", "DeskBirds");
		}

		return deskFolder;
	}

	getStageFolder() {
		const stageFolder = this.root.FindFirstChild("StageBirds", true) as Folder;
		if (!stageFolder) {
			print("Warning not found  ", "StageBirds");
		}

		return stageFolder;
	}

	getPlayerInteractionEvent() {
		const playerInteractionEvent = this.root.FindFirstChild("PlayerInteractionEvent") as BindableEvent;
		if (!playerInteractionEvent) {
			print("Warning not found  ", "PlayerInteractionEvent");
		}

		return playerInteractionEvent;
	}

	getFinishedEvent() {
		const finishedEvent = this.root.FindFirstChild("FinishedEvent") as BindableEvent;
		if (!finishedEvent) {
			print("Warning not found  ", "FinishedEvent");
		}

		return finishedEvent;
	}

	getPhoneFolder() {
		const phoneFolder = this.root.FindFirstChild("Phone", true) as Folder;
		if (!phoneFolder) {
			print("Warning not found  ", "Phone");
		}

		return phoneFolder;
	}

	playWinSound() {
		const winSound = this.root.FindFirstChild("GoodAnswer") as Sound;
		if (!winSound) print("Warning, not found ", "GoodAnswer");
		winSound.Play();
	} */

	prepareMaid(): void {
		//nothing to add
	}
}
