import { MutableLiveData, Observer } from "@rbxts/observer";
import { ROOM_PHASE } from "shared/constants.module";

export class RoomStore {
	private phase$ = new Observer<ROOM_PHASE>();
	private data = new MutableLiveData<ROOM_PHASE>();

	constructor() {
		print("player store");
		this.data.observe(this.phase$);
	}

	setPhase(newPhase: ROOM_PHASE) {
		this.data.setValue(newPhase);
	}

	getObserver() {
		return this.phase$;
	}
}
