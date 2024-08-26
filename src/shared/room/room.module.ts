import { Observer } from "@rbxts/observer";
import { ROOM_PHASE } from "shared/constants.module";
import { Prematch } from "shared/prematch/prematch.module";
import { Stores } from "shared/stores/stores.module";
import { RoomGom } from "./room-gom.module";
import { Match } from "shared/match/match.module";

export class Room {
	private stores: Stores;
	private roomGom: RoomGom;

	private room$: Observer<ROOM_PHASE>;
	private players$: Observer<Model[]>;

	private preMatch!: Prematch;
	private match!: Match;
	constructor(instance: Instance) {
		print(" - Room -");
		this.stores = new Stores();
		this.roomGom = new RoomGom(instance);
		this.room$ = this.stores.getRoomStoreState$();
		this.players$ = this.stores.getPlayerStoreState$();

		this.players$.connect((data) => {
			print("PLAAAYERS:  ", data);
		});

		const prematchFolder = this.roomGom.getPrematchFolder();
		if (prematchFolder) {
			this.preMatch = new Prematch(prematchFolder, (players) => {
				this.stores.setPlayersStoreState(players);
				this.stores.setRoomStoreState(ROOM_PHASE.MATCH);
			});
		}
		const matchFolder = this.roomGom.getMatchFolder();
		if (matchFolder) {
			this.match = new Match(matchFolder);
		}
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
				} else if (phase === ROOM_PHASE.LOOSE) {
					print("loose");
				}
			}
		});

		this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
	}

	Destroy() {
		print("Prematch.destroy");
		this.stores.Destroy();
	}
}
