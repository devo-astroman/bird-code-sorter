import { MyMaid } from "shared/maid/my-maid.module";
import { PhoneGom } from "./phone-gom.module";

export class Phone extends MyMaid {
	private root: Folder;
	private clicked: BindableEvent;
	private gom: PhoneGom;

	constructor(root: Folder) {
		super();
		this.root = root;
		this.gom = new PhoneGom(this.root);
		this.clicked = this.gom.getClickBindableEvent();
		this.gom.connectOnTrigger((player) => {
			this.clicked.Fire();
		});
	}

	turnOnPhone() {
		this.gom.enablePhone();
	}

	turnOffPhone() {
		this.gom.disablePhone();
	}

	playSoundNTimes(nTimes: number) {
		this.gom.playWrackSoundNTimes(nTimes);
	}

	getClickedBindableEvent() {
		return this.clicked;
	}

	prepareMaid(): void {}
}
