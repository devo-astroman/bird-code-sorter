import { SLOT_VALUE, SLOT_VALUE_COLORS } from "shared/constants.module";

export const fromSlotValueToColor3 = (slotValue: SLOT_VALUE) => {
	return SLOT_VALUE_COLORS[slotValue];
};
