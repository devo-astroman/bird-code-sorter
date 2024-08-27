import { MyMaid } from "shared/maid/my-maid.module";

export class SlotLineGom extends MyMaid {
	private root: Folder;
	constructor(root: Folder) {
		super();
		this.root = root;
	}

	getChangeEvent() {
		const changeEvent = this.root.FindFirstChild("ChangeEvent", true) as BindableEvent;
		if (!changeEvent) {
			print("Warning no found ", "ChangeEvent");
		}

		return changeEvent;
	}

	getSlotParts() {
		const slotFolder = this.root.FindFirstChild("Slots") as Folder;
		if (!slotFolder) {
			print("Warning no found ", "Slots");
		}

		const slotParts = slotFolder.GetChildren() as Part[];
		return slotParts;
	}

	prepareMaid(): void {
		//nothing to add
	}
}
