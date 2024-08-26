export class RoomGom {
	private root: Instance;
	constructor(root: Instance) {
		this.root = root;
	}

	getPrematchFolder() {
		const prematchFolder = this.root.FindFirstChild("Prematch", true);
		if (!prematchFolder) {
			print("Warning, not found ", prematchFolder);
		}
		return prematchFolder;
	}

	getMatchFolder() {
		const matchFolder = this.root.FindFirstChild("Match", true);
		if (!matchFolder) {
			print("Warning, not found ", matchFolder);
		}
		return matchFolder;
	}

	Destroy() {}
}
