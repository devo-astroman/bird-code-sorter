import { MyMaid } from "shared/maid/my-maid.module";
import { Stores } from "shared/stores/stores.module";
import { LooseGom } from "./loose-gom.module";
import { getModelsFromUserIds } from "shared/services/player-game-service.module";
import { KILL_TIME } from "shared/constants.module";

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
		wait(KILL_TIME);

		const userIds = this.stores.getPlayersInMatchStoreState();
		const characterModels = getModelsFromUserIds(userIds);
		if (characterModels.size() > 0) {
			//telerport only if there are players to be teleported!
			this.killPlayers(userIds);
		}

		wait(1);
		this.getFinishedEvent().Fire();
	}

	killPlayers(userIds: number[]) {
		this.gom.killPlayers(userIds);
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
