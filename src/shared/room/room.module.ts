import { Observer } from "@rbxts/observer";
import { ROOM_PHASE } from "shared/constants.module";
import { Prematch } from "shared/prematch/prematch.module";
import { Stores } from "shared/stores/stores.module";
import { RoomGom } from "./room-gom.module";
import { Match } from "shared/match/match.module";

export class Room {
	private stores: Stores;
	private gom: RoomGom;

	private room$: Observer<ROOM_PHASE>;
	private players$: Observer<Model[]>;

	private preMatch!: Prematch;
	private match!: Match;

	private phaseFinishedEvent: BindableEvent;
	constructor(instance: Instance) {
		print(" - Room -");
		this.stores = new Stores();
		this.gom = new RoomGom(instance);
		this.room$ = this.stores.getRoomStoreState$();
		this.players$ = this.stores.getPlayerStoreState$();
		this.phaseFinishedEvent = this.gom.getPhaseFinishedEvent();

		this.gom.onPhaseFinished((players) => {
			this.stores.setPlayersStoreState(players);
			this.stores.setRoomStoreState(ROOM_PHASE.MATCH);
		});

		this.players$.connect((data) => {
			print("PLAAAYERS:  ", data);
		});

		const prematchFolder = this.gom.getPrematchFolder();
		if (prematchFolder) {
			this.preMatch = new Prematch(prematchFolder, this.phaseFinishedEvent);
		}
		const matchFolder = this.gom.getMatchFolder();
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
