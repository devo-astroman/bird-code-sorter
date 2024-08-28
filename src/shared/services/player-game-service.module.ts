import { PLAYER_CHARACTER_TAG, PLAYER_UPPER_TORSO_TAG } from "shared/constants.module";
import { setTagToChildNamed } from "./tags-service.module";

export const isPlayerUpperTorso = (possibleTorso: unknown) => {
	const possiblePlayer = <unknown>(possibleTorso as Instance).Parent;

	const tags = (possiblePlayer as Instance).GetTags();

	const isPlayer = tags.some((tag) => tag === PLAYER_CHARACTER_TAG);

	if (isPlayer) {
		return (possibleTorso as Instance).Name === "UpperTorso";
	}

	return false;
};

export function onCharacterAdded(character: Model) {
	//const player = Players.GetPlayerFromCharacter(character);
	character.AddTag(PLAYER_CHARACTER_TAG);
	setTagToChildNamed(character, PLAYER_UPPER_TORSO_TAG, "UpperTorso");
}

export function onPlayerAdded(player: Player) {
	print("player added ", player.Name);
	player.CharacterAdded.Connect(onCharacterAdded);
}

export function getUserIdFromPlayerCharacter(character: Model) {
	const pS = game.GetService("Players");
	const player = pS.GetPlayerFromCharacter(character);
	if (!player) {
		print("Warning there is no players in game, returning -1");
		return -1;
	}
	return player.UserId;
}

export function getCharacterFromUserId(userId: number) {
	const pS = game.GetService("Players");
	const player = pS.GetPlayerByUserId(userId);
	if (player) {
		if (player.Character) {
			return player.Character;
		} else {
			print("Warning no character for userid ", userId);
			return pS.CreateHumanoidModelFromUserId(userId);
		}
	} else {
		print("Warning there is no player for user id ", userId);
		return pS.CreateHumanoidModelFromUserId(userId);
	}
}

export const getHumanoidFromUserId = (userId: number) => {
	const character = getCharacterFromUserId(userId);

	const humanoid = character.FindFirstChild("Humanoid", true) as Humanoid;

	return humanoid;
};
