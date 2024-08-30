import { MyMaid } from "shared/maid/my-maid.module";
import { Stores } from "shared/stores/stores.module";
import { LooseGom } from "./loose-gom.module";

export class Loose extends MyMaid {
	private id: number;
	private gom!: LooseGom;
	private stores: Stores;
	private playersUserId!: number[];
	private root: Folder;

	constructor(id: number, root: Folder, stores: Stores) {
		super();
		this.id = id;
		this.root = root;
		this.stores = stores;
		this.gom = new LooseGom();
		print("Loose! --- ");
	}

	init() {
		wait(1);
		this.killPlayers();
	}

	killPlayers() {
		const handPlayer = this.stores.getMatchStoreState()?.handPlayers;

		if (!handPlayer) {
			print("Warning there are not players in loose");
		} else {
			this.playersUserId = handPlayer.map((hP) => hP.userId);
		}
		this.gom.killPlayers(this.playersUserId);
		wait(1);
		this.getFinishedEvent().Fire();
	}

	getFinishedEvent() {
		const finishedEvent = this.root.FindFirstChild("FinishedEvent") as BindableEvent;
		if (!finishedEvent) {
			print("Warning not found  ", "FinishedEvent");
		}

		return finishedEvent;
	}

	prepareMaid(): void {
		this.addListToMaid([this.gom]);
	}
}
