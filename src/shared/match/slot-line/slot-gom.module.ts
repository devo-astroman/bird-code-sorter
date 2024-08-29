import { SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { fromSlotValueToColor3 } from "shared/services/slot-service.module";

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

	updateDisplay(value: SLOT_VALUE) {
		const birdModel = this.root.FindFirstChild("BirdStatue") as Model;
		if (!birdModel) {
			print("Warning not found ", birdModel);
		}

		const base = birdModel.FindFirstChild("Base") as MeshPart;
		const body = birdModel.FindFirstChild("Bird") as MeshPart;
		const paws = birdModel.FindFirstChild("Paws") as MeshPart;

		if (!base || !body || !paws) {
			print("Warning not found base, body or paws", base, body, paws);
		}

		if (value === SLOT_VALUE.EMPTY) {
			paws.Transparency = 1;
			base.Transparency = 1;
			body.Transparency = 1;
		} else {
			base.Transparency = 0;
			base.Color = fromSlotValueToColor3(value);
			body.Transparency = 0;
			body.Color = fromSlotValueToColor3(value);
			paws.Transparency = 0;
			paws.Color = fromSlotValueToColor3(value);
		}
	}

	disableProximityPrompt() {
		const proximityPrompt = this.root.FindFirstChild("ProximityPrompt") as ProximityPrompt;
		if (!proximityPrompt) {
			print("Warning no found ", "ProximityPrompt");
		}

		proximityPrompt.Enabled = false;
	}

	enableProximityPrompt() {
		const proximityPrompt = this.root.FindFirstChild("ProximityPrompt") as ProximityPrompt;
		if (!proximityPrompt) {
			print("Warning no found ", "ProximityPrompt");
		}

		proximityPrompt.Enabled = true;
	}

	prepareMaid(): void {
		this.addListToMaid([this.connection]);
	}
}
