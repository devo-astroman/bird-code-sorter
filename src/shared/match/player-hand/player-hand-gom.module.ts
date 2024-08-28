import { ATTACHMENT_WELD_NAME, SLOT_VALUE, SLOT_VALUE_COLORS } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { setupWeld } from "shared/services/attachment-welder-service.module";
import { getCharacterFromUserId } from "shared/services/player-game-service.module";

export class PlayerHandGom extends MyMaid {
	private userId: number;
	private birdWeld!: MeshPart;

	constructor(userId: number) {
		super();
		this.userId = userId;
	}

	setupBirdWeld() {
		const character = getCharacterFromUserId(this.userId);

		const sS = game.GetService("ServerStorage");
		const referenceDummy = sS.FindFirstChild("ReferenceDummy") as Model;

		this.birdWeld = setupWeld(character, ATTACHMENT_WELD_NAME, referenceDummy) as MeshPart;
	}

	showBirdInHand(birdInHand: SLOT_VALUE) {
		if (birdInHand === SLOT_VALUE.EMPTY) {
			this.hideBird(this.birdWeld);
		} else {
			const color = this.getColorValueFromSlotValue(birdInHand);
			this.colorBird(this.birdWeld, color);
			this.showBird(this.birdWeld);
		}
	}

	private hideBird(bird: MeshPart) {
		const base = bird.FindFirstChild("Base") as MeshPart;
		base.Transparency = 1;
		const birdBody = bird.FindFirstChild("Bird") as MeshPart;
		birdBody.Transparency = 1;
		const paws = bird.FindFirstChild("Paws") as MeshPart;
		paws.Transparency = 1;
	}

	private showBird(bird: MeshPart) {
		const base = bird.FindFirstChild("Base") as MeshPart;
		base.Transparency = 0;
		const birdBody = bird.FindFirstChild("Bird") as MeshPart;
		birdBody.Transparency = 0;
		const paws = bird.FindFirstChild("Paws") as MeshPart;
		paws.Transparency = 0;
	}

	private colorBird(bird: MeshPart, color: Color3) {
		const paws = bird.FindFirstChild("Paws") as MeshPart;
		paws.Color = color;
	}

	private getColorValueFromSlotValue(value: SLOT_VALUE) {
		return SLOT_VALUE_COLORS[value];
	}

	prepareMaid(): void {}
}
