export const findElement = <T extends Instance>(root: Instance, nameElement: string) => {
	const element = root.FindFirstChild(nameElement, true);

	const assertMsg = `Warning not found  ${nameElement}`;
	assert(element, assertMsg);

	return element as T;
};
