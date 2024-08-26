export const setTagToChildren = (inst: Instance, tag: string, exceptPartNames: string[] = []) => {
	inst.GetDescendants().forEach((i) => {
		if (i.IsA("BasePart") && !exceptPartNames.some((name) => i.Name === name)) {
			i.AddTag(tag);
		}

		setTagToChildren(i, tag, exceptPartNames);
	});
};

export const setTagToChildNamed = (inst: Instance, tag: string, childName: string) => {
	inst.GetDescendants().forEach((i) => {
		if (i.IsA("BasePart") && i.Name === childName) {
			i.AddTag(tag);
		}
	});
};
