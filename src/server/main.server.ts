import Binder from "@rbxts/binder";
import { ROOM_TAG } from "shared/constants.module";
import { Room } from "shared/room/room.module";
import { onPlayerAdded } from "shared/services/player-game-service.module";

const Players = game.GetService("Players");
Players.PlayerAdded.Connect(onPlayerAdded);

const binder = new Binder(ROOM_TAG, Room);
binder.Start();
binder.GetAll().forEach((element: Room) => {
	element.init();
});
