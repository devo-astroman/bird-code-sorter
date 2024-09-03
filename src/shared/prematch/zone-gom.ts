import { PLAYER_JUMP_HEIGHT } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";
import {
	getCharacterFromUserId,
	getUserIdFromPlayerCharacter,
	isPlayerUpperTorso
} from "shared/services/player-game-service.module";

export class ZoneGom extends MyMaid {
	private part: Part;
	private connectionEnter!: RBXScriptConnection;
	private connectionExit!: RBXScriptConnection;
	private changeEvent!: BindableEvent;
	private playerRemoveConnection!: RBXScriptConnection;
	constructor(part: Part) {
		super();
		this.part = part;
	}

	onPlayerRemoved(cb: (player: Player) => void) {
		const pS = game.GetService("Players");
		this.playerRemoveConnection = this.maidConnection(pS.PlayerRemoving, cb);
	}

	triggerOnPlayerEnter(fn: (playerUserId: number) => void) {
		const zonePart = this.part;
		this.connectionEnter = this.maidConnection(zonePart.Touched, (touchedPart: BasePart) => {
			if (isPlayerUpperTorso(touchedPart)) {
				const playerCharacter = touchedPart.Parent as Model;
				const userId = getUserIdFromPlayerCharacter(playerCharacter);

				fn(userId);
			}
		});
	}
	removeTriggerOnPlayerEnter() {
		this.maidDestroyConnection(this.connectionEnter);
	}

	triggerOnPlayerExit(fn: (playerUserId: number) => void) {
		const zonePart = this.part;
		this.connectionExit = this.maidConnection(zonePart.TouchEnded, (touchedPart: BasePart) => {
			if (isPlayerUpperTorso(touchedPart)) {
				const playerCharacter = touchedPart.Parent as Model;
				const userId = getUserIdFromPlayerCharacter(playerCharacter);
				fn(userId);
			}
		});
	}

	removeTriggerOnPlayerExit() {
		this.connectionExit.Disconnect();
	}

	removeOnPlayerRemoved() {
		this.playerRemoveConnection.Disconnect();
	}

	blockPlayerJump(userId: number) {
		const character = getCharacterFromUserId(userId);
		const humanoid = findElement<Humanoid>(character, "Humanoid");
		humanoid.JumpHeight = 0;
	}

	allowPlayerJump(userId: number) {
		const character = getCharacterFromUserId(userId);
		const humanoid = findElement<Humanoid>(character, "Humanoid");
		humanoid.JumpHeight = PLAYER_JUMP_HEIGHT;
	}

	onFirstPlayerEnter(cb: () => void) {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.maidConnection(this.changeEvent.Event, (eventName: string) => {
			if (eventName === "PlayerEnter") cb();
		});
	}

	fireChangeFirstPlayerEnter() {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.changeEvent.Fire("PlayerEnter");
	}

	onLastPlayerExit(cb: () => void) {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.maidConnection(this.changeEvent.Event, (eventName: string) => {
			if (eventName === "LastPlayerExit") cb();
		});
	}

	fireChangeLastPlayerExit() {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.changeEvent.Fire("LastPlayerExit");
	}

	prepareMaid(): void {
		this.addListToMaid([this.connectionEnter, this.connectionExit]);
	}
}
