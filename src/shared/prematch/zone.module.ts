import { MyMaid } from "shared/maid/my-maid.module";
import { ZoneGom } from "./zone-gom";

export class Zone extends MyMaid {
	private gom: ZoneGom;
	private playersInside: number[] = [];
	private activeTouches: { userId: number; tick: number }[] = [];
	private debounceTime = 0.35;

	constructor(zonePart: Part) {
		super();
		this.gom = new ZoneGom(zonePart);
	}
	init() {
		this.gom.onPlayerDied((playerId: number) => {
			const userId = playerId;
			const isPlayerInZone = this.playersInside.some((pId) => pId === userId);

			if (isPlayerInZone) {
				this.playersInside = this.playersInside.filter((pUid) => userId !== pUid);
				this.activeTouches = this.activeTouches.filter((aT) => aT.userId !== userId);
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
				this.gom.blockPlayerJump(userId);

				this.playersInside.push(userId);
				this.activeTouches.push({ userId, tick: tick() });

				if (this.playersInside.size() === 1) {
					this.gom.fireChangeFirstPlayerEnter();
				}
			}
		});

		this.gom.triggerOnPlayerExit((userId) => {
			const playerExist = this.playersInside.some((player) => player === userId);
			const lastTouch = this.activeTouches.find((aT) => aT.userId === userId) || { userId, tick: 0 };
			if (playerExist && tick() - lastTouch.tick > this.debounceTime) {
				this.gom.allowPlayerJump(userId);
				this.playersInside = this.playersInside.filter((player) => player !== userId);
				this.activeTouches = this.activeTouches.filter((aT) => aT.userId !== userId);

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
				this.activeTouches = this.activeTouches.filter((aT) => aT.userId !== userId);
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
