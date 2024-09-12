import { findElement, findElementShallow } from "shared/services/gom-service.module";
import { notifyServer, onClientReceiveMsg } from "shared/services/server-client-comm.module";
import { AnimatorManager } from "../animator-manager/animator-manater.module";
import { getHumanoidFromUserId } from "shared/services/player-game-service.module";
import { UIManager } from "../ui-manager/ui-manager.module";

const w = game.GetService("Workspace");
const worldFolder = findElement(w, "World");
const worldChildren = worldFolder.GetChildren();

/* to test run animation for certain players
const pS = game.GetService("Players");
const currentUserId = pS.LocalPlayer.UserId; */

const animatorManager = new AnimatorManager();
const uiManager = new UIManager();

export const setupAnimations = () => {
	onClientReceiveMsg((msg) => {
		print("MESSAGE IN CLIENT: ", msg);
		if (msg.type === "ANIMATE") {
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

			animatorManager.playCabinetAnimation(idRoom);
		} else if (msg.type === "RESET_ANIMATE") {
			const data = msg.data as {
				roomId: number;
				objectId: string;
			};
			const idRoom = data.roomId;
			animatorManager.resetCabinetAnimation(idRoom);
		} else if (msg.type === "GUI") {
			const data = msg.data as {
				objectId: string;
				userId: number;
				tip: string[];
			};

			//remove player Movement
			const humanoid = getHumanoidFromUserId(data.userId);
			humanoid.WalkSpeed = 0;

			//display the UI of the paper
			const pS = game.GetService("Players");
			const onGuiPaperBackButtonClickCb = () => {
				//send message to server to able the paper Interaction

				const msg = {
					type: "PAPER_GUI_CLOSED",
					data: undefined
				};
				humanoid.WalkSpeed = 16;
				notifyServer(msg);
			};

			uiManager.showPaper(pS.LocalPlayer, data.tip.join(), onGuiPaperBackButtonClickCb);
		}
	});
};
