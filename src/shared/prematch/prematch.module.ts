import { PrematchGom } from "./prematch-gom";
import { PrematchZone } from "./prematch-zone.module";

export class Prematch {
	private gom: PrematchGom;
	private prematchZone!: PrematchZone;

	constructor(instance: Instance) {
		print("Prematch --- ", instance);

		this.gom = new PrematchGom(instance as Folder);

		const zone = this.gom.getPrematchZonePart();

		if (zone) {
			this.prematchZone = new PrematchZone(zone);
		}
	}

	init() {
		print("prematch.init");
		this.gom.openPrematch();
		this.prematchZone.init();

		//start time
		/* 
			onTimeFinished {
				getPlayers in zone
			}
		*/
	}

	Destroy() {
		this.prematchZone.Destroy();
		print("Prematch.destroy");
	}
}
