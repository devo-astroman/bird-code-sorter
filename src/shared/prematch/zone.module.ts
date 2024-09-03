import { MyMaid } from "shared/maid/my-maid.module";
import { ZoneGom } from "./zone-gom";
import { getUserIdFromPlayerCharacter } from "shared/services/player-game-service.module";

export class Zone extends MyMaid {
	private gom: ZoneGom;
	private playersInside: number[] = [];

	constructor(zonePart: Part) {
		super();
		this.gom = new ZoneGom(zonePart);
	}
	init() {
		this.gom.triggerOnPlayerEnter((userId) => {
			const playerAlreadyPushed = this.playersInside.some((player) => player === userId);

			if (!playerAlreadyPushed) {
				this.gom.blockPlayerJump(userId);

				this.playersInside.push(userId);
				if (this.playersInside.size() === 1) {
					this.gom.fireChangeFirstPlayerEnter();
				}
			}
		});

		this.gom.triggerOnPlayerExit((userId) => {
			print("player exit ", userId);
			const playerExist = this.playersInside.some((player) => player === userId);
			if (playerExist) {
				this.gom.allowPlayerJump(userId);
				this.playersInside = this.playersInside.filter((player) => player !== userId);

				if (this.playersInside.size() === 0) {
					this.gom.fireChangeLastPlayerExit();
				}
			}
		});

		this.gom.onPlayerRemoved((player: Player) => {
			print("Zone on playerRemoved!");
			const userId = player.UserId;
			this.playersInside = this.playersInside.filter((pUid) => userId !== pUid);
			if (this.playersInside.size() === 0) {
				this.gom.fireChangeLastPlayerExit();
			} else {
				print("there is still players inside the zone");
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
		this.gom.removeOnPlayerRemoved();

		this.playersInside.forEach((playerCharacter) => {
			this.gom.allowPlayerJump(playerCharacter);
		});
	}
	prepareMaid(): void {
		this.addListToMaid([this.gom]);
	}
}
