import { deepCopy } from "@rbxts/deepcopy";
import { MutableLiveData, Observer } from "@rbxts/observer";
import { SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";

export interface HAND_PLAYER {
	userId: number;
	handValue: SLOT_VALUE;
}
export interface MATCH_STATE {
	desk: SLOT_VALUE[];
	stage: SLOT_VALUE[];
	handPlayers: HAND_PLAYER[];
}

export class MatchStore extends MyMaid {
	private match$ = new Observer<MATCH_STATE>();
	private state = new MutableLiveData<MATCH_STATE>();

	constructor() {
		super();
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

	setPlayersUserId(playersUserId: number[]) {
		const playersHand = playersUserId.map((pUId) => ({
			userId: pUId,
			handValue: SLOT_VALUE.EMPTY
		}));

		const currentState = this.getValue();
		if (!currentState) {
			print("Warning match store undefined");
		} else {
			const newState = deepCopy(currentState);
			newState.handPlayers = playersHand;
			this.state.setValue(newState);
		}
	}

	removePlayersByUserId(userId: number) {
		const currentState = this.getValue();
		if (!currentState) {
			print("Warning match store undefined");
		} else {
			const copyState = deepCopy(currentState);

			const newHandPlayers: HAND_PLAYER[] = [];
			let birdInHandOfPlayerToRemove = SLOT_VALUE.EMPTY;
			copyState.handPlayers.forEach((hP) => {
				if (hP.userId === userId) {
					if (hP.handValue !== SLOT_VALUE.EMPTY) {
						birdInHandOfPlayerToRemove = hP.handValue;
					}
				} else {
					newHandPlayers.push(hP);
				}
			});

			if (birdInHandOfPlayerToRemove !== SLOT_VALUE.EMPTY) {
				const index = copyState.desk.indexOf(SLOT_VALUE.EMPTY);
				copyState.desk[index] = birdInHandOfPlayerToRemove;
			}
			copyState.handPlayers = newHandPlayers;
			print("______");
			print("Originalstate ", currentState);
			print("Setting the new state ", copyState);
			print("______");
			this.setState(copyState);
		}
	}

	prepareMaid(): void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		//this.addListToMaid([this.match$, this.state as any]);
	}
}
