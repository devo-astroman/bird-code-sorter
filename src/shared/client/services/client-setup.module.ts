import { findElement, findElementShallow } from "shared/services/gom-service.module";
import { onClientReceiveMsg } from "shared/services/server-client-comm.module";

const w = game.GetService("Workspace");
const worldFolder = findElement(w, "World");
const worldChildren = worldFolder.GetChildren();

/* to test run animation for certain players
const pS = game.GetService("Players");
const currentUserId = pS.LocalPlayer.UserId; */

export const setupAnimations = () => {
	onClientReceiveMsg((msg) => {
		print("MESSAGE IN CLIENT: ", msg);
		const data = msg.data as {
			roomId: number;
			objectId: string;
			userId: number;
		};

		const idRoom = data.roomId;

		const roomFolder = worldChildren
			.filter((child) => {
				const isFolder = child.IsA("Folder");
				return isFolder;
			})
			.find((child) => {
				const numberValue = findElementShallow<NumberValue>(child, "Value");
				return numberValue.Value === idRoom;
			});

		if (!roomFolder) {
			print("Warning not room found with that id");
		}

		//TODO: Improve, modulate the code
		const matchFolder = findElementShallow<Folder>(roomFolder as Folder, "Match");
		const cabinetFolder = findElementShallow<Folder>(matchFolder, "Cabinet");
		const cabinetDoor = findElementShallow<Folder>(cabinetFolder, "cabinet_door");
		const animator = findElement<Animator>(cabinetDoor, "Animator");
		const animation = findElement<Animation>(cabinetDoor, "Animation");
		const track = animator.LoadAnimation(animation);
		track.Play();
	});
};
