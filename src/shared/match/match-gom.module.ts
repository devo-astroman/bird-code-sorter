export class MatchGom {
	private root: Folder;
	constructor(root: Folder) {
		this.root = root;
	}

	displaySecs(secs: number) {
		const screensFolder = this.root.FindFirstChild("Screens", true) as Folder;
		const parts = screensFolder.GetChildren() as Part[];
		const textLabels = parts.map((p) => {
			const tl = p.FindFirstChild("TextLabel", true) as TextLabel;
			if (!tl) {
				print("warning not TextLabel found ", tl);
			}

			return tl;
		}) as TextLabel[];

		textLabels.forEach((tl) => {
			tl.Text = secs + "";
		});
	}

	hideTime() {
		const screensFolder = this.root.FindFirstChild("Screens", true) as Folder;
		const parts = screensFolder.GetChildren() as Part[];
		const surfaceGuis = parts.map((p) => {
			const sg = p.FindFirstChild("SurfaceGui", true) as SurfaceGui;
			if (!sg) {
				print("warning not SurfaceGui found ", sg);
			}

			return sg;
		}) as SurfaceGui[];

		surfaceGuis.forEach((sg) => {
			sg.Enabled = false;
		});
	}

	showTime() {
		const screensFolder = this.root.FindFirstChild("Screens", true) as Folder;
		const parts = screensFolder.GetChildren() as Part[];
		const surfaceGuis = parts.map((p) => {
			const sg = p.FindFirstChild("SurfaceGui", true) as SurfaceGui;
			if (!sg) {
				print("warning not SurfaceGui found ", sg);
			}

			return sg;
		}) as SurfaceGui[];

		surfaceGuis.forEach((sg) => {
			sg.Enabled = true;
		});
	}

	openMatch() {
		const door2 = this.root.FindFirstChild("Door2", true) as MeshPart;
		door2.CanCollide = false;
		door2.Transparency = 1;
	}

	Destroy() {
		//
	}
}
