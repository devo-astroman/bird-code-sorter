import { Observer } from "@rbxts/observer";
import { MATCH_FINISH, PLAYER_IN_MATCH_DATA, ROOM_PHASE } from "shared/constants.module";
import { Prematch } from "shared/prematch/prematch.module";
import { Stores } from "shared/stores/stores.module";
import { RoomGom } from "./room-gom.module";
import { Match } from "shared/match/match.module";
import { MyMaid } from "shared/maid/my-maid.module";

export class Room extends MyMaid {
	private stores: Stores;
	private gom: RoomGom;

	private room$: Observer<ROOM_PHASE>;
	private players$: Observer<PLAYER_IN_MATCH_DATA[]>;

	private preMatch!: Prematch;
	private match!: Match;

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
				this.stores.setPlayersStoreState(data as Model[]);
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

			this.match.getFinishedEvent().Event.Connect((data) => {
				print("Finished data ", data);
			});
		}
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
				} else if (phase === ROOM_PHASE.LOOSE) {
					print("loose");
				}
			}
		});

		this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
	}

	prepareMaid() {
		this.addListToMaid([this.stores, this.gom, this.preMatch, this.match]);
	}
}
