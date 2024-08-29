import { MutableLiveData, Observer } from "@rbxts/observer";
import { ROOM_PHASE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";

export class RoomStore extends MyMaid {
	private phase$ = new Observer<ROOM_PHASE>();
	private state = new MutableLiveData<ROOM_PHASE>();

	constructor() {
		super();
		this.state.observe(this.phase$);
	}

	setPhase(newPhase: ROOM_PHASE) {
		this.state.setValue(newPhase);
	}

	getObserver() {
		return this.phase$;
	}

	prepareMaid(): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		//this.addListToMaid([this.phase$, this.state as any]);
	}
}
