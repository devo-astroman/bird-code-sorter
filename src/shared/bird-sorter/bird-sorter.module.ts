import { Room } from "shared/room/room.module";

export class BirdSorter {
	private room: Room;
	private instance: Instance;
	private id: number;

	constructor(id: number, room: Room) {
		print("BirdSorter!");
		this.id = id;
		this.room = room;
		this.instance = this.room.getRootInstace();
		this.room.onResetEvent(() => {
			this.room.Destroy();
			wait(3);
			print("Restarting");
			this.createNewRoom();
		});
		this.room.init(id);
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
		this.room.init(this.id);
	}
}
