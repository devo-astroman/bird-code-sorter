export const ROOM_TAG = "ROOM_TAG";
export const PLAYER_STORE_TAG = "PLAYER_STORE_TAG";
export const PREMATCH_TAG = "PREMATCH_TAG";
export const PLAYER_CHARACTER_TAG = "PLAYER_CHARACTER_TAG";
export const PLAYER_UPPER_TORSO_TAG = "PLAYER_UPPER_TORSO_TAG";

export enum ROOM_PHASE {
	PREMATCH = 0,
	MATCH = 1,
	WIN = 2,
	LOOSE = 3,
}

export enum MATCH_FINISH {
	WIN = 0,
	LOOSE = 1,
}

export enum SLOT_VALUE {
	EMPTY = 0,
	RED = 1,
	GREEN = 2,
	BLUE = 3,
	PURPLE = 4,
}

export const SLOT_VALUE_STRINGS = ["EMPTY", "RED", "GREEN", "BLUE", "PURPLE"];
export const SLOT_VALUE_COLORS = [
	new Color3(0, 0, 0), //EMPTY - BLACK
	new Color3(1, 0, 0), //RED
	new Color3(0, 1, 0), //GREEN
	new Color3(0, 0, 1), //BLUE
	new Color3(0.502, 0, 0.502), //PURPLE
];

export const PREMATCH_TIME = 5; //15
export const MATCH_TIME = 60; //60
export const PLAYER_JUMP_HEIGHT = 7.2;
