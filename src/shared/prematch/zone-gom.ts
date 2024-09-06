import { Zone } from "@rbxts/zone-plus";
import { PLAYER_JUMP_HEIGHT } from "shared/constants.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { findElement } from "shared/services/gom-service.module";
import { getCharacterFromUserId, playerDiesEvent } from "shared/services/player-game-service.module";

export class ZoneGom extends MyMaid {
	private zone: Zone;

	private part: Part;
	private connectionEnter!: RBXScriptConnection;
	private connectionExit!: RBXScriptConnection;
	private changeEvent!: BindableEvent;
	private playerRemoveConnection!: RBXScriptConnection;
	private playerDiesConnection!: RBXScriptConnection;
	constructor(part: Part) {
		super();
		this.part = part;
		this.zone = new Zone(part);
	}

	onPlayerDied(cb: (playerId: number) => void) {
		this.maidConnection(playerDiesEvent.Event, cb);
	}

	onPlayerRemoved(cb: (player: Player) => void) {
		const pS = game.GetService("Players");
		this.playerRemoveConnection = this.maidConnection(pS.PlayerRemoving, cb);
	}

	triggerOnPlayerEnter(fn: (playerUserId: number) => void) {
		this.connectionEnter = this.zone.playerEntered.Connect((player) => {
			const userId = player.UserId;
			this.changeEvent.Fire({ event: "PlayerEnter", data: userId });
			fn(userId);
		});
	}

	triggerOnPlayerExit(fn: (playerUserId: number) => void) {
		this.connectionExit = this.zone.playerExited.Connect((player) => {
			const userId = player.UserId;
			this.changeEvent.Fire({ event: "PlayerExit", data: userId });
			fn(userId);
		});
	}

	removeTriggerOnPlayerEnter() {
		this.maidDestroyConnection(this.connectionEnter);
	}

	removeTriggerOnPlayerExit() {
		this.connectionExit.Disconnect();
	}

	removeOnPlayerRemoved() {
		this.playerRemoveConnection.Disconnect();
	}

	removeOnPlayerDies() {
		this.playerDiesConnection.Disconnect();
	}

	blockPlayerJump(userId: number) {
		const character = getCharacterFromUserId(userId);
		const humanoid = findElement<Humanoid>(character, "Humanoid");
		humanoid.JumpHeight = 0;
	}

	allowPlayerJump(userId: number) {
		const character = getCharacterFromUserId(userId);
		const humanoid = findElement<Humanoid>(character, "Humanoid");
		humanoid.JumpHeight = PLAYER_JUMP_HEIGHT;
	}

	onFirstPlayerEnter(cb: () => void) {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.maidConnection(this.changeEvent.Event, (eventName: string) => {
			if (eventName === "PlayerEnter") cb();
		});
	}

	fireChangeFirstPlayerEnter() {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.changeEvent.Fire("PlayerEnter");
	}

	onLastPlayerExit(cb: () => void) {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.maidConnection(this.changeEvent.Event, (eventName: string) => {
			if (eventName === "LastPlayerExit") cb();
		});
	}

	fireChangeLastPlayerExit() {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		this.changeEvent.Fire("LastPlayerExit");
	}

	getChangeEvent() {
		this.changeEvent = findElement<BindableEvent>(this.part, "ChangeEvent");
		return this.changeEvent;
	}

	prepareMaid(): void {
		this.zone.destroy();
		/* this.connectionEnter.Disconnect();
		this.connectionExit.Disconnect(); */
		//this.addListToMaid([this.connectionEnter, this.connectionExit]);
	}
}
