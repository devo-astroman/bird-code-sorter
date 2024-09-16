import Maid from "@rbxts/maid";
import { Observer } from "@rbxts/observer";

export abstract class MyMaid {
	private maid: Maid = new Maid();
	abstract prepareMaid(): void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addListToMaid(list: ({ Destroy: () => void } | RBXScriptConnection)[], msg?: string) {
		// eslint-disable-next-line roblox-ts/lua-truthiness
		if (!msg) msg = ".";
		print("maid msg ", msg);
		print("adding to maid ", list);
		list.forEach((element) => {
			// eslint-disable-next-line roblox-ts/lua-truthiness
			if (element) this.maid.GiveTask(element);
		});
	}

	maidConnection<T extends unknown[]>(signal: RBXScriptSignal, callback: (...params: T) => void) {
		const connection = signal.Connect(callback);
		this.maid.GiveTask(connection);
		return connection;
	}

	maidObserverConnection<T>(observer: Observer<T>, callback: (params: T) => void) {
		const connection = observer.connect((data) => {
			assert(data, "Warning undefined state data ");
			callback(data);
		});
		this.maid.GiveTask(connection);
		return connection;
	}

	maidDestroyConnection(connection: RBXScriptConnection) {
		connection.Disconnect();
	}

	Destroy() {
		print("Maid from abstract");
		this.prepareMaid();
		this.maid.Destroy();
	}
}
