import { MutableLiveData, Observer } from "@rbxts/observer";
import { SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";

export interface MATCH_STATE {
	desk: SLOT_VALUE[];
	stage: SLOT_VALUE[];
	handPlayers: { userId: number; handValue: SLOT_VALUE }[];
}

export class MatchStore extends MyMaid {
	private match$ = new Observer<MATCH_STATE>();
	private state = new MutableLiveData<MATCH_STATE>();

	constructor() {
		super();
		print("player store");
		this.state.observe(this.match$);

		this.state.setValue({
			desk: [SLOT_VALUE.RED, SLOT_VALUE.GREEN, SLOT_VALUE.BLUE, SLOT_VALUE.PURPLE],
			stage: [SLOT_VALUE.EMPTY, SLOT_VALUE.EMPTY, SLOT_VALUE.EMPTY, SLOT_VALUE.EMPTY],
			handPlayers: []
		});
	}

	setState(newState: MATCH_STATE) {
		this.state.setValue(newState);
	}

	getObserver() {
		return this.match$;
	}

	getValue() {
		return this.state.getValue();
	}

	prepareMaid(): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.addListToMaid([this.match$, this.state as any]);
	}
}
