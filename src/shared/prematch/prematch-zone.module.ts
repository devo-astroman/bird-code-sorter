import { PrematchZoneGom } from "./prematch-zone-gom";

export class PrematchZone {
	private zonePart: Part;
	private gom: PrematchZoneGom;

	constructor(zonePart: Part) {
		this.zonePart = zonePart;
		this.gom = new PrematchZoneGom(zonePart);
	}
	init() {
		this.gom.triggerOnPlayerEnter((playerCharacter) => {
			print("player entered ", playerCharacter);
		});

		this.gom.triggerOnPlayerExit((playerCharacter) => {
			print("player exit ", playerCharacter);
		});
	}

	Destroy() {
		print("Prematch.destroy");
		this.gom.Destroy();
	}
}
