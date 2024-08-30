export const findElement = (root: Instance, nameElement: string) => {
	const element = root.FindFirstChild(nameElement, true);

	const assertMsg = `Warning not found  ${nameElement}`;
	assert(element, assertMsg);

	return element;
};
