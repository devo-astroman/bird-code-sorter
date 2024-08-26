import { ROOM_PHASE } from "shared/constants.module";
import { RoomStore } from "./room-store.module";
import { PlayerStore } from "./player-store.module";

export class Stores {
	private roomStore: RoomStore;
	private playerStore: PlayerStore;
	constructor() {
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

	Destroy() {
		//
	}
}
