import { MyMaid } from "shared/maid/my-maid.module";

export class Slot extends MyMaid {
	private id: number;
	//bindableEvent to communicate
	constructor(id: number, instance: Instance) {
		super();
		this.id = id;
		print("Slot --- ");
	}

	init() {}

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
