import { ID_SLOTS, ID_SLOTS_INDEX, SLOT_VALUE, SLOT_VALUE_COLORS, SLOT_VALUE_STRINGS } from "shared/constants.module";

export const fromSlotValueToColor3 = (slotValue: SLOT_VALUE) => {
	return SLOT_VALUE_COLORS[slotValue];
};

export const fromIndexToIdSlot = (index: number) => {
	if (index < 0 || index > 3) {
		print("Warning index should be between 0-3, included");
	}

	return ID_SLOTS_INDEX[index];
};

export const fromIdSlotToIndex = (idSlot: ID_SLOTS) => {
	return idSlot as number;
};

export const fromSlotValueToString = (value: SLOT_VALUE) => {
	return SLOT_VALUE_STRINGS[value];
};

export const printSlotInString = (slotValues: SLOT_VALUE[]) => {
	const stringValues = slotValues.map((sV) => fromSlotValueToString(sV));
	print(stringValues);
};
