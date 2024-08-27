import Maid from "@rbxts/maid";

export abstract class MyMaid {
	protected maid: Maid = new Maid();

	abstract prepareMaid(): void;

	addListToMaid(list: ({ Destroy: () => void } | RBXScriptConnection)[]) {
		print("adding to maid ", list);
		list.forEach((element) => {
			if (!!element) this.maid.GiveTask(element);
		});
	}

	Destroy() {
		print("Maid from abstract");
		this.prepareMaid();
		this.maid.Destroy();
	}
}
