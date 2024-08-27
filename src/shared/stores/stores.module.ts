import { ROOM_PHASE } from "shared/constants.module";
import { RoomStore } from "./room-store.module";
import { PlayerStore } from "./player-store.module";
import { MyMaid } from "shared/maid/my-maid.module";

export class Stores extends MyMaid {
	private roomStore: RoomStore;
	private playerStore: PlayerStore;
	constructor() {
		super();
		this.roomStore = new RoomStore();
		this.playerStore = new PlayerStore();
	}

	getRoomStoreState$() {
		return this.roomStore.getObserver();
	}

	setRoomStoreState(newState: ROOM_PHASE) {
		this.roomStore.setPhase(newState);
	}

	getPlayerStoreState$() {
		return this.playerStore.getObserver();
	}

	getPlayerStoreState() {
		return this.playerStore.getValue();
	}

	setPlayersStoreState(players: Model[]) {
		this.playerStore.setPlayers(players);
	}

	prepareMaid(): void {
		this.addListToMaid([this.roomStore, this.playerStore]);
	}
}
