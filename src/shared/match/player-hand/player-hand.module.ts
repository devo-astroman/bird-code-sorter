import { SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { PlayerHandGom } from "./player-hand-gom.module";

export class PlayerHand extends MyMaid {
	private userId: number;
	private handValue: SLOT_VALUE;
	private gom: PlayerHandGom;

	constructor(userId: number) {
		super();
		this.userId = userId;
		this.handValue = SLOT_VALUE.EMPTY;
		this.gom = new PlayerHandGom(userId);
		this.gom.setupBirdWeld();
	}

	init() {}

	setHandValue(newValue: SLOT_VALUE) {
		this.handValue = newValue;
		this.gom.showBirdInHand(this.handValue);
	}

	getUserId() {
		return this.userId;
	}

	prepareMaid(): void {}
}
