import { MyMaid } from "shared/maid/my-maid.module";
import { getHumanoidFromUserId } from "shared/services/player-game-service.module";

export class LooseGom extends MyMaid {
	constructor() {
		super();
	}

	killPlayers(userIds: number[]) {
		const pS = game.GetService("Players");
		userIds.forEach((uId) => {
			const humanoid = getHumanoidFromUserId(uId);
			humanoid.Health = 0;
		});
	}

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
