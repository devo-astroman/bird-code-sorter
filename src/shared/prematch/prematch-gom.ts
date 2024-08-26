export class PrematchGom {
	private root: Folder;
	constructor(root: Folder) {
		this.root = root;
	}

	getPrematchZonePart() {
		const zone = this.root.FindFirstChild("ZonePart", true);
		if (!zone) print("Warning not found child ", zone);
		return zone as Part;
	}

	openPrematch() {
		const door1 = this.root.FindFirstChild("Door1", true) as MeshPart;
		door1.CanCollide = false;
		door1.Transparency = 1;
	}

	closePrematch() {
		const door1 = this.root.FindFirstChild("Door1", true) as MeshPart;
		door1.CanCollide = true;
		door1.Transparency = 0;
	}

	displaySecs(sec: number) {
		const secsTextLabel = this.root.FindFirstChild("SecsTextLabel", true) as TextLabel;
		secsTextLabel.Text = sec + "";
	}

	hideTimer() {
		const billboardGui = this.root.FindFirstChild("BillboardGui", true) as BillboardGui;
		billboardGui.Enabled = false;
		const billboardToStartGui = this.root.FindFirstChild("BillboardToStartGui", true) as BillboardGui;
		billboardToStartGui.Enabled = false;
	}

	showTimer() {
		const billboardGui = this.root.FindFirstChild("BillboardGui", true) as BillboardGui;
		billboardGui.Enabled = true;
		const billboardToStartGui = this.root.FindFirstChild("BillboardToStartGui", true) as BillboardGui;
		billboardToStartGui.Enabled = true;
	}

	Destroy() {
		//
	}
}
