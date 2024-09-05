import { MATCH_STATE } from "./stores/match-store.module";

export const ROOM_TAG = "ROOM_TAG";
export const PLAYER_STORE_TAG = "PLAYER_STORE_TAG";
export const PREMATCH_TAG = "PREMATCH_TAG";
export const PLAYER_CHARACTER_TAG = "PLAYER_CHARACTER_TAG";
export const PLAYER_UPPER_TORSO_TAG = "PLAYER_UPPER_TORSO_TAG";

export interface PLAYER_IN_MATCH_DATA {
	playerCharacter: Model;
	handValue: SLOT_VALUE;
}

export enum ROOM_PHASE {
	PREMATCH = 0,
	MATCH = 1,
	WIN = 2,
	LOOSE = 3,
	ABORTING = 4
}

export enum MATCH_FINISH {
	WIN = 0,
	LOOSE = 1,
	ABORT = 2
}

export enum SLOT_VALUE {
	EMPTY = 0,
	RED = 1,
	GREEN = 2,
	BLUE = 3,
	PURPLE = 4
}

export enum LOCATION {
	DESK = 0,
	STAGE = 1
}

export enum ID_SLOTS {
	FIRST = 0,
	SECOND = 1,
	THIRD = 2,
	FOURTH = 3
}
export const ID_SLOTS_INDEX = [ID_SLOTS.FIRST, ID_SLOTS.SECOND, ID_SLOTS.THIRD, ID_SLOTS.FOURTH];

export const SLOT_VALUE_STRINGS = ["EMPTY", "RED", "GREEN", "BLUE", "PURPLE"];
export const SLOT_VALUE_COLORS = [
	new Color3(0, 0, 0), //EMPTY - BLACK
	new Color3(1, 0, 0), //RED
	new Color3(0, 1, 0), //GREEN
	new Color3(0, 0, 1), //BLUE
	new Color3(0.502, 0, 0.502) //PURPLE
];

export const PREMATCH_TIME = 5; //15
export const MATCH_TIME = 60; //60
export const RESET_TIME = 8; //5
export const KILL_TIME = 20; //5

/* 
testings:
	prematch:
		all player removed (done)
		all but 1 removed (done)
	match
		all player removed (done)
		player with bird removed (done)
		all player with bird removed (done)
		all player removed but 1 wins (here)
		all player removed but 1 loose
	win
		all player removed (done)
		all player removed but 1 (done)
	loose
		all player removed (done)
		all player removed but 1 (done)

	bug:
		-bug1, some times the clock of the match changes between two clocks like it is not well cleared
		-bug2, the interactions should be disabled when goes out from match to win or to loose(here)
	
*/

export const PLAYER_JUMP_HEIGHT = 7.2;

export interface STATE_MODIFICACION_DATA {
	updated: boolean;
	newState: MATCH_STATE | undefined;
}

export const ATTACHMENT_WELD_NAME = "BirdStatue";
export const activeScreenPhoneColor = new Color3(0, 255, 0);
export const inactiveScreenPhoneColor = new Color3(0, 0, 0);

export const SLOTS_DESK_INITIAL_VALUES = [SLOT_VALUE.RED, SLOT_VALUE.PURPLE, SLOT_VALUE.GREEN, SLOT_VALUE.BLUE];
