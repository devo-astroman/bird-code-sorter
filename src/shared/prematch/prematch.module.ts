export class Prematch {
	constructor(instance: Instance) {
		print("Prematch --- ", instance);
	}

	Destroy() {
		print("Prematch.destroy");
	}
}
