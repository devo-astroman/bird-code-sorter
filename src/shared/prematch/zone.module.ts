import { MyMaid } from "shared/maid/my-maid.module";
import { ZoneGom } from "./zone-gom";
import { getUserIdFromPlayerCharacter } from "shared/services/player-game-service.module";

export class Zone extends MyMaid {
	private gom: ZoneGom;
	private playersInside: Model[] = [];

	constructor(zonePart: Part) {
		super();
		this.gom = new ZoneGom(zonePart);
	}
	init() {
		this.gom.triggerOnPlayerEnter((playerCharacter) => {
			print("player entered ", playerCharacter);

			const playerAlreadyPushed = this.playersInside.some((player) => player === playerCharacter);

			if (!playerAlreadyPushed) {
				this.gom.blockPlayerJump(playerCharacter);

				this.playersInside.push(playerCharacter);
				if (this.playersInside.size() === 1) {
					this.gom.fireChangeFirstPlayerEnter();
				}
			}
		});

		this.gom.triggerOnPlayerExit((playerCharacter) => {
			print("player exit ", playerCharacter);
			const playerExist = this.playersInside.some((player) => player === playerCharacter);
			if (playerExist) {
				this.gom.allowPlayerJump(playerCharacter);
				this.playersInside = this.playersInside.filter((player) => player !== playerCharacter);

				if (!this.playersInside.size()) {
					this.gom.fireChangeLastPlayerExit();
				}
			}
		});

		this.gom.onPlayerRemoved((player: Player) => {
			print("PLAYERS ___ ", this.playersInside);

			this.playersInside = this.playersInside.filter((p) => -1 !== getUserIdFromPlayerCharacter(p));
			if (!this.playersInside.size()) {
				//this.onLastPlayerExitFn();
				this.gom.fireChangeLastPlayerExit();
			}
		});
	}

	onFirstPlayerEnter(cb: () => void) {
		this.gom.onFirstPlayerEnter(cb);
	}

	onLastPlayerExit(cb: () => void) {
		this.gom.onLastPlayerExit(cb);
	}

	getPlayersInZone() {
		return this.playersInside;
	}

	end() {
		this.gom.removeTriggerOnPlayerEnter();
		this.gom.removeTriggerOnPlayerExit();

		this.playersInside.forEach((playerCharacter) => {
			this.gom.allowPlayerJump(playerCharacter);
		});
	}
	prepareMaid(): void {
		this.addListToMaid([this.gom]);
	}
}
