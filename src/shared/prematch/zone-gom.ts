import { PLAYER_JUMP_HEIGHT } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";
import { isPlayerUpperTorso } from "shared/services/player-game-service.module";

export class ZoneGom extends MyMaid {
	private part: Part;
	private connectionEnter!: RBXScriptConnection;
	private connectionExit!: RBXScriptConnection;
	private changeEvent!: BindableEvent;
	constructor(part: Part) {
		super();
		this.part = part;
	}

	onPlayerRemoved(cb: (player: Player) => void) {
		const pS = game.GetService("Players");
		this.maidConnection(pS.PlayerRemoving, cb);
	}

	triggerOnPlayerEnter(fn: (playerCharacter: Model) => void) {
		const zonePart = this.part;
		this.connectionEnter = this.maidConnection(zonePart.Touched, (touchedPart: BasePart) => {
			if (isPlayerUpperTorso(touchedPart)) {
				const playerCharacter = touchedPart.Parent as Model;

				fn(playerCharacter);
			}
		});
	}
	removeTriggerOnPlayerEnter() {
		this.maidDestroyConnection(this.connectionEnter);
	}

	triggerOnPlayerExit(fn: (playerCharacter: Model) => void) {
		const zonePart = this.part;
		this.connectionExit = this.maidConnection(zonePart.TouchEnded, (touchedPart: BasePart) => {
			if (isPlayerUpperTorso(touchedPart)) {
				const playerCharacter = touchedPart.Parent as Model;
				fn(playerCharacter);
			}
		});
	}

	removeTriggerOnPlayerExit() {
		this.connectionExit.Disconnect();
	}

	blockPlayerJump(character: Model) {
		const humanoid = findElement<Humanoid>(character, "Humanoid");
		humanoid.JumpHeight = 0;
	}

	allowPlayerJump(character: Model) {
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
