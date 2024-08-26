import { isPlayerUpperTorso } from "shared/services/player-game-service.module";

export class PrematchZoneGom {
	private part: Part;
	constructor(part: Part) {
		this.part = part;
	}

	triggerOnPlayerEnter(fn: (playerCharacter: Model) => void) {
		const zonePart = this.part;

		const connectionEnter = zonePart.Touched.Connect((touchedPart: BasePart) => {
			if (isPlayerUpperTorso(touchedPart)) {
				const playerCharacter = touchedPart.Parent as Model;

				fn(playerCharacter);
			}
		});
	}
	triggerOnPlayerExit(fn: (playerCharacter: Model) => void) {
		const zonePart = this.part;

		const connectionExit = zonePart.TouchEnded.Connect((touchedPart: BasePart) => {
			if (isPlayerUpperTorso(touchedPart)) {
				const playerCharacter = touchedPart.Parent as Model;

				fn(playerCharacter);
			}
		});
	}

	Destroy() {
		//remove touched and touchended connection
	}
}
