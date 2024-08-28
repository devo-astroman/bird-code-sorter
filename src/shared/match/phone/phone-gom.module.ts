import { activeScreenPhoneColor, inactiveScreenPhoneColor } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";

export class PhoneGom extends MyMaid {
	private root;
	constructor(root: Folder) {
		super();
		this.root = root;
	}

	enablePhone() {
		const proximityPrompt = this.root.FindFirstChild("ProximityPrompt", true) as ProximityPrompt;
		proximityPrompt.Enabled = true;

		const screenDecal = this.root.FindFirstChild("ScreenDecal", true) as Decal;
		screenDecal.Color3 = activeScreenPhoneColor;
	}

	disablePhone() {
		const proximityPrompt = this.root.FindFirstChild("ProximityPrompt", true) as ProximityPrompt;
		proximityPrompt.Enabled = false;

		const screenDecal = this.root.FindFirstChild("ScreenDecal", true) as Decal;
		screenDecal.Color3 = inactiveScreenPhoneColor;
	}

	connectOnTrigger(cb: (player: Player) => void) {
		const proximityPrompt = this.root.FindFirstChild("ProximityPrompt", true) as ProximityPrompt;
		proximityPrompt.Triggered.Connect(cb);
	}

	playWrackSoundNTimes(nTimes: number) {
		const sound = this.root.FindFirstChild("WrackSound") as Sound;

		if (!sound) print("Warning not found WrackSound");

		for (let i = 0; i < nTimes; i++) {
			sound.Play();
			wait(0.2);
		}
	}

	getClickBindableEvent() {
		const bindableEvent = this.root.FindFirstChild("ClickedEvent") as BindableEvent;
		if (!bindableEvent) {
			print("Warning not found", "ClickEvent");
		}

		return bindableEvent;
	}

	prepareMaid(): void {
		//this.addListToMaid();
	}
}
