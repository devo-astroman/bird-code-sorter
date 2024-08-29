import { Observer } from "@rbxts/observer";
import { MATCH_FINISH, PLAYER_IN_MATCH_DATA, ROOM_PHASE } from "shared/constants.module";
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
	private players$: Observer<PLAYER_IN_MATCH_DATA[]>;

	private preMatch!: Prematch;
	private match!: Match;
	private win!: Win;
	private loose!: Loose;

	private phaseFinishedEvent: BindableEvent;
	constructor(instance: Instance) {
		super();
		print("- Room -");
		this.stores = new Stores();
		this.gom = new RoomGom(instance);
		this.room$ = this.stores.getRoomStoreState$();
		this.players$ = this.stores.getPlayerStoreState$();
		this.phaseFinishedEvent = this.gom.getPhaseFinishedEvent();

		this.gom.onPhaseFinished((id: ROOM_PHASE, data: Model[] | MATCH_FINISH) => {
			if (id === ROOM_PHASE.PREMATCH) {
				const userIds = (data as Model[]).map((d) => getUserIdFromPlayerCharacter(d));
				this.stores.setMatchStorePlayers(userIds);
				this.stores.setRoomStoreState(ROOM_PHASE.MATCH);
			} else if (id === ROOM_PHASE.MATCH) {
				if (data === MATCH_FINISH.WIN) {
					print("WIN!!!");
				} else {
					print("LOOSE!!!");
				}
			} else {
				print("warning there is no phase with id ", id);
			}
		});

		this.players$.connect((data) => {
			print("PLAAAYERS:  ", data);
		});

		const prematchFolder = this.gom.getPrematchFolder();
		if (prematchFolder) {
			this.preMatch = new Prematch(ROOM_PHASE.PREMATCH, prematchFolder, this.phaseFinishedEvent);
		}
		const matchFolder = this.gom.getMatchFolder();
		if (matchFolder) {
			this.match = new Match(ROOM_PHASE.MATCH, matchFolder, this.stores);
			this.match.getPlayerInteractionEvent().Event.Connect((data) => {
				print("Interaction data ", data);
			});

			this.match.getFinishedEvent().Event.Connect((data: unknown) => {
				print("Finished data ", data);
				if (data === MATCH_FINISH.WIN) {
					//congrats the player
					this.stores.setRoomStoreState(ROOM_PHASE.WIN);
				} else {
					//congrats the player
					this.stores.setRoomStoreState(ROOM_PHASE.LOOSE);
				}
			});
		}

		const winFolder = this.gom.getWinFolder();
		this.win = new Win(0, this.stores, winFolder);

		this.loose = new Loose(0, this.stores);
		print("before prepareMaid");
		this.prepareMaid();
	}

	init() {
		this.room$.connect((phase) => {
			if (phase !== undefined) {
				if (phase === ROOM_PHASE.PREMATCH) {
					this.preMatch.init();
					//preMatch.finished(()=>this.stores.setRoomStoreState(ROOM_PHASE.MATCH))
				} else if (phase === ROOM_PHASE.MATCH) {
					print("match");
					print("players in the match ", this.stores.getPlayerStoreState());
					//match.init
					this.match.init();
				} else if (phase === ROOM_PHASE.WIN) {
					print("win");
					this.win.init();
				} else if (phase === ROOM_PHASE.LOOSE) {
					print("loose");
					//this.match.Destroy(); //

					//loop through all the players and explote them
					this.loose.killPlayers();
				}
			}
		});

		this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
	}

	prepareMaid() {
		this.addListToMaid([this.stores, this.gom, this.preMatch, this.match]);
	}
}
