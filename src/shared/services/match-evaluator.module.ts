import { deepCopy } from "@rbxts/deepcopy";
import { ID_SLOTS, LOCATION, SLOT_VALUE } from "shared/constants.module";
import { MATCH_STATE } from "shared/stores/match-store-.module";
import { fromIdSlotToIndex } from "./slot-service.module";

export const getNewStateFromInteraction = (
	interactionData: { player: Player; location: LOCATION; idSlot: ID_SLOTS },
	state: MATCH_STATE
) => {
	const { player, location, idSlot } = interactionData;

	const currentState = deepCopy(state);

	//find hand of the player
	const playerInteracted = currentState.handPlayers.find((hP) => player.UserId === hP.userId);

	//find the value of that slot
	///get if is from desk or from stage
	let slotLine: SLOT_VALUE[] = currentState.stage;

	if (location === LOCATION.DESK) {
		slotLine = currentState.desk;
	}

	///get value of the slot
	const iSlot = fromIdSlotToIndex(idSlot);
	const slotValue = slotLine[iSlot];

	if (!playerInteracted) {
		//playerHand = SLOT_VALUE.EMPTY;
		print(
			"Warning there no player with that userId - should not exist interactions of player outside the handPlayers",
			player.UserId
		);
	}

	const playerHand = playerInteracted?.handValue ?? SLOT_VALUE.EMPTY;

	if (playerHand === SLOT_VALUE.EMPTY && slotValue !== SLOT_VALUE.EMPTY) {
		//player with empty hands is taking a bird - should add a bird to players hand and remove the bird from the slotline

		slotLine[idSlot] = SLOT_VALUE.EMPTY;

		/* const takenBird = data.value;
		playersBirdData.setPlayerStatus(player.Name, takenBird);
		this.setSlotValue(data.part, SLOT_VALUE.Empty);
		this.birdDisplayer.update(this.slotParts);
		this.registerFn(this.slotParts); */
	} /* else if (playerStatus.holdingBird !== SLOT_VALUE.Empty && data.value !== SLOT_VALUE.Empty) {
		//player with busy hands is tryng to take a bird - should switch one bird for another
		const takenBird = data.value;
		const inHandBird = playerStatus.holdingBird;
		playersBirdData.setPlayerStatus(player.Name, takenBird);
		this.setSlotValue(data.part, inHandBird);
		this.birdDisplayer.update(this.slotParts);
		this.registerFn(this.slotParts);
	} else if (playerStatus.holdingBird !== SLOT_VALUE.Empty && data.value === SLOT_VALUE.Empty) {
		//player with busy hands is placing the bird in a empty slot - should move a bird from players hands to desk
		const inHandBird = playerStatus.holdingBird;
		playersBirdData.setPlayerStatus(player.Name, SLOT_VALUE.Empty);
		this.setSlotValue(data.part, inHandBird);
		this.birdDisplayer.update(this.slotParts);
		this.registerFn(this.slotParts);
	} else if (playerStatus.holdingBird === SLOT_VALUE.Empty && data.value === SLOT_VALUE.Empty) {
		//player with empty hands is touching an empty slot - should show a message saying "hmmm... I have to put something here"
		print("I have to put something here");
	} */
};
