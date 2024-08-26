import { ZoneGom } from "./zone-gom";

export class Zone {
	private zonePart: Part;
	private gom: ZoneGom;
	private playersInside: Model[] = [];
	private onFirstPlayerEnterFn: () => void;
	private onLastPlayerExitFn: () => void;

	constructor(zonePart: Part, onFirstPlayerEnterFn: () => void, onLastPlayerExitFn: () => void) {
		this.onFirstPlayerEnterFn = onFirstPlayerEnterFn;
		this.onLastPlayerExitFn = onLastPlayerExitFn;
		this.zonePart = zonePart;
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
					this.onFirstPlayerEnterFn();
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
					this.onLastPlayerExitFn();
				}
			}
		});
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

	Destroy() {
		print("Prematch.destroy");
		this.gom.Destroy();
	}
}
