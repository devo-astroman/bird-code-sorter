import { deepCopy } from "@rbxts/deepcopy";
import {
	ID_SLOTS,
	LOCATION,
	SLOT_VALUE,
	SLOTS_DESK_INITIAL_VALUES,
	STATE_MODIFICACION_DATA
} from "shared/constants.module";
import { MATCH_STATE } from "shared/stores/match-store.module";
import { fromIdSlotToIndex } from "./slot-service.module";

export const getNewStateFromInteraction = (
	interactionData: { player: Player; location: LOCATION; idSlot: ID_SLOTS },
	state: MATCH_STATE
): STATE_MODIFICACION_DATA => {
	const { player, location, idSlot } = interactionData;

	const newState = deepCopy(state);

	//find hand of the player
	const playerInteracted = newState.handPlayers.find((hP) => player.UserId === hP.userId);

	//find the value of that slot
	///get if is from desk or from stage
	let slotLine: SLOT_VALUE[];

	if (location === LOCATION.DESK) {
		slotLine = newState.desk;
	} else {
		slotLine = newState.stage;
	}

	///get value of the slot
	if (!playerInteracted) {
		//playerHand = SLOT_VALUE.EMPTY;
		print(
			"Warning there no player with that userId - should not exist interactions of player outside the handPlayers",
			player.UserId
		);

		return {
			updated: false,
			newState: undefined
		};
	}

	const iSlot = fromIdSlotToIndex(idSlot);
	const slotValue = slotLine[iSlot];

	const playerHand = playerInteracted.handValue;

	if (playerHand === SLOT_VALUE.EMPTY && slotValue !== SLOT_VALUE.EMPTY) {
		//player with empty hands is taking a bird - should add a bird to players hand and remove the bird from the slotline
		slotLine[idSlot] = SLOT_VALUE.EMPTY;
		playerInteracted.handValue = slotValue;
	} else if (playerHand !== SLOT_VALUE.EMPTY && slotValue !== SLOT_VALUE.EMPTY) {
		//player with busy hands is tryng to take a bird - should switch one bird with the other
		const bird = playerHand;
		playerInteracted.handValue = slotLine[idSlot];
		slotLine[idSlot] = bird;
	} else if (playerHand !== SLOT_VALUE.EMPTY && slotValue === SLOT_VALUE.EMPTY) {
		//player with busy hands is placing the bird in a empty slot - should move a bird from players hands to slotline
		slotLine[idSlot] = playerInteracted.handValue;
		playerInteracted.handValue = SLOT_VALUE.EMPTY;
	} else if (playerHand === SLOT_VALUE.EMPTY && slotValue === SLOT_VALUE.EMPTY) {
		//player with empty hands is touching an empty slot - should show a message saying "hmmm... I have to put something here"
		//do nothing to state
	}

	print("old state ", state);
	print("new state ", newState);

	return {
		updated: true,
		newState
	};
};

export const generateGoalCombination = () => {
	const intialValues = [...SLOTS_DESK_INITIAL_VALUES];
	const goalCombination = shuffleArray(intialValues);

	return goalCombination;
};

const shuffleArray = (array: number[]) => {
	// Create a copy of the array to avoid modifying the original one
	const shuffled = [...array];

	// Fisher-Yates Shuffle Algorithm
	for (let i = shuffled.size() - 1; i > 0; i--) {
		const j = math.random(0, i);
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
};

export const countSamePositions = (A: number[], B: number[]) => {
	let count = 0;

	// Assuming both arrays have the same length
	for (let i = 0; i < A.size(); i++) {
		if (A[i] === B[i]) {
			count++;
		}
	}

	return count;
};
