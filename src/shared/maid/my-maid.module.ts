import Maid from "@rbxts/maid";

export abstract class MyMaid {
	private maid: Maid = new Maid();
	abstract prepareMaid(): void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addListToMaid(list: ({ Destroy: () => void } | RBXScriptConnection)[]) {
		print("adding to maid ", list);
		list.forEach((element) => {
			// eslint-disable-next-line roblox-ts/lua-truthiness
			if (element) this.maid.GiveTask(element);
		});
	}

	Destroy() {
		print("Maid from abstract");
		this.prepareMaid();
		this.maid.Destroy();
	}
}
