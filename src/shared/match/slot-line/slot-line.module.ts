import { MyMaid } from "shared/maid/my-maid.module";
import { SlotLineGom } from "./slot-line-gom.module";
import { Slot } from "./slot.module";
import { SLOT_VALUE } from "shared/constants.module";

export class SlotLine extends MyMaid {
	private id: number;
	private gom: SlotLineGom;
	private changeEvent: BindableEvent;
	private slotsData: {
		id: number;
		value: SLOT_VALUE;
		slot: Slot;
	}[] = [];

	constructor(id: number, instance: Instance) {
		super();
		print("SlotLine --- ");
		this.id = id;
		this.gom = new SlotLineGom(instance as Folder);
		this.changeEvent = this.gom.getChangeEvent();
		const slotParts = this.gom.getSlotParts();

		slotParts.forEach((sPart, i) => {
			const initValue = SLOT_VALUE.EMPTY;
			const slot = new Slot(i, sPart, SLOT_VALUE.EMPTY);
			slot.getInteracted().Event.Connect((player, id, value) => {
				slot.setValue(SLOT_VALUE.BLUE); //to test!! the value depends on the players hand

				const interactionData = { player, id, value };
				this.setSlotValue(id, SLOT_VALUE.BLUE);

				this.changeEvent.Fire(interactionData, this.slotsData);
			});
			const sData = {
				id: i,
				value: initValue,
				slot,
			};

			this.slotsData.push(sData);
		});
	}

	init() {}

	getChangeEvent() {
		return this.changeEvent;
	}

	setSlotValue(id: number, newValue: SLOT_VALUE) {
		const slotData = this.slotsData.find((sData) => sData.id === id);
		if (!slotData) {
			print("warning no found slotData with id ", id);
		} else {
			slotData.value = newValue;
		}
	}

	prepareMaid(): void {
		this.addListToMaid([]);
	}
}
