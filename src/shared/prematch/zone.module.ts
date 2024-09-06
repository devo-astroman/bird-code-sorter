import { MyMaid } from "shared/maid/my-maid.module";
import { ZoneGom } from "./zone-gom";

export class Zone extends MyMaid {
	private gom: ZoneGom;
	private playersInside: number[] = [];

	constructor(zonePart: Instance) {
		super();
		this.gom = new ZoneGom(zonePart as Part);
	}
	init() {
		this.gom.onPlayerDied((playerId: number) => {
			const userId = playerId;
			const isPlayerInZone = this.playersInside.some((pId) => pId === userId);

			if (isPlayerInZone) {
				this.playersInside = this.playersInside.filter((pUid) => userId !== pUid);
				if (this.playersInside.size() === 0) {
					this.gom.fireChangeLastPlayerExit();
				} else {
					print("there is still players inside the zone");
				}
			}
		});

		this.gom.triggerOnPlayerEnter((userId) => {
			const playerAlreadyPushed = this.playersInside.some((player) => player === userId);

			if (!playerAlreadyPushed) {
				this.playersInside.push(userId);

				if (this.playersInside.size() === 1) {
					this.gom.fireChangeFirstPlayerEnter();
				}
			}
		});

		this.gom.triggerOnPlayerExit((userId) => {
			const playerExist = this.playersInside.some((player) => player === userId);
			if (playerExist) {
				this.playersInside = this.playersInside.filter((player) => player !== userId);

				if (this.playersInside.size() === 0) {
					this.gom.fireChangeLastPlayerExit();
				}
			}
		});

		this.gom.onPlayerRemoved((player: Player) => {
			print("Zone on playerRemoved!");
			const userId = player.UserId;
			const isPlayerInZone = this.playersInside.some((pId) => pId === userId);

			if (isPlayerInZone) {
				this.playersInside = this.playersInside.filter((pUid) => userId !== pUid);
				if (this.playersInside.size() === 0) {
					this.gom.fireChangeLastPlayerExit();
				} else {
					print("there is still players inside the zone");
				}
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

	getChangeEvent() {
		return this.gom.getChangeEvent();
	}

	end() {
		this.gom.removeTriggerOnPlayerEnter();
		this.gom.removeTriggerOnPlayerExit();
		this.gom.removeOnPlayerRemoved();
	}
	prepareMaid(): void {
		this.addListToMaid([this.gom]);
	}
}
