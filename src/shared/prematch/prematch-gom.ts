import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";

export class PrematchGom extends MyMaid {
	private root: Folder;
	constructor(root: Folder) {
		super();
		this.root = root;
	}

	getPrematchZonePart() {
		/* const zone = this.root.FindFirstChild("ZonePart", true);
		if (!zone) print("Warning not found child ", zone);
		return zone as Part; */
		const zone = findElement<Part>(this.root, "ZonePart");
		return zone;
	}

	openPrematch() {
		//const door1 = this.root.FindFirstChild("Door1", true) as MeshPart;
		const door1 = findElement<MeshPart>(this.root, "Door1");
		door1.CanCollide = false;
		door1.Transparency = 1;

		//const door2Value = this.root.FindFirstChild("Door2Value", true) as ObjectValue;
		const door2Value = findElement<ObjectValue>(this.root, "Door2Value");
		const door2 = door2Value.Value as Part;
		door2.CanCollide = true;
		door2.Transparency = 0;
	}

	closePrematch() {
		//const door1 = this.root.FindFirstChild("Door1", true) as MeshPart;
		const door1 = findElement<MeshPart>(this.root, "Door1");
		door1.CanCollide = true;
		door1.Transparency = 0;
	}

	/* 	displaySecs(sec: number) {
		const secsTextLabel = this.root.FindFirstChild("SecsTextLabel", true) as TextLabel;
		secsTextLabel.Text = sec + "";
	} */
	displaySecs(sec: number) {
		const secsTextLabel = findElement<TextLabel>(this.root, "SecsTextLabel");
		secsTextLabel.Text = sec + "";
	}

	/* 	hideTimer() {
		const billboardGui = this.root.FindFirstChild("BillboardGui", true) as BillboardGui;
		billboardGui.Enabled = false;
		const billboardToStartGui = this.root.FindFirstChild("BillboardToStartGui", true) as BillboardGui;
		billboardToStartGui.Enabled = false;
	} */
	hideTimer() {
		const billboardGui = findElement<BillboardGui>(this.root, "BillboardGui");
		billboardGui.Enabled = false;

		const billboardToStartGui = findElement<BillboardGui>(this.root, "BillboardToStartGui");
		billboardToStartGui.Enabled = false;
	}

	/* 	showTimer() {
		const billboardGui = this.root.FindFirstChild("BillboardGui", true) as BillboardGui;
		billboardGui.Enabled = true;
		const billboardToStartGui = this.root.FindFirstChild("BillboardToStartGui", true) as BillboardGui;
		billboardToStartGui.Enabled = true;
	} */
	showTimer() {
		const billboardGui = findElement<BillboardGui>(this.root, "BillboardGui");
		billboardGui.Enabled = true;

		const billboardToStartGui = findElement<BillboardGui>(this.root, "BillboardToStartGui");
		billboardToStartGui.Enabled = true;
	}

	/* 	getFinishedEvent() {
		const finishedEvent = this.root.FindFirstChild("FinishedEvent") as BindableEvent;
		if (!finishedEvent) {
			print("Warning not found ", "FinishedEvent");
		}

		return finishedEvent;
	} */
	getFinishedEvent() {
		const finishedEvent = findElement<BindableEvent>(this.root, "FinishedEvent");
		return finishedEvent;
	}

	fireFinishedEvent(players: Model[]) {
		const finishedEvent = this.getFinishedEvent();

		finishedEvent.Fire(players);
	}

	prepareMaid(): void {}
}
