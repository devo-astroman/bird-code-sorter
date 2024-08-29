import { MyMaid } from "shared/maid/my-maid.module";
import { ROOM_PHASE } from "shared/constants.module";

export class RoomGom extends MyMaid {
	private root: Instance;
	private connection!: RBXScriptConnection;

	constructor(root: Instance) {
		super();
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

	getPhaseFinishedEvent() {
		const event = this.root.FindFirstChild("PhaseFinishedEvent");
		if (!event) {
			print("Warning, not found ", event);
		}
		return event as BindableEvent;
	}

	onPhaseFinished(cb: (id: ROOM_PHASE, players: Model[]) => void) {
		const event = this.getPhaseFinishedEvent() as BindableEvent;
		this.connection = event.Event.Connect(cb);
	}

	getWinFolder() {
		const winFolder = this.root.FindFirstChild("Win") as Folder;
		if (!winFolder) {
			print("Warning, not found ", "Win");
		}
		return winFolder;
	}

	prepareMaid(): void {
		this.addListToMaid([this.connection]);
	}
}
