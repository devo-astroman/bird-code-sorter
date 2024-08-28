import Binder from "@rbxts/binder";
import { ROOM_TAG } from "shared/constants.module";
import { Room } from "shared/room/room.module";
import { onPlayerAdded } from "shared/services/player-game-service.module";

const Players = game.GetService("Players");
Players.PlayerAdded.Connect(onPlayerAdded);

const binder = new Binder(ROOM_TAG, Room);
binder.Start();
wait(5); // to ensure room is binded
binder.GetAll().forEach((element: Room) => {
	element.init();
});

/* To test maid */
/* wait(5);
print("before room destruction");
binder.GetAll().forEach((element: Room) => {
	element.Destroy();
}); */
/*--- To test maid */
