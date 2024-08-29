import { ID_SLOTS, ROOM_PHASE } from "shared/constants.module";
import { RoomStore } from "./room-store.module";
import { PlayerStore } from "./player-store.module";
import { MyMaid } from "shared/maid/my-maid.module";
import { MATCH_STATE, MatchStore } from "./match-store-.module";

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

	setMatchStoreState(newState: MATCH_STATE) {
		this.matchStore.setState(newState);
	}

	getMatchStoreState$() {
		return this.matchStore.getObserver();
	}

	getMatchStoreState() {
		return this.matchStore.getValue();
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
		this.addListToMaid([this.roomStore, this.playerStore]);
	}
}
