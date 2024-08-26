import { PLAYER_JUMP_HEIGHT } from "shared/constants.module";
import { isPlayerUpperTorso } from "shared/services/player-game-service.module";

export class PrematchZoneGom {
	private part: Part;
	private connectionEnter!: RBXScriptConnection;
	private connectionExit!: RBXScriptConnection;
	constructor(part: Part) {
		this.part = part;
	}

	triggerOnPlayerEnter(fn: (playerCharacter: Model) => void) {
		const zonePart = this.part;

		this.connectionEnter = zonePart.Touched.Connect((touchedPart: BasePart) => {
			if (isPlayerUpperTorso(touchedPart)) {
				const playerCharacter = touchedPart.Parent as Model;

				fn(playerCharacter);
			}
		});
	}
	removeTriggerOnPlayerEnter() {
		this.connectionEnter.Disconnect();
	}

	triggerOnPlayerExit(fn: (playerCharacter: Model) => void) {
		const zonePart = this.part;

		this.connectionExit = zonePart.TouchEnded.Connect((touchedPart: BasePart) => {
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
		const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
		humanoid.JumpHeight = 0;
	}

	allowPlayerJump(character: Model) {
		const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
		humanoid.JumpHeight = PLAYER_JUMP_HEIGHT;
	}

	Destroy() {
		//remove touched and touchended connection
	}
}
