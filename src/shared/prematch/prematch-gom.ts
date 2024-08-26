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

	Destroy() {
		//
	}
}
