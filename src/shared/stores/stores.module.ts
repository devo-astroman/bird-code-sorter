import { ROOM_PHASE } from "shared/constants.module";
import { RoomStore } from "./room-store.module";

export class Stores {
	private roomStore: RoomStore;
	constructor() {
		this.roomStore = new RoomStore();
	}

	getRoomStoreState$() {
		return this.roomStore.getObserver();
	}

	setRoomStoreState(newState: ROOM_PHASE) {
		this.roomStore.setPhase(newState);
	}

	Destroy() {
		//
	}
}
