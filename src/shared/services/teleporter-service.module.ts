export const teleportPlayersInListToPoint = (characterList: Model[], destination: Part) => {
	characterList.forEach((ch) => {
		teleportPlayer(ch, destination);
	});
};

export const teleportPlayersToPoints = (characterList: Model[], destinationPoints: Part[]) => {
	characterList.forEach((ch, i) => {
		teleportPlayer(ch, destinationPoints[i]);
	});
};

export const teleportPlayer = (character: Model, destination: Part) => {
	const primaryPart = character.PrimaryPart;
	if (primaryPart) {
		primaryPart.CFrame = destination.CFrame;
	} else {
		print("Warning the character doesnt have a primaryPart ", primaryPart);
	}
};
