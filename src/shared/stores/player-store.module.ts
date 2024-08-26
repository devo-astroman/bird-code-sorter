import { MutableLiveData } from "@rbxts/observer";

export class PlayerStore {
	private playerNames: string[] = [];
	private store = new MutableLiveData<string[]>();
	constructor() {
		print("player store");
	}

	addPlayer(name: string) {
		const alreadyExist = this.playerNames.some((p) => {
			return p === name;
		});

		if (!alreadyExist) {
			this.store.setValue([...this.playerNames, name]);
		}
	}

	removePlayer(name: string) {
		const alreadyExist = this.playerNames.some((p) => {
			return p === name;
		});
		if (alreadyExist) {
			this.store.setValue([...this.playerNames.filter((p) => p !== name)]);
		}
	}
}
