import { ROOM_PHASE } from "shared/constants.module";
import { RoomStore } from "./room-store.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { MATCH_STATE, MatchStore } from "./match-store.module";

export class Stores extends MyMaid {
	private roomStore: RoomStore;
	private matchStore: MatchStore;
	constructor() {
		super();
		this.roomStore = new RoomStore();
		this.matchStore = new MatchStore();
	}

	getRoomStoreState$() {
		return this.roomStore.getObserver();
	}

	setRoomStoreState(newState: ROOM_PHASE) {
		this.roomStore.setPhase(newState);
	}

	setMatchStoreState(newState: MATCH_STATE) {
		this.matchStore.setState(newState);
	}

	getMatchStoreState$() {
		return this.matchStore.getObserver();
	}

	getMatchStoreState() {
		const state = this.matchStore.getValue();
		assert(state, "Warning store state undefined ");
		return state as MATCH_STATE;
	}

	getPlayersInMatchStoreState() {
		const matchState = this.matchStore.getValue();

		if (!matchState) return [];

		return matchState.handPlayers.map((hP) => hP.userId);
	}

	setMatchStorePlayers(playersUserId: number[]) {
		this.matchStore.setPlayersUserId(playersUserId);
	}

	prepareMaid(): void {
		this.addListToMaid([this.roomStore, this.matchStore]);
	}
}
