import { MyMaid } from "shared/maid/my-maid.module";

export class SlotGom extends MyMaid {
	private root: Folder;
	private connection!: RBXScriptConnection;
	constructor(root: Folder) {
		super();
		this.root = root;
	}

	getInteractEvent() {
		const interactedEvent = this.root.FindFirstChild("InteractedEvent") as BindableEvent;
		if (!interactedEvent) {
			print("Warning no found ", "InteractedEvent");
		}

		return interactedEvent;
	}

	onTriggerEvent(cb: (player: Player) => void) {
		const proximityPrompt = this.root.FindFirstChild("ProximityPrompt") as ProximityPrompt;

		if (!proximityPrompt) {
			print("Warning no found ", "ProximityPrompt");
		}

		this.connection = proximityPrompt.Triggered.Connect(cb);
	}

	prepareMaid(): void {
		this.addListToMaid([this.connection]);
	}
}
