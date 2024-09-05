import { findElement } from "./gom-service.module";

export const displayInScreenList = (screens: Part[], message: string) => {
	screens.forEach((screen) => {
		const textLabel = screen.FindFirstChild("TextLabel", true) as TextLabel;
		if (!textLabel) {
			print("warning not TextLabel found ", "TextLabel");
		}

		displayInScreen(textLabel, message);
	});
};

export const displayInScreen = (textLabel: TextLabel, message: string) => {
	textLabel.Text = message;
};

export const hideScreenList = (screens: Part[]) => {
	const surfaceGuis = screens.map((screen) => {
		const surfaceGui = screen.FindFirstChild("SurfaceGui", true) as SurfaceGui;
		if (!surfaceGui) {
			print("warning not SurfaceGui found ", surfaceGui);
		}

		return surfaceGui;
	}) as SurfaceGui[];

	surfaceGuis.forEach((surfaceGui) => {
		surfaceGui.Enabled = false;
	});
};

export const setTextScreenList = (screens: Part[], text: string) => {
	const surfaceGuis = screens.map((screen) => {
		const surfaceGui = findElement<SurfaceGui>(screen, "SurfaceGui");
		return surfaceGui;
	}) as SurfaceGui[];

	surfaceGuis.forEach((surfaceGui) => {
		const textLabel = <TextLabel>findElement(surfaceGui, "TextLabel");
		textLabel.Text = text;
	});
};

export const showScreenList = (screens: Part[]) => {
	const surfaceGuis = screens.map((screen) => {
		const surfaceGui = screen.FindFirstChild("SurfaceGui", true) as SurfaceGui;
		if (!surfaceGui) {
			print("warning not SurfaceGui found ", surfaceGui);
		}

		return surfaceGui;
	}) as SurfaceGui[];

	surfaceGuis.forEach((surfaceGui) => {
		surfaceGui.Enabled = true;
	});
};

export const getResetRichTextFormat = (message: string) => {
	//Congrats!!!<br />Time to Reset: <br />5
	//<font size="38">Congrats!!!</font><br /><font size="35">Time to Reset: <br />5</font>
	return `<font size="38">Congrats!!!</font><br /><font size="35">Time to Reset:<br />${message}</font>`;
};
