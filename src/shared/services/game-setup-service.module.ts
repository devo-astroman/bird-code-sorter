import { DOOR_CG, PLAYER_IN_PREMATCH_CG, ROOM_TAG } from "shared/constants.module";
import { onPlayerAdded } from "./player-game-service.module";
import { BirdSorter } from "shared/bird-sorter/bird-sorter.module";
import Binder from "@rbxts/binder";
import { Room } from "shared/room/room.module";

export const setupCollisionGroups = () => {
	const phS = game.GetService("PhysicsService");
	phS.RegisterCollisionGroup(PLAYER_IN_PREMATCH_CG);
	phS.RegisterCollisionGroup(DOOR_CG);
	phS.CollisionGroupSetCollidable(DOOR_CG, "Default", true);
	phS.CollisionGroupSetCollidable(DOOR_CG, PLAYER_IN_PREMATCH_CG, false);
};

export const setupConnectingPlayers = () => {
	const Players = game.GetService("Players");
	Players.PlayerAdded.Connect(onPlayerAdded);
};

export const setupRooms = () => {
	const binder = new Binder(ROOM_TAG, Room);
	binder.Start();
	wait(5);

	binder.GetAll().forEach((element: Room, i) => {
		new BirdSorter(i, element);
	});
};
