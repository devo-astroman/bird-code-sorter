import { MutableLiveData, Observer } from "@rbxts/observer";
import { BIRD_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";

export enum PLACE {
	DESK = 0,
	STAGE = 1,
	HUMAN = 2,
}

export enum ID_SLOTS {
	FIRST = 0,
	SECOND = 1,
	THIRD = 2,
	FOURTH = 3,
}
export interface MATCH_STATE {
	id: BIRD_VALUE;
	location: {
		place: PLACE;
		detailPlace: ID_SLOTS | number;
	};
}

export class MatchStore extends MyMaid {
	private match$ = new Observer<MATCH_STATE[]>();
	private state = new MutableLiveData<MATCH_STATE[]>();

	constructor() {
		super();
		print("player store");
		this.state.observe(this.match$);

		this.state.setValue([
			//initial value, all birds in the desk
			{
				id: BIRD_VALUE.RED,
				location: { place: PLACE.DESK, detailPlace: ID_SLOTS.FIRST },
			},
			{
				id: BIRD_VALUE.GREEN,
				location: { place: PLACE.DESK, detailPlace: ID_SLOTS.SECOND },
			},
			{
				id: BIRD_VALUE.BLUE,
				location: { place: PLACE.DESK, detailPlace: ID_SLOTS.THIRD },
			},
			{
				id: BIRD_VALUE.PURPLE,
				location: { place: PLACE.DESK, detailPlace: ID_SLOTS.FOURTH },
			},
		]);
	}

	setBirdPlacePosition(id: BIRD_VALUE, place: PLACE, detailPlace: ID_SLOTS | number) {
		const statesOriginal = this.state.getValue() as MATCH_STATE[];
		const states = [...statesOriginal];

		const state = states.find((s) => s.id === id);
		if (!state) {
			print("Warning no bird with that id ", id);
		} else {
			state.location.place = place;
			state.location.detailPlace = detailPlace;
		}

		this.state.setValue(states);
	}

	getObserver() {
		return this.match$;
	}

	getValue() {
		return this.state.getValue();
	}

	prepareMaid(): void {
		this.addListToMaid([this.match$, this.state as any]);
	}
}
