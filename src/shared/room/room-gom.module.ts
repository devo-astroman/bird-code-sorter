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

		const preMatchFolder = findElement<Folder>(this.root, "Prematch");
		return preMatchFolder;
	}

	getMatchFolder() {
		/* const matchFolder = this.root.FindFirstChild("Match", true);
		if (!matchFolder) {
			print("Warning, not found ", matchFolder);
		} */

		const matchFolder = findElement<Folder>(this.root, "Match");
		return matchFolder;
	}

	getResetEvent() {
		/* const event = this.root.FindFirstChild("ResetEvent");
		if (!event) {
			print("Warning, not found ", "ResetEvent");
		}
		return event as BindableEvent; */
		const event = findElement<BindableEvent>(this.root, "ResetEvent");
		return event;
	}

	getPhaseFinishedEvent() {
		/* const event = this.root.FindFirstChild("PhaseFinishedEvent");
		if (!event) {
			print("Warning, not found ", event);
		}
		return event as BindableEvent; */

		const event = findElement<BindableEvent>(this.root, "PhaseFinishedEvent");
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

		const winFolder = <Folder>findElement(this.root, "Win");
		return winFolder;
	}

	prepareMaid(): void {
		this.addListToMaid([this.connection]);
	}
}
