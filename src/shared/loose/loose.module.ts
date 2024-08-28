import { SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { Stores } from "shared/stores/stores.module";
import { LooseGom } from "./loose-gom.module";

export class Loose extends MyMaid {
	private value!: SLOT_VALUE;
	private id: number;
	private gom!: LooseGom;
	private stores: Stores;
	private playersUserId!: number[];

	constructor(id: number, stores: Stores) {
		super();
		this.id = id;
		this.stores = stores;
		this.gom = new LooseGom();
		print("Loose! --- ");
	}

	init() {}

	killPlayers() {
		const handPlayer = this.stores.getMatchStoreState()?.handPlayers;

		if (!handPlayer) {
			print("Warning there are not players in loose");
		} else {
			this.playersUserId = handPlayer.map((hP) => hP.userId);
		}
		this.gom.killPlayers(this.playersUserId);
	}

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
