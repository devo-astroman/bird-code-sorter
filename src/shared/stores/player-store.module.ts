import { MutableLiveData, Observer } from "@rbxts/observer";
import { PLAYER_IN_MATCH_DATA, SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";

export class PlayerStore extends MyMaid {
	private playerCharacters$ = new Observer<PLAYER_IN_MATCH_DATA[]>();
	private state = new MutableLiveData<PLAYER_IN_MATCH_DATA[]>();
	constructor() {
		super();
		print("player store");
	}

	addPlayer(player: Model) {
		const data = this.state.getValue() as PLAYER_IN_MATCH_DATA[];
		const alreadyExist = data.some((p) => {
			return p.playerCharacter === player;
		});

		if (!alreadyExist) {
			this.state.setValue([...data, { playerCharacter: player, handValue: SLOT_VALUE.EMPTY }]);
		}
	}

	removePlayer(player: Model) {
		const data = this.state.getValue() as PLAYER_IN_MATCH_DATA[];
		const alreadyExist = data.some((p) => {
			return p.playerCharacter === player;
		});
		if (alreadyExist) {
			this.state.setValue([...data.filter((p) => p.playerCharacter !== player)]);
		}
	}

	setPlayers(players: Model[]) {
		this.state.setValue(players.map((p) => ({ playerCharacter: p, handValue: SLOT_VALUE.EMPTY })));
	}

	getObserver() {
		return this.playerCharacters$;
	}

	getValue() {
		return this.state.getValue();
	}

	prepareMaid(): void {
		this.addListToMaid([this.playerCharacters$, this.state as any]);
	}
}
