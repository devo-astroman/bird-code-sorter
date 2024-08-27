import { MyMaid } from "shared/maid/my-maid.module";

export class SlotLine extends MyMaid {
	private id: number;
	//bindableEvent to communicate
	constructor(id: number, instance: Instance) {
		super();
		this.id = id;
		print("SlotLine --- ");
	}

	init() {}

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
