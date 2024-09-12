import { MyMaid } from "shared/maid/my-maid.module";
import { findElementShallow } from "shared/services/gom-service.module";

export class UIManager extends MyMaid {
	constructor() {
		super();
	}

	showPaper(player: Player, paperMsg: string, cb: () => void) {
		//add the second parameter to know what should be written in the paper
		const pG = findElementShallow<ModuleScript>(player, "PlayerGui");
		const paperScreenGui = findElementShallow<ScreenGui>(pG, "PaperScreenGui");

		const frame = findElementShallow<Frame>(paperScreenGui, "Frame");
		const textButton = findElementShallow<TextButton>(frame, "TextButton");

		const imageLabel = findElementShallow<ImageLabel>(frame, "ImageLabel");
		const textLabel = findElementShallow<TextLabel>(imageLabel, "TextLabel");
		textLabel.Text = paperMsg;

		paperScreenGui.Enabled = true;

		const connection = textButton.Activated.Connect(() => {
			//this should be a callback parameter
			paperScreenGui.Enabled = false;
			connection.Disconnect();
			cb();
		});
	}

	prepareMaid(): void {}
}
