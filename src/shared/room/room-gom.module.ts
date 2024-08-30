import { MyMaid } from "shared/maid/my-maid.module";
import { ROOM_PHASE } from "shared/constants.module";
import { findElement } from "shared/services/gom-service.module";

export class RoomGom extends MyMaid {
	private root: Instance;
	private connection!: RBXScriptConnection;

	constructor(root: Instance) {
		super();
		this.root = root;
	}

	getInstace() {
		return this.root;
	}

	getPrematchFolder() {
		/* const prematchFolder = this.root.FindFirstChild("Prematch", true);
		if (!prematchFolder) {
			print("Warning, not found ", prematchFolder);
		}
		return prematchFolder; */

		const preMatchFolder = findElement(this.root, "Prematch") as Folder;
		return preMatchFolder;
	}

	getMatchFolder() {
		/* const matchFolder = this.root.FindFirstChild("Match", true);
		if (!matchFolder) {
			print("Warning, not found ", matchFolder);
		} */

		const matchFolder = findElement(this.root, "Match") as Folder;
		return matchFolder;
	}

	getResetEvent() {
		/* const event = this.root.FindFirstChild("ResetEvent");
		if (!event) {
			print("Warning, not found ", "ResetEvent");
		}
		return event as BindableEvent; */
		const event = findElement(this.root, "ResetEvent") as BindableEvent;
		return event;
	}

	getPhaseFinishedEvent() {
		/* const event = this.root.FindFirstChild("PhaseFinishedEvent");
		if (!event) {
			print("Warning, not found ", event);
		}
		return event as BindableEvent; */

		const event = findElement(this.root, "PhaseFinishedEvent") as BindableEvent;
		return event;
	}

	onPhaseFinished(cb: (id: ROOM_PHASE, players: Model[]) => void) {
		const event = this.getPhaseFinishedEvent() as BindableEvent;
		this.connection = event.Event.Connect(cb);
	}

	getWinFolder() {
		/* const winFolder = this.root.FindFirstChild("Win") as Folder;
		if (!winFolder) {
			print("Warning, not found ", "Win");
		}
		return winFolder; */

		const winFolder = findElement(this.root, "Win") as Folder;
		return winFolder;
	}

	prepareMaid(): void {
		this.addListToMaid([this.connection]);
	}
}
