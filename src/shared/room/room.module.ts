import { Observer } from "@rbxts/observer";
import { ROOM_PHASE } from "shared/constants.module";
import { Prematch } from "shared/prematch/prematch.module";
import { Stores } from "shared/stores/stores.module";
import { RoomGom } from "./room-gom.module";

export class Room {
	private stores: Stores;
	private roomGom: RoomGom;

	private room$: Observer<ROOM_PHASE>;

	private preMatch!: Prematch;
	constructor(instance: Instance) {
		print(" - Room -");
		this.stores = new Stores();
		this.roomGom = new RoomGom(instance);

		this.room$ = this.stores.getRoomStoreState$();

		const prematchFolder = this.roomGom.getPrematchFolder();
		if (prematchFolder) {
			this.preMatch = new Prematch(prematchFolder);
		}
	}

	init() {
		this.room$.connect((phase) => {
			if (phase !== undefined) {
				if (phase === ROOM_PHASE.PREMATCH) {
					this.preMatch.init();
					//preMatch.finished(()=>this.stores.setRoomStoreState(ROOM_PHASE.MATCH))
				} else if (phase === ROOM_PHASE.MATCH) {
					print("match");
				} else if (phase === ROOM_PHASE.WIN) {
					print("win");
				} else if (phase === ROOM_PHASE.LOOSE) {
					print("loose");
				}
			}
		});

		this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
	}

	Destroy() {
		print("Prematch.destroy");
		this.stores.Destroy();
	}
}
