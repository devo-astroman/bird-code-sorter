import { LOG_ENTRY, SLOT_VALUE, SLOT_VALUE_HEXS, SLOT_VALUE_STRINGS_INITIALS } from "shared/constants.module";
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

export const getPrematchRichTextFormat = (secs: number, playersInfo: { n: number; max: number }) => {
	// <font size="35">4 <font size="20">secs</font> to start<br/></font><font size="38">1/4</font>
	const { n, max } = playersInfo;
	return `<font size="35">${secs} <font size="20">secs</font> to start<br/></font><font size="38">${n}/${max}</font>`;
};

const getCombinationRichTextFormat = (combination: SLOT_VALUE[]) => {
	//<font size="20" color="#FF0000">R</font> <font size="20" color="#00FF00">G</font> <font size="20" color="#0000FF">B</font> <font size="20" color="#800080">P</font>
	let lineCombination = "";
	combination.forEach((sv) => {
		lineCombination += `<font size="20" color="${SLOT_VALUE_HEXS[sv]}">${SLOT_VALUE_STRINGS_INITIALS[sv]}</font>`;
	});

	return lineCombination;
};

export const getHistoryLogRichTextFormat = (log: LOG_ENTRY[]) => {
	let text = "";
	log.forEach((dataLine, i) => {
		const combinationRichText = getCombinationRichTextFormat(dataLine.combination);

		const line = `<font size="12" color="#FF0000">${i + 1}</font><stroke color="#000000">${combinationRichText}</stroke><font size="18" color="#000000">${dataLine.nCorrects}</font><br/>`;

		text += line;
	});

	return text;
};
