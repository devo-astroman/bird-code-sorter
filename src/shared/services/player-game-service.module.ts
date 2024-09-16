import { PLAYER_CHARACTER_TAG, PLAYER_IN_PREMATCH_CG, PLAYER_UPPER_TORSO_TAG } from "shared/constants.module";
import { setTagToChildNamed } from "./tags-service.module";
import { findElement } from "./gom-service.module";

export const playerDiesEvent = new Instance("BindableEvent");

export const isPlayerUpperTorso = (possibleTorso: unknown) => {
	const possiblePlayer = <unknown>(possibleTorso as Instance).Parent;

	const tags = (possiblePlayer as Instance).GetTags();

	const isPlayer = tags.some((tag) => tag === PLAYER_CHARACTER_TAG);

	if (isPlayer) {
		const isUpperTorso = (possibleTorso as Instance).Name === "UpperTorso";
		if (isUpperTorso) {
			const character = (possibleTorso as Instance).Parent as Model;

			const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
			const belongsToAlivePlayer = humanoid.Health > 0;

			return belongsToAlivePlayer;
		}
	}

	return false;
};

export function onCharacterAdded(character: Model) {
	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	humanoid.Died.Connect(() => {
		const userId = getUserIdFromPlayerCharacter(character);
		playerDiesEvent.Fire(userId);
	});

	character.AddTag(PLAYER_CHARACTER_TAG);
	setTagToChildNamed(character, PLAYER_UPPER_TORSO_TAG, "UpperTorso");
}

export function onPlayerAdded(player: Player) {
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

export const getModelsFromUserIds = (userIds: number[]) => {
	const playersInGameIds = game.GetService("Players").GetPlayers();
	const machData = matchUserIds(
		userIds,
		playersInGameIds.map((pIGIds) => ({
			userId: pIGIds.UserId
		}))
	);

	const characterModels = machData.filter((mD) => mD.match).map((mD) => getCharacterFromUserId(mD.userId));
	return characterModels;
};

export const getHumanoidFromUserId = (userId: number) => {
	const character = getCharacterFromUserId(userId);

	const humanoid = character.FindFirstChild("Humanoid", true) as Humanoid;

	return humanoid;
};

export const getPlayerFromUserId = (userId: number) => {
	const pS = game.GetService("Players");
	const player = pS.GetPlayerByUserId(userId);

	if (!player) {
		print("Warning there is no player with that user id, ", userId);
		return undefined;
	}
	return player;
};

export const getPlayerNameFromUserId = (userId: number) => {
	const pS = game.GetService("Players");
	const player = pS.GetPlayerByUserId(userId);

	if (!player) {
		print("Warning there is no player with that user id, ", userId);
		return undefined;
	}
	return player.Name;
};

export const addPlayerToColliderGroupPrematchCG = (userId: number) => {
	const character = getCharacterFromUserId(userId);
	const humanoid = findElement(character, "HumanoidRootPart") as Part;
	const upperTorso = findElement(character, "UpperTorso") as MeshPart;
	const lowerTorso = findElement(character, "LowerTorso") as MeshPart;

	humanoid.CollisionGroup = PLAYER_IN_PREMATCH_CG;
	upperTorso.CollisionGroup = PLAYER_IN_PREMATCH_CG;
	lowerTorso.CollisionGroup = PLAYER_IN_PREMATCH_CG;
};

export const removePlayerFromColliderGroupPrematchCG = (userId: number) => {
	const character = getCharacterFromUserId(userId);
	const humanoid = findElement(character, "HumanoidRootPart") as Part;
	const upperTorso = findElement(character, "UpperTorso") as MeshPart;
	const lowerTorso = findElement(character, "LowerTorso") as MeshPart;

	humanoid.CollisionGroup = "Default";
	upperTorso.CollisionGroup = "Default";
	lowerTorso.CollisionGroup = "Default";
};

export const matchUserIds = (userIds: number[], playersInGame: { userId: number }[]) => {
	const result = userIds.map((userId) => {
		const isMatch = playersInGame.some((player) => player.userId === userId);

		return {
			match: isMatch,
			userId: userId
		};
	});

	return result;
};
