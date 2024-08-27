import { SLOT_VALUE } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { SlotGom } from "./slot-gom.module";

export class Slot extends MyMaid {
	private value!: SLOT_VALUE;
	private id: number;
	private gom: SlotGom;
	private interactedEvent: BindableEvent;
	//bindableEvent to communicate
	constructor(id: number, instance: Instance, value: SLOT_VALUE) {
		super();
		this.id = id;
		this.value = value;
		this.gom = new SlotGom(instance as Folder);
		this.gom.updateDisplay(this.value);
		this.interactedEvent = this.gom.getInteractEvent();
		this.gom.onTriggerEvent((player) => {
			this.interactedEvent.Fire(player, id, this.value);
		});
		print("Slot --- ");
	}

	init() {}

	setValue(value: SLOT_VALUE) {
		this.value = value;
		this.gom.updateDisplay(this.value);
	}

	getInteracted() {
		return this.interactedEvent;
	}

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
