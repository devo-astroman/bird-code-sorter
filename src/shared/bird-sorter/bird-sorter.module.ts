import { Room } from "shared/room/room.module";

export class BirdSorter {
	private room: Room;
	private instance: Instance;

	constructor(room: Room) {
		print("BirdSorter!");
		this.room = room;
		this.instance = this.room.getRootInstace();
		this.room.onResetEvent(() => {
			this.room.Destroy();
			wait(3);
			print("Restarting");
			this.createNewRoom();
		});
		this.room.init();
	}

	private createNewRoom() {
		print("New BirdSorter!");
		this.room = new Room(this.instance);
		this.room.onResetEvent(() => {
			this.room.Destroy();
			wait(3);
			print("Restarting second time!!!");
			this.createNewRoom();
		});
		this.room.init();
	}
}
