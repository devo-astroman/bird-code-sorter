import Maid from "@rbxts/maid";
import { findElement } from "./gom-service.module";
const maid = new Maid();

const w = game.GetService("Workspace");
const remoteEvent = findElement<RemoteEvent>(w, "RemoteEvent");

export const notifyAllPlayers = (msg: { type: string; data: unknown }) => {
	print("should notify all players! ", msg);
	remoteEvent.FireAllClients(msg);
};

export const onClientReceiveMsg = (cb: (msg: { type: string; data: unknown }) => void) => {
	const connection = remoteEvent.OnClientEvent.Connect(cb);
	maid.GiveTask(connection);
};

export const notifySpecificPlayer = (player: Player, msg: { type: string; data: unknown }) => {
	remoteEvent.FireClient(player, msg);
};

export const notifyServer = (msg: { type: string; data: unknown }) => {
	remoteEvent.FireServer(msg);
};

export const onServerReceiveMsg = (cb: (player: Player, ...args: unknown[]) => void) => {
	const connection = remoteEvent.OnServerEvent.Connect(cb);
	maid.GiveTask(connection);
};

export const destroyServerClientComm = () => {
	maid.Destroy();
};
