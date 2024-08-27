import { BIRD_VALUE, ROOM_PHASE } from "shared/constants.module";
import { RoomStore } from "./room-store.module";
import { PlayerStore } from "./player-store.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { ID_SLOTS, MatchStore, PLACE } from "./match-store.module";

export class Stores extends MyMaid {
	private roomStore: RoomStore;
	private playerStore: PlayerStore;
	private matchStore: MatchStore;
	constructor() {
		super();
		this.roomStore = new RoomStore();
		this.playerStore = new PlayerStore();
		this.matchStore = new MatchStore();
	}

	getRoomStoreState$() {
		return this.roomStore.getObserver();
	}

	setRoomStoreState(newState: ROOM_PHASE) {
		this.roomStore.setPhase(newState);
	}

	getPlayerStoreState$() {
		return this.playerStore.getObserver();
	}

	getPlayerStoreState() {
		return this.playerStore.getValue();
	}

	setPlayersStoreState(players: Model[]) {
		this.playerStore.setPlayers(players);
	}

	getMatchStoreState$() {
		return this.matchStore.getObserver();
	}

	getMatchStoreState() {
		return this.matchStore.getValue();
	}

	setMatchStoreBirdLocation(idBird: BIRD_VALUE, place: PLACE, detailPlace: ID_SLOTS | number) {
		return this.matchStore.setBirdPlacePosition(idBird, place, detailPlace);
	}

	prepareMaid(): void {
		this.addListToMaid([this.roomStore, this.playerStore]);
	}
}
