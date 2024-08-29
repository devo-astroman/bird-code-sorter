import { MyMaid } from "shared/maid/my-maid.module";
import { getHumanoidFromUserId } from "shared/services/player-game-service.module";
import {
	displayInScreenList,
	getResetRichTextFormat,
	hideScreenList,
	showScreenList
} from "shared/services/screens-service.module";

export class WinGom extends MyMaid {
	private root: Folder;
	constructor(root: Folder) {
		super();
		this.root = root;
	}

	startTime(userIds: number[]) {
		userIds.forEach((uId) => {
			const humanoid = getHumanoidFromUserId(uId);
			humanoid.Health = 0;
		});
	}

	displayResetTime(secs: number) {
		const screensValue = this.root.FindFirstChild("ScreensValue") as ObjectValue;
		if (!screensValue) print("Warning not found", "ScreensValue");

		const screensFolder = screensValue.Value as Folder;
		const parts = screensFolder.GetChildren() as Part[];
		const resetRichText = getResetRichTextFormat(secs + "");
		displayInScreenList(parts, resetRichText);
	}

	hideTime() {
		const screensValue = this.root.FindFirstChild("ScreensValue") as ObjectValue;
		if (!screensValue) print("Warning not found", "ScreensValue");

		const screensFolder = screensValue.Value as Folder;
		const parts = screensFolder.GetChildren() as Part[];
		hideScreenList(parts);
	}

	showTime() {
		const screensValue = this.root.FindFirstChild("ScreensValue") as ObjectValue;
		if (!screensValue) print("Warning not found", "ScreensValue");

		const screensFolder = screensValue.Value as Folder;
		const parts = screensFolder.GetChildren() as Part[];
		showScreenList(parts);
	}

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
