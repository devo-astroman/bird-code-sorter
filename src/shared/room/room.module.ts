import { Observer } from "@rbxts/observer";
import { MATCH_FINISH, ROOM_PHASE } from "shared/constants.module";
import { Prematch } from "shared/prematch/prematch.module";
import { Stores } from "shared/stores/stores.module";
import { RoomGom } from "./room-gom.module";
import { Match } from "shared/match/match.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { getUserIdFromPlayerCharacter } from "shared/services/player-game-service.module";
import { Loose } from "shared/loose/loose.module";
import { Win } from "shared/win/win.module";

export class Room extends MyMaid {
	private stores: Stores;
	private gom: RoomGom;

	private room$: Observer<ROOM_PHASE>;

	//private preMatch!: Prematch;
	//private match!: Match;
	//	private win!: Win;
	//private loose!: Loose;

	private resetEvent: BindableEvent;

	private connection!: RBXScriptConnection;
	private connections: RBXScriptConnection[] = [];
	constructor(instance: Instance) {
		super();
		print("- Room -");
		this.stores = new Stores();
		this.gom = new RoomGom(instance);
		this.room$ = this.stores.getRoomStoreState$();
		this.resetEvent = this.gom.getResetEvent();

		//const prematchFolder = this.gom.getPrematchFolder();
		//this.preMatch = new Prematch(ROOM_PHASE.PREMATCH, prematchFolder);
		this.gom.createPrematch(ROOM_PHASE.PREMATCH);
		this.gom.onPrematchFinished((players) => {
			//allow players go to match
			const userIds = (players as Model[]).map((d) => getUserIdFromPlayerCharacter(d));
			this.stores.setMatchStorePlayers(userIds); //These two should go to one action
			this.stores.setRoomStoreState(ROOM_PHASE.MATCH); //These two should go to one action
		});
		/* const conn1 = this.preMatch.getFinishedEvent().Event.Connect((players) => {
			//allow players go to match
			const userIds = (players as Model[]).map((d) => getUserIdFromPlayerCharacter(d));
			this.stores.setMatchStorePlayers(userIds); //These two should go to one action
			this.stores.setRoomStoreState(ROOM_PHASE.MATCH); //These two should go to one action
		}); */

		////////////////////////
		/* const matchFolder = this.gom.getMatchFolder(); */
		/* if (matchFolder) { */
		//this.match = new Match(ROOM_PHASE.MATCH, matchFolder, this.stores);
		this.gom.createMatch(ROOM_PHASE.MATCH, this.stores);
		this.gom.onMatchFinished((data: MATCH_FINISH) => {
			print("Finished data ", data);
			if (data === MATCH_FINISH.WIN) {
				//congrats the player
				this.stores.setRoomStoreState(ROOM_PHASE.WIN);
			} else {
				//congrats the player
				this.stores.setRoomStoreState(ROOM_PHASE.LOOSE);
			}
		});

		/* const conn2 = this.match.getPlayerInteractionEvent().Event.Connect((data) => {
				print("Interaction data ", data);
			});
			this.connections.push(conn2); */

		/* const conn3 = this.match.getFinishedEvent().Event.Connect((data: unknown) => {
			print("Finished data ", data);
			if (data === MATCH_FINISH.WIN) {
				//congrats the player
				this.stores.setRoomStoreState(ROOM_PHASE.WIN);
			} else {
				//congrats the player
				this.stores.setRoomStoreState(ROOM_PHASE.LOOSE);
			}
		});
		this.connections.push(conn3); */
		/* } */

		/* const winFolder = this.gom.getWinFolder();
		this.win = new Win(0, this.stores, winFolder); */

		this.gom.createWin(this.stores);
		this.gom.onWinFinished(() => {
			//this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
			this.resetEvent.Fire();
		});
		/* const conn4 = this.win.getFinishedEvent().Event.Connect(() => {
			//this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
			this.resetEvent.Fire();
		});
		this.connections.push(conn4); */

		//this.loose = new Loose(0, this.stores);
		this.gom.createLoose(this.stores);
		this.gom.onLooseFinished(() => {
			this.resetEvent.Fire();
		});
		print("before prepareMaid");
		this.prepareMaid();
	}

	init() {
		this.room$.connect((phase) => {
			if (phase !== undefined) {
				if (phase === ROOM_PHASE.PREMATCH) {
					this.gom.initPrematch();
					//this.preMatch.init();
					//preMatch.finished(()=>this.stores.setRoomStoreState(ROOM_PHASE.MATCH))
				} else if (phase === ROOM_PHASE.MATCH) {
					print("match");
					//match.init
					//this.match.init();
					this.gom.initMatch();
				} else if (phase === ROOM_PHASE.WIN) {
					print("win");
					//this.win.init();
					this.gom.initWin();
				} else if (phase === ROOM_PHASE.LOOSE) {
					print("loose");
					//this.loose.init();
					//this.loose.killPlayers();
					this.gom.initLoose();
				}
			}
		});

		this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
	}

	getResetEvent() {
		return this.resetEvent;
	}

	onResetEvent(cb: () => void) {
		this.connection = this.resetEvent.Event.Connect(cb);
	}

	getRootInstace() {
		return this.gom.getInstace();
	}

	prepareMaid() {
		const list = [this.stores, this.gom, this.connection, ...this.connections];

		this.addListToMaid(list);
	}
}
