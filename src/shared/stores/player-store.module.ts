import { MutableLiveData, Observer } from "@rbxts/observer";

export class PlayerStore {
	private playerCharacters$ = new Observer<Model[]>();
	private state = new MutableLiveData<Model[]>();
	constructor() {
		print("player store");
	}

	addPlayer(player: Model) {
		const data = this.state.getValue() as Model[];
		const alreadyExist = data.some((p) => {
			return p === player;
		});

		if (!alreadyExist) {
			this.state.setValue([...data, player]);
		}
	}

	removePlayer(player: Model) {
		const data = this.state.getValue() as Model[];
		const alreadyExist = data.some((p) => {
			return p === player;
		});
		if (alreadyExist) {
			this.state.setValue([...data.filter((p) => p !== player)]);
		}
	}

	setPlayers(players: Model[]) {
		this.state.setValue(players);
	}

	getObserver() {
		return this.playerCharacters$;
	}

	getValue() {
		return this.state.getValue();
	}
}
