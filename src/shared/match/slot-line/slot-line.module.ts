import { MyMaid } from "shared/maid/my-maid.module";
import { SlotLineGom } from "./slot-line-gom.module";
import { Slot } from "./slot.module";
import { ID_SLOTS, SLOT_VALUE } from "shared/constants.module";
import { fromIndexToIdSlot } from "shared/services/slot-service.module";

export class SlotLine extends MyMaid {
	private id: number;
	private gom: SlotLineGom;
	private changeEvent: BindableEvent;
	private slotsData: {
		id: ID_SLOTS;
		value: SLOT_VALUE;
		slot: Slot;
	}[] = [];

	private connectionList: RBXScriptConnection[] = [];

	constructor(id: number, instance: Instance) {
		super();
		this.id = id;
		this.gom = new SlotLineGom(instance as Folder);
		this.changeEvent = this.gom.getChangeEvent();
	}

	init(newSlotsData: { id: ID_SLOTS; value: SLOT_VALUE }[]) {
		const slotParts = this.gom.getSlotParts();

		slotParts.forEach((sPart, i) => {
			const initValue = newSlotsData[i].value;
			const idSlot = fromIndexToIdSlot(i);
			const slot = new Slot(idSlot, sPart, initValue);

			const conn = slot.getInteracted().Event.Connect((player, id, value) => {
				const interactionData = { player, idSlot: id, slotValue: value };
				this.changeEvent.Fire({
					interactionData,
					data: this.slotsData
				});
			});
			const sData = {
				id: i,
				value: initValue,
				slot
			};

			this.connectionList.push(conn);

			this.slotsData.push(sData);
		});
	}

	getChangeEvent() {
		return this.changeEvent;
	}

	setSlotValue(id: number, newValue: SLOT_VALUE) {
		const slotData = this.slotsData.find((sData) => sData.id === id);
		if (!slotData) {
			print("warning no found slotData with id ", id);
		} else {
			slotData.value = newValue;
			slotData.slot.setValue(newValue);
		}
	}

	setSlotValues(newSlotsData: { id: ID_SLOTS; value: SLOT_VALUE }[]) {
		this.slotsData.forEach((sData) => {
			const newSlotData = newSlotsData.find((nValue) => nValue.id === sData.id);
			if (!newSlotData) {
				print("Warning there is no slotData with that id ", sData.id);
			} else {
				sData.value = newSlotData.value;
				sData.slot.setValue(newSlotData.value);
			}
		});
	}

	enableSlots() {
		this.slotsData.forEach((sData) => {
			sData.slot.enableSlot();
		});
	}

	disableSlots() {
		this.slotsData.forEach((sData) => {
			sData.slot.disableSlot();
		});
	}

	prepareMaid(): void {
		this.connectionList.forEach((conn) => conn.Disconnect()); //continue here
		const maidList: (SlotLineGom | Slot)[] = [this.gom];
		this.slotsData.forEach((sData) => {
			maidList.push(sData.slot);
		});

		this.addListToMaid(maidList);
	}
}
