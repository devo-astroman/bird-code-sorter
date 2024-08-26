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

	Destroy() {}
}
