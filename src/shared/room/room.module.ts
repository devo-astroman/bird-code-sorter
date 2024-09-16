import { Observer } from "@rbxts/observer";
import { MATCH_FINISH, ROOM_PHASE } from "shared/constants.module";
import { Stores } from "shared/stores/stores.module";
import { RoomGom } from "./room-gom.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { saveWinMatchData } from "shared/services/server-store-manager.module";

export class Room extends MyMaid {
	private stores: Stores;
	private gom: RoomGom;
	private room$: Observer<ROOM_PHASE>;
	private resetEvent: BindableEvent;
	private id!: number;

	constructor(instance: Instance) {
		super();
		print("- Room -");
		this.stores = new Stores();
		this.gom = new RoomGom(instance);
		this.room$ = this.stores.getRoomStoreState$();
		this.resetEvent = this.gom.getResetEvent();

		this.gom.createPrematch(ROOM_PHASE.PREMATCH);
		this.gom.onPrematchFinished((usersIds) => {
			//allow players go to match
			this.stores.setMatchStorePlayers(usersIds); //These two should go to one action
			this.stores.setRoomStoreState(ROOM_PHASE.MATCH); //These two should go to one action
		});

		this.gom.createMatch(ROOM_PHASE.MATCH, this.stores);
		this.gom.onMatchFinished((data: MATCH_FINISH, metaData: { time: number; players: number[] }) => {
			if (data === MATCH_FINISH.WIN) {
				saveWinMatchData(metaData);
				//congrats the player
				this.stores.setRoomStoreState(ROOM_PHASE.WIN);
			} else if (data === MATCH_FINISH.LOOSE) {
				//kill the players
				this.stores.setRoomStoreState(ROOM_PHASE.LOOSE);
			} else {
				//abort
				this.stores.setRoomStoreState(ROOM_PHASE.ABORTING);
			}
		});

		this.gom.createWin(this.stores);
		this.gom.onWinFinished(() => {
			this.resetEvent.Fire();
		});

		this.gom.createLoose(this.stores);
		this.gom.onLooseFinished(() => {
			this.resetEvent.Fire();
		});
		print("before prepareMaid");
		this.prepareMaid();
	}

	init(id: number) {
		this.gom.updateTop10Board();
		this.id = id;
		this.gom.setIdValue(id);
		this.room$.connect((phase) => {
			if (phase !== undefined) {
				if (phase === ROOM_PHASE.PREMATCH) {
					this.gom.initPrematch();
				} else if (phase === ROOM_PHASE.MATCH) {
					this.gom.initMatch();
				} else if (phase === ROOM_PHASE.WIN) {
					this.gom.initWin();
				} else if (phase === ROOM_PHASE.LOOSE) {
					this.gom.initLoose();
				} else if (phase === ROOM_PHASE.ABORTING) {
					this.resetEvent.Fire();
				}
			}
		});

		this.stores.setRoomStoreState(ROOM_PHASE.PREMATCH);
	}

	getResetEvent() {
		return this.resetEvent;
	}

	onResetEvent(cb: () => void) {
		this.maidConnection(this.resetEvent.Event, cb);
	}

	getRootInstace() {
		return this.gom.getInstace();
	}

	getRoomId() {
		return this.id;
	}

	prepareMaid() {
		const list = [this.stores, this.gom];
		this.addListToMaid(list);
	}
}
